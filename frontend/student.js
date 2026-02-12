let authState = null;
let modulesState = [];
let activeTopicId = "";
let activeTopic = null;

function isAccessActive() {
  return !!authState?.accessActive;
}

function showMessage(id, text) {
  document.getElementById(id).textContent = text;
}

function renderModuleNav() {
  const container = document.getElementById("module-nav");
  if (modulesState.length === 0) {
    container.innerHTML = "<p>Нет доступных модулей.</p>";
    return;
  }

  container.innerHTML = modulesState
    .map((moduleItem) => {
      const topicsHtml = moduleItem.topics
        .map(
          (topic) => `
          <button class="topic-nav-btn ${topic.id === activeTopicId ? "active" : ""}" data-topic-id="${topic.id}">
            ${topic.title}
          </button>
        `,
        )
        .join("");
      return `
        <section class="topic-group">
          <h3>${moduleItem.title}</h3>
          ${topicsHtml}
        </section>
      `;
    })
    .join("");
}

function renderContentBlock(block) {
  if (block.type === "text") {
    return `<p class="topic-paragraph">${block.value}</p>`;
  }
  if (block.type === "list" && Array.isArray(block.value)) {
    return `<ul class="topic-list">${block.value.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }
  if (block.type === "image") {
    return `<div class="topic-image-placeholder">${block.value}</div>`;
  }
  return "";
}

function renderTrainer(topic) {
  const pane = document.getElementById("trainer-pane");
  if (!topic?.trainer) {
    pane.classList.add("hidden");
    pane.innerHTML = "";
    return;
  }

  pane.classList.remove("hidden");
  pane.innerHTML = `
    <h3>${topic.trainer.title}</h3>
    <p>${topic.trainer.description}</p>
    <div class="trainer-window">
      <p>Тип: ${topic.trainer.type}</p>
      <p>Сюда подключается backend-логика тренажера.</p>
    </div>
  `;
}

function renderAccessState() {
  const stateEl = document.getElementById("access-state");
  if (!authState) return;
  const { student, accessActive } = authState;

  if (accessActive) {
    stateEl.innerHTML = `
      <p><strong>${student.name}</strong> (${student.login})</p>
      <p>Доступ активен до: ${student.accessUntil}</p>
    `;
    return;
  }

  stateEl.innerHTML = `
    <p><strong>${student.name}</strong> (${student.login})</p>
    <p class="access-denied">Подписка истекла: ${student.accessUntil}. Доступ к материалам закрыт.</p>
  `;
}

async function renderTopic() {
  renderAccessState();
  if (!activeTopicId) return;

  const content = document.getElementById("topic-content");
  const title = document.getElementById("topic-title");
  const moduleName = document.getElementById("topic-module");

  if (!isAccessActive()) {
    title.textContent = "Доступ закрыт";
    moduleName.textContent = "";
    content.innerHTML =
      '<p class="access-denied">Продли подписку через CRM, чтобы читать темы и использовать тренажеры.</p>';
    document.getElementById("comment-topic-name").textContent = "";
    document.getElementById("trainer-pane").classList.add("hidden");
    document.getElementById("comment-list").innerHTML = "";
    return;
  }

  try {
    activeTopic = await api.getTopic(activeTopicId);
    title.textContent = activeTopic.title;
    moduleName.textContent = activeTopic.module.title;
    document.getElementById("comment-topic-name").textContent = activeTopic.title;
    content.innerHTML = (activeTopic.contentBlocks || []).map(renderContentBlock).join("");
    renderTrainer(activeTopic);
    await renderComments();
  } catch (error) {
    content.innerHTML = `<p class="access-denied">${error.message}</p>`;
    document.getElementById("trainer-pane").classList.add("hidden");
  }
}

async function renderComments() {
  const container = document.getElementById("comment-list");
  if (!activeTopicId || !isAccessActive()) {
    container.innerHTML = `<p class="comment-empty">Комментарии недоступны.</p>`;
    return;
  }

  const topicComments = await api.listTopicComments(activeTopicId);
  if (!topicComments.length) {
    container.innerHTML = `<p class="comment-empty">Пока нет комментариев.</p>`;
    return;
  }

  container.innerHTML = topicComments
    .map((comment) => {
      const canManage = comment.studentId === authState.student.id;
      return `
        <article class="comment-item">
          <p class="comment-author">${comment.authorName}</p>
          <p class="comment-text">${comment.text}</p>
          ${
            canManage
              ? `<div class="comment-actions">
                  <button data-action="edit" data-id="${comment.id}">Изм.</button>
                  <button data-action="delete" data-id="${comment.id}">Удал.</button>
                </div>`
              : ""
          }
        </article>
      `;
    })
    .join("");
}

function showStudentApp() {
  document.getElementById("auth-card").classList.add("hidden");
  document.getElementById("student-app").classList.remove("hidden");
  document.getElementById("comment-widget").classList.remove("hidden");
}

async function loadModules() {
  if (!isAccessActive()) {
    modulesState = [];
    activeTopicId = "";
    renderModuleNav();
    await renderTopic();
    return;
  }
  modulesState = await api.listModules();
  if (!activeTopicId) {
    activeTopicId = modulesState[0]?.topics?.[0]?.id || "";
  }
  renderModuleNav();
  await renderTopic();
}

function setupLogin() {
  const form = document.getElementById("login-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      authState = await api.studentLogin(payload.login, payload.password);
      showMessage("login-message", "");
      showStudentApp();
      await loadModules();
    } catch (error) {
      showMessage("login-message", error.message);
    }
  });
}

function setupTopicClicks() {
  document.getElementById("module-nav").addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const topicId = target.dataset.topicId;
    if (!topicId) return;
    activeTopicId = topicId;
    renderModuleNav();
    await renderTopic();
  });
}

function setupCommentForm() {
  const form = document.getElementById("comment-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isAccessActive() || !activeTopicId) return;

    const payload = Object.fromEntries(new FormData(form).entries());
    const text = String(payload.comment || "").trim();
    if (!text) return;

    try {
      await api.createTopicComment(activeTopicId, text);
      form.reset();
      await renderComments();
    } catch (error) {
      alert(error.message);
    }
  });
}

function setupCommentActions() {
  document.getElementById("comment-list").addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id || !activeTopicId) return;

    try {
      if (action === "delete") {
        await api.deleteTopicComment(activeTopicId, id);
        await renderComments();
        return;
      }

      if (action === "edit") {
        const next = prompt("Изменить комментарий");
        if (!next || !next.trim()) return;
        await api.updateTopicComment(activeTopicId, id, next.trim());
        await renderComments();
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

async function bootstrap() {
  setupLogin();
  setupTopicClicks();
  setupCommentForm();
  setupCommentActions();

  if (!getStudentToken()) return;
  try {
    authState = await api.studentMe();
    showStudentApp();
    await loadModules();
  } catch (error) {
    setStudentToken("");
  }
}

bootstrap();
