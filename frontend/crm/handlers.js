(function initCrmHandlers(global) {
  const app = global.crmApp;

  app.activateCrmTab = function activateCrmTab(tab) {
    document.querySelectorAll("[data-crm-tab]").forEach((button) => {
      const isActive = button.dataset.crmTab === tab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    document.querySelectorAll("[data-crm-tab-panel]").forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.crmTabPanel !== tab);
    });
  };

  app.setupCrmTabs = function setupCrmTabs() {
    const tabs = document.getElementById("crm-tabs");
    if (!tabs) return;

    tabs.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const button = target.closest("[data-crm-tab]");
      if (!(button instanceof HTMLElement)) return;
      app.activateCrmTab(button.dataset.crmTab || "students");
    });

    app.activateCrmTab("students");
  };

  app.clearTopicPreview = function clearTopicPreview() {
    const container = document.getElementById("topic-preview");
    container.innerHTML = '<p class="topic-preview-empty">Нажмите "Превью", чтобы увидеть статью перед публикацией.</p>';
  };

  app.setupAdminLogin = function setupAdminLogin() {
    const form = document.getElementById("admin-login-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      try {
        await api.adminLogin(payload.login, payload.password);
        await app.openPanel();
        app.showMessage("admin-login-message", "", "success");
        form.reset();
      } catch (error) {
        app.showMessage("admin-login-message", error.message);
      }
    });
  };

  app.resetStudentFormMode = function resetStudentFormMode(form) {
    form.reset();
    const modeEl = document.getElementById("student-form-mode");
    const loginInput = form.elements.login;
    modeEl.textContent = "Режим: создание/обновление по логину.";
    loginInput.readOnly = false;
    document.getElementById("cancel-edit-btn").classList.add("hidden");
  };

  app.openEditStudentMode = function openEditStudentMode(login) {
    const student = app.state.students.find((item) => item.login === login);
    if (!student) return;

    const form = document.getElementById("student-form");
    form.elements.name.value = student.name;
    form.elements.login.value = student.login;
    form.elements.password.value = "";
    form.elements.accessUntil.value = student.accessUntil;
    form.elements.login.readOnly = true;

    const modeEl = document.getElementById("student-form-mode");
    modeEl.textContent = `Режим: редактирование ${student.login}`;
    document.getElementById("cancel-edit-btn").classList.remove("hidden");
    app.showMessage("student-form-message", "Пароль можно оставить пустым — он не изменится.", "success");
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  app.setupStudentForm = function setupStudentForm() {
    const form = document.getElementById("student-form");
    const cancelBtn = document.getElementById("cancel-edit-btn");

    cancelBtn.addEventListener("click", () => {
      app.resetStudentFormMode(form);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      try {
        await api.adminCreateOrUpdateStudent(payload);
        await app.refreshData();
        app.showMessage("student-form-message", "Ученик сохранен.", "success");
        app.resetStudentFormMode(form);
      } catch (error) {
        app.showMessage("student-form-message", error.message);
      }
    });
  };

  app.setupStudentActions = function setupStudentActions() {
    const container = document.getElementById("students-list");
    container.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      if (!action) return;

      if (action === "select") {
        const encoded = target.dataset.login;
        if (!encoded) return;
        const login = app.decodeData(encoded);
        setCurrentStudentLogin(login);
        app.renderStudents();
        return;
      }

      if (action === "edit") {
        const encoded = target.dataset.login;
        if (!encoded) return;
        const login = app.decodeData(encoded);
        app.openEditStudentMode(login);
        return;
      }

      if (action === "delete") {
        const id = target.dataset.id;
        if (!id) return;
        try {
          await api.adminDeleteStudent(id);
          await app.refreshData();
        } catch (error) {
          app.showMessage("crm-global-message", error.message);
        }
      }
    });
  };

  app.setupCommentActions = function setupCommentActions() {
    const container = document.getElementById("comments-admin-list");
    container.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (!action || !id) return;

      try {
        if (action === "delete-comment") {
          await api.adminDeleteComment(id);
          await app.refreshData();
          return;
        }

        if (action === "edit-comment") {
          const comment = app.state.comments.find((item) => item.id === id);
          const next = prompt("Новый текст комментария", comment?.text || "");
          if (!next || !next.trim()) return;
          await api.adminUpdateComment(id, next.trim());
          await app.refreshData();
        }
      } catch (error) {
        app.showMessage("crm-global-message", error.message);
      }
    });
  };

  app.resetModuleFormMode = function resetModuleFormMode() {
    app.state.editingModuleId = "";
    const form = document.getElementById("module-form");
    form.reset();
    form.elements.orderIndex.value = "0";
    form.elements.isPublished.value = "true";
    document.getElementById("module-form-mode").textContent = "Создать модуль";
    document.getElementById("cancel-module-edit-btn").classList.add("hidden");
    app.showMessage("module-form-message", "");
  };

  app.openModuleEditMode = function openModuleEditMode(moduleId) {
    const moduleItem = app.state.modules.find((item) => item.id === moduleId);
    if (!moduleItem) return;

    app.state.editingModuleId = moduleItem.id;
    const form = document.getElementById("module-form");
    form.elements.title.value = moduleItem.title;
    form.elements.orderIndex.value = String(moduleItem.orderIndex);
    form.elements.isPublished.value = moduleItem.isPublished ? "true" : "false";
    document.getElementById("module-form-mode").textContent = `Редактирование модуля: ${moduleItem.title}`;
    document.getElementById("cancel-module-edit-btn").classList.remove("hidden");
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  app.setupModuleForm = function setupModuleForm() {
    const form = document.getElementById("module-form");
    const cancelBtn = document.getElementById("cancel-module-edit-btn");

    cancelBtn.addEventListener("click", () => app.resetModuleFormMode());

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payloadRaw = Object.fromEntries(new FormData(form).entries());

      try {
        const payload = {
          title: String(payloadRaw.title || "").trim(),
          orderIndex: Number(payloadRaw.orderIndex || 0),
          isPublished: payloadRaw.isPublished === "true",
        };

        if (!payload.title) {
          throw new Error("Введите название модуля.");
        }

        if (app.state.editingModuleId) {
          await api.adminUpdateCourseModule(app.state.editingModuleId, payload);
        } else {
          await api.adminCreateCourseModule(payload);
        }

        await app.refreshData();
        app.resetModuleFormMode();
        app.showMessage("module-form-message", "Модуль сохранен.", "success");
      } catch (error) {
        app.showMessage("module-form-message", error.message);
      }
    });
  };

  app.setupModuleActions = function setupModuleActions() {
    const container = document.getElementById("modules-list");
    container.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (!action || !id) return;

      try {
        if (action === "edit-module") {
          app.openModuleEditMode(id);
          return;
        }

        if (action === "delete-module") {
          if (!confirm("Удалить модуль? Все связанные темы и комментарии будут удалены.")) return;
          await api.adminDeleteCourseModule(id);
          await app.refreshData();
          app.resetModuleFormMode();
          app.resetTopicFormMode();
        }
      } catch (error) {
        app.showMessage("crm-global-message", error.message);
      }
    });
  };

  app.setupModuleDnD = function setupModuleDnD() {
    const container = document.getElementById("modules-list");

    container.addEventListener("dragstart", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const row = target.closest("[data-drag-type='module']");
      if (!(row instanceof HTMLElement)) return;
      app.state.draggingModuleId = row.dataset.id || "";
      row.classList.add("dragging");
    });

    container.addEventListener("dragend", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const row = target.closest("[data-drag-type='module']");
      if (row instanceof HTMLElement) row.classList.remove("dragging");
      app.clearDragOver(container, "module");
      app.state.draggingModuleId = "";
    });

    container.addEventListener("dragover", (event) => {
      if (!app.state.draggingModuleId) return;
      event.preventDefault();
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const overRow = target.closest("[data-drag-type='module']");
      if (!(overRow instanceof HTMLElement)) return;
      app.clearDragOver(container, "module");
      overRow.classList.add("drag-over");
    });

    container.addEventListener("drop", async (event) => {
      if (!app.state.draggingModuleId) return;
      event.preventDefault();
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const overRow = target.closest("[data-drag-type='module']");
      if (!(overRow instanceof HTMLElement)) return;

      app.clearDragOver(container, "module");
      const targetId = overRow.dataset.id || "";
      if (!targetId || targetId === app.state.draggingModuleId) return;

      const nextOrder = [...app.state.modules];
      const fromIndex = nextOrder.findIndex((item) => item.id === app.state.draggingModuleId);
      const toIndex = nextOrder.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return;

      const [moved] = nextOrder.splice(fromIndex, 1);
      nextOrder.splice(toIndex, 0, moved);

      const updates = nextOrder
        .map((moduleItem, index) => ({ moduleItem, orderIndex: index }))
        .filter(({ moduleItem, orderIndex }) => moduleItem.orderIndex !== orderIndex);

      if (!updates.length) return;

      try {
        await Promise.all(
          updates.map(({ moduleItem, orderIndex }) =>
            api.adminUpdateCourseModule(moduleItem.id, {
              title: moduleItem.title,
              isPublished: moduleItem.isPublished,
              orderIndex,
            }),
          ),
        );
        await app.refreshData();
        app.showMessage("module-form-message", "Порядок модулей обновлен.", "success");
      } catch (error) {
        app.showMessage("module-form-message", error.message);
      }
    });
  };

  app.defaultContentBlocks = function defaultContentBlocks() {
    return JSON.stringify([{ type: "text", value: "Новый контент темы" }], null, 2);
  };

  app.resetTopicFormMode = function resetTopicFormMode() {
    app.state.editingTopicId = "";
    const form = document.getElementById("topic-form");
    form.reset();
    form.elements.orderIndex.value = "0";
    form.elements.isPublished.value = "true";
    form.elements.contentBlocks.value = app.defaultContentBlocks();
    form.elements.trainer.value = "";
    app.clearTopicJsonValidation();
    document.getElementById("topic-form-mode").textContent = "Создать тему";
    document.getElementById("cancel-topic-edit-btn").classList.add("hidden");
    app.showMessage("topic-form-message", "");
    app.clearTopicPreview();
  };

  app.openTopicEditMode = function openTopicEditMode(topicId) {
    const topic = app.state.topics.find((item) => item.id === topicId);
    if (!topic) return;

    app.state.editingTopicId = topic.id;
    const form = document.getElementById("topic-form");
    form.elements.moduleId.value = topic.moduleId;
    form.elements.title.value = topic.title;
    form.elements.orderIndex.value = String(topic.orderIndex);
    form.elements.isPublished.value = topic.isPublished ? "true" : "false";
    form.elements.contentBlocks.value = JSON.stringify(topic.contentBlocks || [], null, 2);
    form.elements.trainer.value = topic.trainer ? JSON.stringify(topic.trainer, null, 2) : "";
    app.clearTopicJsonValidation();
    document.getElementById("topic-form-mode").textContent = `Редактирование темы: ${topic.title}`;
    document.getElementById("cancel-topic-edit-btn").classList.remove("hidden");
    app.clearTopicPreview();
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  app.parseTopicPayload = function parseTopicPayload(form) {
    const payloadRaw = Object.fromEntries(new FormData(form).entries());
    app.clearTopicJsonValidation();

    const payload = {
      moduleId: String(payloadRaw.moduleId || "").trim(),
      title: String(payloadRaw.title || "").trim(),
      orderIndex: Number(payloadRaw.orderIndex || 0),
      isPublished: payloadRaw.isPublished === "true",
      contentBlocks: [],
      trainer: null,
    };

    if (!payload.moduleId) throw new Error("Выберите модуль для темы.");
    if (!payload.title) throw new Error("Введите заголовок темы.");

    try {
      payload.contentBlocks = JSON.parse(String(payloadRaw.contentBlocks || "[]"));
    } catch (_error) {
      app.setFieldValidation("topic-content-blocks", true);
      throw new Error("Поле Content blocks: некорректный JSON.");
    }

    if (!Array.isArray(payload.contentBlocks)) {
      app.setFieldValidation("topic-content-blocks", true);
      throw new Error("Поле Content blocks должно быть JSON-массивом.");
    }

    const trainerRaw = String(payloadRaw.trainer || "").trim();
    if (trainerRaw) {
      let trainerParsed;
      try {
        trainerParsed = JSON.parse(trainerRaw);
      } catch (_error) {
        app.setFieldValidation("topic-trainer", true);
        throw new Error("Поле Тест самопроверки: некорректный JSON.");
      }

      if (!trainerParsed || Array.isArray(trainerParsed) || typeof trainerParsed !== "object") {
        app.setFieldValidation("topic-trainer", true);
        throw new Error("Тест самопроверки должен быть JSON-объектом.");
      }

      const questions = Array.isArray(trainerParsed.questions) ? trainerParsed.questions : [];
      if (!questions.length) {
        app.setFieldValidation("topic-trainer", true);
        throw new Error("Добавьте минимум 1 вопрос в поле questions.");
      }

      const invalidQuestionIndex = questions.findIndex((question) => {
        const questionText = String(question?.question || "").trim();
        const options = Array.isArray(question?.options)
          ? question.options.map((option) => String(option || "").trim()).filter(Boolean)
          : [];
        const correctIndex = Number(question?.correctIndex);
        return !questionText || options.length < 2 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length;
      });

      if (invalidQuestionIndex >= 0) {
        app.setFieldValidation("topic-trainer", true);
        throw new Error(
          `Проверь вопрос #${invalidQuestionIndex + 1}: нужны question, минимум 2 options и корректный correctIndex.`,
        );
      }

      payload.trainer = trainerParsed;
    }

    return payload;
  };

  app.renderTopicPreview = function renderTopicPreview(payload) {
    const container = document.getElementById("topic-preview");
    const moduleTitle = app.state.modules.find((moduleItem) => moduleItem.id === payload.moduleId)?.title || "Без модуля";

    const blockItems = payload.contentBlocks
      .map((block, index) => {
        const type = String(block?.type || "text");
        if (type === "list" && Array.isArray(block?.items)) {
          const list = block.items.map((item) => `<li>${app.escapeHtml(item)}</li>`).join("");
          return `<div class="preview-block"><p class="preview-block-label">Block ${index + 1} [list]</p><ul>${list}</ul></div>`;
        }
        if (type === "image") {
          return `<div class="preview-block"><p class="preview-block-label">Block ${index + 1} [image]</p><div class="topic-image-placeholder">${app.escapeHtml(block?.alt || "Изображение")}</div></div>`;
        }
        return `<div class="preview-block"><p class="preview-block-label">Block ${index + 1} [${app.escapeHtml(type)}]</p><p>${app.escapeHtml(block?.value || block?.text || "")}</p></div>`;
      })
      .join("");

    const testsCount = Array.isArray(payload.trainer?.questions) ? payload.trainer.questions.length : 0;
    const testsPreview = payload.trainer
      ? `<div class="preview-trainer"><strong>Тест самопроверки:</strong> ${testsCount} вопрос(ов)</div>`
      : '<div class="preview-trainer preview-trainer-empty">Тест самопроверки не задан</div>';

    container.innerHTML = `
      <article class="topic-preview-card">
        <p class="preview-meta">Модуль: ${app.escapeHtml(moduleTitle)} • Порядок: ${app.escapeHtml(payload.orderIndex)} • ${payload.isPublished ? "Публикация: да" : "Публикация: нет"}</p>
        <h4>${app.escapeHtml(payload.title)}</h4>
        <div class="preview-content">${blockItems || "<p>Нет контента.</p>"}</div>
        ${testsPreview}
      </article>
    `;
  };

  app.setupTopicPreview = function setupTopicPreview() {
    const button = document.getElementById("preview-topic-btn");
    const form = document.getElementById("topic-form");

    button.addEventListener("click", () => {
      try {
        const payload = app.parseTopicPayload(form);
        app.renderTopicPreview(payload);
        app.showMessage("topic-form-message", "Превью обновлено.", "success");
      } catch (error) {
        app.showMessage("topic-form-message", error.message);
      }
    });
  };

  app.setupTopicFieldValidationReset = function setupTopicFieldValidationReset() {
    const contentBlocks = document.getElementById("topic-content-blocks");
    const trainer = document.getElementById("topic-trainer");

    contentBlocks.addEventListener("input", () => app.setFieldValidation("topic-content-blocks", false));
    trainer.addEventListener("input", () => app.setFieldValidation("topic-trainer", false));
  };

  app.setupTopicForm = function setupTopicForm() {
    const form = document.getElementById("topic-form");
    const cancelBtn = document.getElementById("cancel-topic-edit-btn");

    cancelBtn.addEventListener("click", () => app.resetTopicFormMode());

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        const payload = app.parseTopicPayload(form);

        if (app.state.editingTopicId) {
          await api.adminUpdateCourseTopic(app.state.editingTopicId, payload);
        } else {
          await api.adminCreateCourseTopic(payload);
        }

        await app.refreshData();
        app.resetTopicFormMode();
        app.showMessage("topic-form-message", "Тема сохранена.", "success");
      } catch (error) {
        app.showMessage("topic-form-message", error.message);
      }
    });
  };

  app.setupTopicActions = function setupTopicActions() {
    const container = document.getElementById("topics-list");
    container.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (!action || !id) return;

      try {
        if (action === "edit-topic") {
          app.openTopicEditMode(id);
          return;
        }

        if (action === "delete-topic") {
          if (!confirm("Удалить тему? Это удалит и связанные комментарии.")) return;
          await api.adminDeleteCourseTopic(id);
          await app.refreshData();
          app.resetTopicFormMode();
        }
      } catch (error) {
        app.showMessage("crm-global-message", error.message);
      }
    });
  };

  app.setupTopicDnD = function setupTopicDnD() {
    const container = document.getElementById("topics-list");

    container.addEventListener("dragstart", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const row = target.closest("[data-drag-type='topic']");
      if (!(row instanceof HTMLElement)) return;
      app.state.draggingTopicId = row.dataset.id || "";
      row.classList.add("dragging");
    });

    container.addEventListener("dragend", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const row = target.closest("[data-drag-type='topic']");
      if (row instanceof HTMLElement) row.classList.remove("dragging");
      app.clearDragOver(container, "topic");
      app.state.draggingTopicId = "";
    });

    container.addEventListener("dragover", (event) => {
      if (!app.state.draggingTopicId) return;
      event.preventDefault();
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const overRow = target.closest("[data-drag-type='topic']");
      if (!(overRow instanceof HTMLElement)) return;
      app.clearDragOver(container, "topic");
      overRow.classList.add("drag-over");
    });

    container.addEventListener("drop", async (event) => {
      if (!app.state.draggingTopicId) return;
      event.preventDefault();
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const overRow = target.closest("[data-drag-type='topic']");
      if (!(overRow instanceof HTMLElement)) return;

      app.clearDragOver(container, "topic");
      const targetId = overRow.dataset.id || "";
      if (!targetId || targetId === app.state.draggingTopicId) return;

      const sourceTopic = app.state.topics.find((item) => item.id === app.state.draggingTopicId);
      const targetTopic = app.state.topics.find((item) => item.id === targetId);
      if (!sourceTopic || !targetTopic) return;

      if (sourceTopic.moduleId !== targetTopic.moduleId) {
        app.showMessage("topic-form-message", "Перетаскивание тем доступно только внутри одного модуля.");
        return;
      }

      const sameModuleTopics = app.state.topics
        .filter((item) => item.moduleId === sourceTopic.moduleId)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      const fromIndex = sameModuleTopics.findIndex((item) => item.id === app.state.draggingTopicId);
      const toIndex = sameModuleTopics.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return;

      const reordered = [...sameModuleTopics];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);

      const updates = reordered
        .map((topic, index) => ({ topic, orderIndex: index }))
        .filter(({ topic, orderIndex }) => topic.orderIndex !== orderIndex);

      if (!updates.length) return;

      try {
        await Promise.all(
          updates.map(({ topic, orderIndex }) =>
            api.adminUpdateCourseTopic(topic.id, {
              moduleId: topic.moduleId,
              title: topic.title,
              orderIndex,
              isPublished: topic.isPublished,
              contentBlocks: topic.contentBlocks || [],
              trainer: topic.trainer || null,
            }),
          ),
        );
        await app.refreshData();
        app.showMessage("topic-form-message", "Порядок тем обновлен.", "success");
      } catch (error) {
        app.showMessage("topic-form-message", error.message);
      }
    });
  };
})(window);
