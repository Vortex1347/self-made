(function initCrmRender(global) {
  const app = global.crmApp;

  app.renderStudents = function renderStudents() {
    const container = document.getElementById("students-list");
    const selected = getCurrentStudentLogin();

    if (app.state.students.length === 0) {
      container.innerHTML = "<p>Пока нет учеников.</p>";
      return;
    }

    container.innerHTML = app.state.students
      .map((student) => {
        const status = app.isStudentActive(student) ? "active" : "expired";
        const statusText = status === "active" ? "Доступ активен" : "Доступ истек";
        return `
          <article class="student-row">
            <div>
              <strong>${app.escapeHtml(student.name)}</strong>
              <p>${app.escapeHtml(student.login)}</p>
              <p>До: ${app.escapeHtml(student.accessUntil)}</p>
              <p class="student-status ${status}">${statusText}</p>
            </div>
            <div class="student-actions">
              <button class="btn btn-ghost" data-action="select" data-login="${app.encodeData(student.login)}">
                ${selected === student.login ? "Выбран" : "Выбрать"}
              </button>
              <button class="btn btn-ghost" data-action="edit" data-login="${app.encodeData(student.login)}">
                Редактировать
              </button>
              <button class="btn btn-ghost" data-action="delete" data-id="${app.escapeHtml(student.id)}">
                Удалить
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  };

  app.renderCommentsAdmin = function renderCommentsAdmin() {
    const container = document.getElementById("comments-admin-list");

    if (app.state.comments.length === 0) {
      container.innerHTML = "<p>Комментариев пока нет.</p>";
      return;
    }

    container.innerHTML = app.state.comments
      .map(
        (comment) => `
          <article class="comment-admin-row">
            <p><strong>${app.escapeHtml(comment.authorName)}</strong> (${app.escapeHtml(comment.authorLogin)})</p>
            <p>Тема: ${app.escapeHtml(comment.topicTitle || comment.topicId)}</p>
            <p class="comment-text">${app.escapeHtml(comment.text)}</p>
            <div class="student-actions">
              <button class="btn btn-ghost" data-action="edit-comment" data-id="${app.escapeHtml(comment.id)}">Редактировать</button>
              <button class="btn btn-ghost" data-action="delete-comment" data-id="${app.escapeHtml(comment.id)}">Удалить</button>
            </div>
          </article>
        `,
      )
      .join("");
  };

  app.renderModules = function renderModules() {
    const container = document.getElementById("modules-list");
    if (!app.state.modules.length) {
      container.innerHTML = "<p>Модули пока не созданы.</p>";
      return;
    }

    container.innerHTML = app.state.modules
      .map((moduleItem) => {
        const pub = moduleItem.isPublished ? "Опубликовано" : "Скрыто";
        return `
          <article class="student-row draggable-row" draggable="true" data-drag-type="module" data-id="${app.escapeHtml(moduleItem.id)}">
            <div>
              <strong>${app.escapeHtml(moduleItem.title)}</strong>
              <p>Порядок: ${app.escapeHtml(moduleItem.orderIndex)}</p>
              <p class="student-status ${moduleItem.isPublished ? "active" : "expired"}">${pub}</p>
            </div>
            <div class="student-actions">
              <button class="btn btn-ghost" data-action="edit-module" data-id="${app.escapeHtml(moduleItem.id)}">Редактировать</button>
              <button class="btn btn-ghost" data-action="delete-module" data-id="${app.escapeHtml(moduleItem.id)}">Удалить</button>
            </div>
          </article>
        `;
      })
      .join("");
  };

  app.renderTopicModulesSelect = function renderTopicModulesSelect() {
    const select = document.getElementById("topic-module-select");
    if (!select) return;

    if (!app.state.modules.length) {
      select.innerHTML = '<option value="">Сначала создайте модуль</option>';
      select.disabled = true;
      return;
    }

    select.disabled = false;
    const currentValue = select.value;
    select.innerHTML = app.state.modules
      .map((moduleItem) => `<option value="${app.escapeHtml(moduleItem.id)}">${app.escapeHtml(moduleItem.title)}</option>`)
      .join("");

    if (currentValue && app.state.modules.some((moduleItem) => moduleItem.id === currentValue)) {
      select.value = currentValue;
    }
  };

  app.renderTopics = function renderTopics() {
    const container = document.getElementById("topics-list");
    if (!app.state.topics.length) {
      container.innerHTML = "<p>Темы пока не созданы.</p>";
      return;
    }

    container.innerHTML = app.state.topics
      .map((topic) => {
        const pub = topic.isPublished ? "Опубликовано" : "Скрыто";
        return `
          <article class="student-row draggable-row" draggable="true" data-drag-type="topic" data-id="${app.escapeHtml(topic.id)}" data-module-id="${app.escapeHtml(topic.moduleId)}">
            <div>
              <strong>${app.escapeHtml(topic.title)}</strong>
              <p>Модуль: ${app.escapeHtml(topic.moduleTitle)}</p>
              <p>Порядок: ${app.escapeHtml(topic.orderIndex)}</p>
              <p class="student-status ${topic.isPublished ? "active" : "expired"}">${pub}</p>
            </div>
            <div class="student-actions">
              <button class="btn btn-ghost" data-action="edit-topic" data-id="${app.escapeHtml(topic.id)}">Редактировать</button>
              <button class="btn btn-ghost" data-action="delete-topic" data-id="${app.escapeHtml(topic.id)}">Удалить</button>
            </div>
          </article>
        `;
      })
      .join("");
  };

  app.refreshData = async function refreshData() {
    const [students, comments, modules, topics] = await Promise.all([
      api.adminListStudents(),
      api.adminListComments(),
      api.adminListCourseModules(),
      api.adminListCourseTopics(),
    ]);

    app.state.students = students;
    app.state.comments = comments;
    app.state.modules = modules;
    app.state.topics = topics;

    app.renderStudents();
    app.renderCommentsAdmin();
    app.renderModules();
    app.renderTopicModulesSelect();
    app.renderTopics();
  };
})(window);
