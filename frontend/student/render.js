(function initStudentRender(global) {
  const app = global.studentApp;

  app.renderModuleNav = function renderModuleNav() {
    const container = document.getElementById("module-nav");
    if (app.state.modules.length === 0) {
      container.innerHTML = "<p>Нет доступных модулей.</p>";
      return;
    }

    container.innerHTML = app.state.modules
      .map((moduleItem) => {
        const topicsHtml = moduleItem.topics
          .map(
            (topic) => `
            <button class="topic-nav-btn ${topic.id === app.state.activeTopicId ? "active" : ""}" data-topic-id="${app.escapeHtml(topic.id)}">
              ${app.escapeHtml(topic.title)}
            </button>
          `,
          )
          .join("");
        return `
          <section class="topic-group">
            <h3>${app.escapeHtml(moduleItem.title)}</h3>
            ${topicsHtml}
          </section>
        `;
      })
      .join("");
  };

  app.renderContentBlock = function renderContentBlock(block) {
    if (!block || typeof block !== "object") return "";

    if (block.type === "text") {
      return `<p class="topic-paragraph">${app.escapeHtml(block.value)}</p>`;
    }

    if (block.type === "list") {
      const listValues = Array.isArray(block.value) ? block.value : Array.isArray(block.items) ? block.items : [];
      return `<ul class="topic-list">${listValues.map((item) => `<li>${app.escapeHtml(item)}</li>`).join("")}</ul>`;
    }

    if (block.type === "image") {
      return `<div class="topic-image-placeholder">${app.escapeHtml(block.value || block.alt || "Изображение")}</div>`;
    }

    return "";
  };

  app.shuffleList = function shuffleList(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  app.buildSelfCheckQuestions = function buildSelfCheckQuestions(trainerConfig) {
    const source = Array.isArray(trainerConfig?.questions) ? trainerConfig.questions : [];
    return source
      .map((item, index) => {
        const question = String(item?.question || "").trim();
        const optionsRaw = Array.isArray(item?.options) ? item.options : [];
        const options = optionsRaw.map((option) => String(option || "").trim()).filter(Boolean);
        const correctIndex = Number(item?.correctIndex);

        if (!question || options.length < 2) return null;
        if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) return null;

        return {
          id: `q${index + 1}`,
          question,
          options: app.shuffleList(options),
          correct: options[correctIndex],
        };
      })
      .filter(Boolean);
  };

  app.renderSelfCheckPanel = function renderSelfCheckPanel() {
    const panel = document.getElementById("trainer-pane");
    if (!panel) return;
    if (!app.state.selfCheckQuestions.length) {
      panel.classList.add("hidden");
      panel.innerHTML = "";
      const lessonLayout = document.getElementById("lesson-layout");
      if (lessonLayout) lessonLayout.classList.add("trainer-collapsed");
      return;
    }

    panel.classList.remove("hidden");
    const lessonLayout = document.getElementById("lesson-layout");
    if (lessonLayout) lessonLayout.classList.remove("trainer-collapsed");

    const resultClass =
      app.state.selfCheckResultType === "success" ? "form-message form-message-success" : "form-message";
    const trainerTitle = String(app.state.activeTopic?.trainer?.title || "Тест самопроверки");
    const trainerDescription = String(app.state.activeTopic?.trainer?.description || "Проверь знания по теме без просмотра материала.");

    const questionsHtml = app.state.selfCheckQuestions
      .map((question, index) => {
        const optionsHtml = question.options
          .map((option, optionIndex) => {
            const inputId = `${question.id}-option-${optionIndex}`;
            return `
              <label for="${inputId}" class="self-check-option">
                <input id="${inputId}" type="radio" name="${question.id}" value="${app.escapeHtml(option)}">
                <span>${app.escapeHtml(option)}</span>
              </label>
            `;
          })
          .join("");

        return `
          <article class="self-check-question">
            <p><strong>${index + 1}. ${app.escapeHtml(question.question)}</strong></p>
            <div class="self-check-options">${optionsHtml}</div>
          </article>
        `;
      })
      .join("");

    panel.innerHTML = `
      <header class="self-check-header">
        <h3>${app.escapeHtml(trainerTitle)}</h3>
        <p>${app.escapeHtml(trainerDescription)}</p>
      </header>
      <header class="self-check-header ${app.state.selfCheckMode ? "" : "hidden"}">
        <p>Материал слева скрыт. Ответь на вопросы по памяти, затем сверяйся с подсказкой.</p>
      </header>
      <div class="self-check-content">
        <form id="self-check-form" class="self-check-form">
          <div class="self-check-body ${app.state.selfCheckMode ? "" : "locked"}">
            ${questionsHtml}
            <p id="self-check-result" class="${resultClass}">${app.escapeHtml(app.state.selfCheckResultMessage || "")}</p>
          </div>
          <div class="form-actions self-check-actions ${app.state.selfCheckMode ? "active" : "locked"}">
            ${
              app.state.selfCheckMode
                ? `
                  <button class="btn btn-primary" type="submit">Проверить ответы</button>
                  <button class="btn btn-ghost" type="button" id="self-check-reset-btn">Сбросить</button>
                  <button class="btn btn-primary" type="button" id="self-check-toggle" aria-pressed="true">Завершить самопроверку</button>
                `
                : `
                  <button class="btn btn-primary" type="button" id="self-check-toggle" aria-pressed="false">Проверить себя</button>
                `
            }
          </div>
        </form>
      </div>
    `;
  };

  app.renderAccessState = function renderAccessState() {
    const stateEl = document.getElementById("access-state");
    if (!app.state.auth) return;
    const { student, accessActive } = app.state.auth;
    const renewLink = (window.qaSite && window.qaSite.whatsappLink) || "https://wa.me/";
    const infoTabActive = app.state.profileTab === "info";
    const passwordTabActive = app.state.profileTab === "password";
    const logoutTabActive = app.state.profileTab === "logout";
    const passwordMessageClass =
      app.state.profilePasswordMessageType === "success" ? "form-message form-message-success" : "form-message";

    stateEl.innerHTML = `
      <div class="profile-tabs" role="tablist" aria-label="Профиль ученика">
        <button class="btn btn-ghost ${infoTabActive ? "active" : ""}" type="button" data-action="profile-tab" data-tab="info" role="tab" aria-selected="${infoTabActive ? "true" : "false"}">Инфо / Подписка</button>
        <button class="btn btn-ghost ${passwordTabActive ? "active" : ""}" type="button" data-action="profile-tab" data-tab="password" role="tab" aria-selected="${passwordTabActive ? "true" : "false"}">Смена пароля</button>
        <button class="btn btn-ghost ${logoutTabActive ? "active" : ""}" type="button" data-action="profile-tab" data-tab="logout" role="tab" aria-selected="${logoutTabActive ? "true" : "false"}">Выйти</button>
      </div>
      <div class="profile-tab-content ${infoTabActive ? "" : "hidden"}" data-panel="info">
        <p><strong>${app.escapeHtml(student.name)}</strong> (${app.escapeHtml(student.login)})</p>
        ${
          accessActive
            ? `<p>Доступ активен до: ${app.escapeHtml(student.accessUntil)}</p>`
            : `<p class="access-denied">Подписка истекла: ${app.escapeHtml(student.accessUntil)}. Доступ к материалам закрыт.</p>`
        }
        <a class="btn btn-primary profile-renew-link" href="${app.escapeHtml(renewLink)}" target="_blank" rel="noopener noreferrer">Продлить подписку</a>
      </div>
      <div class="profile-tab-content ${passwordTabActive ? "" : "hidden"}" data-panel="password">
        <form id="profile-password-form" class="subscribe-form">
          <label>
            Текущий пароль
            <input type="password" name="currentPassword" minlength="4" required>
          </label>
          <label>
            Новый пароль
            <input type="password" name="newPassword" minlength="4" required>
          </label>
          <button class="btn btn-primary" type="submit">Сменить пароль</button>
          <p class="${passwordMessageClass}" id="profile-password-message">${app.escapeHtml(app.state.profilePasswordMessage || "")}</p>
        </form>
      </div>
      <div class="profile-tab-content ${logoutTabActive ? "" : "hidden"}" data-panel="logout">
        <p>Завершить сессию на этом устройстве.</p>
        <button class="btn btn-ghost" type="button" data-action="profile-logout">Выйти из профиля</button>
      </div>
    `;
  };

  app.renderComments = async function renderComments() {
    const container = document.getElementById("comment-list");
    if (!app.state.activeTopicId || !app.isAccessActive()) {
      container.innerHTML = '<p class="comment-empty">Комментарии недоступны.</p>';
      return;
    }

    app.state.comments = await api.listTopicComments(app.state.activeTopicId);
    if (!app.state.comments.length) {
      container.innerHTML = '<p class="comment-empty">Пока нет комментариев.</p>';
      return;
    }

    container.innerHTML = app.state.comments
      .map((comment) => {
        const canManage = comment.studentId === app.state.auth.student.id;
        return `
          <article class="comment-item">
            <p class="comment-author">${app.escapeHtml(comment.authorName)}</p>
            <p class="comment-text">${app.escapeHtml(comment.text)}</p>
            ${
              canManage
                ? `<div class="comment-actions">
                    <button data-action="edit" data-id="${app.escapeHtml(comment.id)}">Изм.</button>
                    <button data-action="delete" data-id="${app.escapeHtml(comment.id)}">Удал.</button>
                  </div>`
                : ""
            }
          </article>
        `;
      })
      .join("");
  };

  app.renderTopic = async function renderTopic() {
    app.renderAccessState();
    if (!app.state.activeTopicId) return;

    const content = document.getElementById("topic-content");
    const title = document.getElementById("topic-title");
    const moduleName = document.getElementById("topic-module");

    if (!app.isAccessActive()) {
      title.textContent = "Доступ закрыт";
      moduleName.textContent = "";
      content.innerHTML = '<p class="access-denied">Продли подписку через CRM, чтобы читать темы курса.</p>';
      document.getElementById("comment-topic-name").textContent = "";
      document.getElementById("comment-list").innerHTML = "";
      app.state.selfCheckMode = false;
      app.state.selfCheckQuestions = [];
      app.state.selfCheckResultMessage = "";
      app.state.selfCheckRevealUntil = 0;
      if (app.state.selfCheckRevealTimerId) {
        clearInterval(app.state.selfCheckRevealTimerId);
        app.state.selfCheckRevealTimerId = 0;
      }
      app.renderSelfCheckPanel();
      app.applyLayoutState();
      return;
    }

    try {
      app.state.activeTopic = await api.getTopic(app.state.activeTopicId);
      title.textContent = app.state.activeTopic.title;
      moduleName.textContent = app.state.activeTopic.module.title;
      document.getElementById("comment-topic-name").textContent = app.state.activeTopic.title;
      content.innerHTML = (app.state.activeTopic.contentBlocks || []).map(app.renderContentBlock).join("");
      if (app.state.selfCheckRevealTimerId) {
        clearInterval(app.state.selfCheckRevealTimerId);
        app.state.selfCheckRevealTimerId = 0;
      }
      app.state.selfCheckQuestions = app.buildSelfCheckQuestions(app.state.activeTopic.trainer);
      app.state.selfCheckMode = false;
      app.state.selfCheckRevealUntil = 0;
      app.state.selfCheckResultMessage = "";
      app.state.selfCheckResultType = "error";
      app.renderSelfCheckPanel();
      app.applyLayoutState();
      await app.renderComments();
    } catch (error) {
      content.innerHTML = `<p class="access-denied">${app.escapeHtml(error.message)}</p>`;
      app.state.selfCheckMode = false;
      app.state.selfCheckQuestions = [];
      app.state.selfCheckResultMessage = "";
      app.state.selfCheckRevealUntil = 0;
      if (app.state.selfCheckRevealTimerId) {
        clearInterval(app.state.selfCheckRevealTimerId);
        app.state.selfCheckRevealTimerId = 0;
      }
      app.renderSelfCheckPanel();
      app.applyLayoutState();
    }
  };

  app.loadModules = async function loadModules() {
    if (!app.isAccessActive()) {
      app.state.modules = [];
      app.state.activeTopicId = "";
      app.renderModuleNav();
      await app.renderTopic();
      return;
    }

    app.state.modules = await api.listModules();
    if (!app.state.activeTopicId) {
      app.state.activeTopicId = app.state.modules[0]?.topics?.[0]?.id || "";
    }
    app.renderModuleNav();
    await app.renderTopic();
  };
})(window);
