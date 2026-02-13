(function initStudentHandlers(global) {
  const app = global.studentApp;

  app.setupLogin = function setupLogin() {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      try {
        app.state.auth = await api.studentLogin(payload.login, payload.password);
        app.showMessage("login-message", "");
        app.showStudentApp();
        await app.loadModules();
      } catch (error) {
        app.showMessage("login-message", error.message);
      }
    });
  };

  app.setupTopicClicks = function setupTopicClicks() {
    document.getElementById("module-nav").addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const topicId = target.dataset.topicId;
      if (!topicId) return;

      app.state.activeTopicId = topicId;
      app.renderModuleNav();
      await app.renderTopic();

      const isMobileDrawer = window.matchMedia("(max-width: 980px)").matches;
      if (isMobileDrawer && !app.state.sidebarCollapsed) {
        app.state.sidebarCollapsed = true;
        app.applyLayoutState();
      }
    });
  };

  app.setupCommentForm = function setupCommentForm() {
    const form = document.getElementById("comment-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!app.isAccessActive() || !app.state.activeTopicId) return;

      const payload = Object.fromEntries(new FormData(form).entries());
      const text = String(payload.comment || "").trim();
      if (!text) return;

      try {
        await api.createTopicComment(app.state.activeTopicId, text);
        form.reset();
        app.showMessage("comment-form-message", "");
        await app.renderComments();
      } catch (error) {
        app.showMessage("comment-form-message", error.message);
      }
    });
  };

  app.setupCommentActions = function setupCommentActions() {
    document.getElementById("comment-list").addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (!action || !id || !app.state.activeTopicId) return;

      try {
        if (action === "delete") {
          await api.deleteTopicComment(app.state.activeTopicId, id);
          app.showMessage("comment-form-message", "");
          await app.renderComments();
          return;
        }

        if (action === "edit") {
          const current = app.state.comments.find((item) => item.id === id)?.text || "";
          const next = prompt("Изменить комментарий", current);
          if (!next || !next.trim()) return;
          await api.updateTopicComment(app.state.activeTopicId, id, next.trim());
          app.showMessage("comment-form-message", "");
          await app.renderComments();
        }
      } catch (error) {
        app.showMessage("comment-form-message", error.message);
      }
    });
  };

  app.setupLayoutToggles = function setupLayoutToggles() {
    const sidebarToggle = document.getElementById("module-sidebar-toggle");
    const sidebarClose = document.getElementById("module-sidebar-close");
    const sidebarBackdrop = document.getElementById("student-sidebar-backdrop");
    const commentsToggle = document.getElementById("comments-toggle");
    const profileToggle = document.getElementById("profile-toggle");

    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        app.state.sidebarCollapsed = !app.state.sidebarCollapsed;
        app.applyLayoutState();
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener("click", () => {
        app.state.sidebarCollapsed = true;
        app.applyLayoutState();
      });
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener("click", () => {
        app.state.sidebarCollapsed = true;
        app.applyLayoutState();
      });
    }

    if (commentsToggle) {
      commentsToggle.addEventListener("click", () => {
        app.state.commentsCollapsed = !app.state.commentsCollapsed;
        app.applyLayoutState();
      });
    }

    if (profileToggle) {
      profileToggle.addEventListener("click", () => {
        app.state.profileExpanded = !app.state.profileExpanded;
        app.applyLayoutState();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!app.state.sidebarCollapsed) {
        app.state.sidebarCollapsed = true;
        app.applyLayoutState();
      }
      if (!app.state.commentsCollapsed) {
        app.state.commentsCollapsed = true;
        app.applyLayoutState();
      }
    });

    window.addEventListener("resize", () => {
      app.applyLayoutState();
    });

    window.addEventListener("scroll", () => {
      app.updateSelfCheckFloatingControls();
    });
  };

  app.setupSelfCheck = function setupSelfCheck() {
    const panel = document.getElementById("trainer-pane");
    const hintBtn = document.getElementById("self-check-hint-btn");
    if (!panel) return;

    if (hintBtn) {
      hintBtn.addEventListener("click", () => {
        if (!app.state.selfCheckMode) return;
        app.state.selfCheckRevealUntil = Date.now() + 10000;
        if (app.state.selfCheckRevealTimerId) clearInterval(app.state.selfCheckRevealTimerId);
        app.state.selfCheckRevealTimerId = window.setInterval(() => {
          if (!app.isSelfCheckRevealActive()) {
            clearInterval(app.state.selfCheckRevealTimerId);
            app.state.selfCheckRevealTimerId = 0;
            app.state.selfCheckRevealUntil = 0;
          }
          app.renderSelfCheckPanel();
          app.applyLayoutState();
        }, 250);
        app.renderSelfCheckPanel();
        app.applyLayoutState();
      });
    }

    panel.addEventListener("submit", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLFormElement)) return;
      if (target.id !== "self-check-form") return;
      event.preventDefault();

      const payload = Object.fromEntries(new FormData(target).entries());
      const questions = app.state.selfCheckQuestions;
      if (!questions.length) return;

      const answered = questions.filter((question) => String(payload[question.id] || "").trim()).length;
      if (answered < questions.length) {
        app.state.selfCheckResultMessage = `Ответь на все вопросы (${answered}/${questions.length}).`;
        app.state.selfCheckResultType = "error";
        app.renderSelfCheckPanel();
        app.applyLayoutState();
        return;
      }

      const correct = questions.filter((question) => String(payload[question.id] || "") === question.correct).length;
      const percent = Math.round((correct / questions.length) * 100);
      app.state.selfCheckResultMessage = `Результат: ${correct}/${questions.length} (${percent}%).`;
      app.state.selfCheckResultType = correct >= Math.ceil(questions.length * 0.7) ? "success" : "error";
      app.renderSelfCheckPanel();
      app.applyLayoutState();
    });

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.id === "self-check-toggle") {
        app.state.selfCheckMode = !app.state.selfCheckMode;
        app.state.selfCheckResultMessage = "";
        app.state.selfCheckResultType = "error";
        app.state.selfCheckRevealUntil = 0;
        if (app.state.selfCheckRevealTimerId) {
          clearInterval(app.state.selfCheckRevealTimerId);
          app.state.selfCheckRevealTimerId = 0;
        }
        app.renderSelfCheckPanel();
        app.applyLayoutState();
        return;
      }

      if (target.id === "self-check-reset-btn") {
        app.state.selfCheckResultMessage = "";
        app.state.selfCheckResultType = "error";
        app.renderSelfCheckPanel();
        app.applyLayoutState();
      }
    });
  };

  app.setupProfileActions = function setupProfileActions() {
    const panel = document.getElementById("access-state");

    panel.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.dataset.action;

      if (action === "profile-tab") {
        const tab = target.dataset.tab;
        if (!tab) return;
        app.state.profileTab = tab;
        if (tab !== "password") {
          app.state.profilePasswordMessage = "";
          app.state.profilePasswordMessageType = "error";
        }
        app.renderAccessState();
        return;
      }

      if (action === "profile-logout") {
        if (app.state.selfCheckRevealTimerId) {
          clearInterval(app.state.selfCheckRevealTimerId);
          app.state.selfCheckRevealTimerId = 0;
        }
        setStudentToken("");
        app.state.auth = null;
        app.state.modules = [];
        app.state.activeTopicId = "";
        app.state.activeTopic = null;
        app.state.comments = [];
        app.state.selfCheckMode = false;
        app.state.selfCheckRevealUntil = 0;
        app.state.selfCheckQuestions = [];
        app.state.selfCheckResultMessage = "";
        app.state.selfCheckResultType = "error";
        app.state.profileTab = "info";
        app.state.profileExpanded = false;
        app.state.commentsCollapsed = true;
        app.state.sidebarCollapsed = true;
        app.showMessage("login-message", "");
        app.showMessage("comment-form-message", "");
        document.getElementById("student-app").classList.add("hidden");
        document.getElementById("module-sidebar-toggle").classList.add("hidden");
        document.getElementById("header-profile").classList.add("hidden");
        document.getElementById("student-sales-cta").classList.remove("hidden");
        document.getElementById("auth-card").classList.remove("hidden");
        app.applyLayoutState();
      }
    });

    panel.addEventListener("submit", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLFormElement)) return;
      if (target.id !== "profile-password-form") return;
      event.preventDefault();

      const payload = Object.fromEntries(new FormData(target).entries());
      const currentPassword = String(payload.currentPassword || "").trim();
      const newPassword = String(payload.newPassword || "").trim();

      if (newPassword.length < 4) {
        app.state.profilePasswordMessage = "Новый пароль: минимум 4 символа.";
        app.state.profilePasswordMessageType = "error";
        app.renderAccessState();
        return;
      }

      try {
        await api.studentChangePassword(currentPassword, newPassword);
        target.reset();
        app.state.profilePasswordMessage = "Пароль успешно обновлен.";
        app.state.profilePasswordMessageType = "success";
        app.renderAccessState();
      } catch (error) {
        app.state.profilePasswordMessage = error.message;
        app.state.profilePasswordMessageType = "error";
        app.renderAccessState();
      }
    });
  };
})(window);
