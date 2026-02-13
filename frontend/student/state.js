(function initStudentState(global) {
  const app = (global.studentApp = global.studentApp || {});

  app.state = {
    auth: null,
    modules: [],
    activeTopicId: "",
    activeTopic: null,
    comments: [],
    sidebarCollapsed: typeof global.getStudentSidebarCollapsed === "function" ? global.getStudentSidebarCollapsed() : false,
    commentsCollapsed:
      typeof global.getStudentCommentsCollapsed === "function" ? global.getStudentCommentsCollapsed() : false,
    profileExpanded: false,
    profileTab: "info",
    profilePasswordMessage: "",
    profilePasswordMessageType: "error",
    selfCheckMode: false,
    selfCheckRevealUntil: 0,
    selfCheckRevealTimerId: 0,
    selfCheckQuestions: [],
    selfCheckResultMessage: "",
    selfCheckResultType: "error",
  };

  app.escapeHtml = function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  app.showMessage = function showMessage(id, text) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = text;
  };

  app.isAccessActive = function isAccessActive() {
    return !!app.state.auth?.accessActive;
  };

  app.isSelfCheckRevealActive = function isSelfCheckRevealActive() {
    return app.state.selfCheckRevealUntil > Date.now();
  };

  app.updateSelfCheckFloatingControls = function updateSelfCheckFloatingControls() {
    const hintBtn = document.getElementById("self-check-hint-btn");
    const toggleBtn = document.getElementById("self-check-toggle");
    const leftPane = document.querySelector(".lesson-left");
    const rightPane = document.getElementById("trainer-pane");

    const setFloatingPosition = (button, pane, enabled) => {
      if (!button) return;
      if (!pane || !enabled) {
        button.style.removeProperty("position");
        button.style.removeProperty("left");
        button.style.removeProperty("top");
        button.style.removeProperty("transform");
        button.style.removeProperty("z-index");
        return;
      }

      const rect = pane.getBoundingClientRect();
      const centerX = Math.round(rect.left + rect.width / 2);
      const clampedX = Math.min(window.innerWidth - 110, Math.max(110, centerX));

      button.style.position = "fixed";
      button.style.left = `${clampedX}px`;
      button.style.top = "50%";
      button.style.transform = "translate(-50%, -50%)";
      button.style.zIndex = "8";
    };

    setFloatingPosition(hintBtn, leftPane, app.state.selfCheckMode);
    setFloatingPosition(toggleBtn, rightPane, !app.state.selfCheckMode);
  };

  app.showStudentApp = function showStudentApp() {
    document.getElementById("auth-card").classList.add("hidden");
    document.getElementById("student-app").classList.remove("hidden");
    document.getElementById("module-sidebar-toggle").classList.remove("hidden");
    document.getElementById("header-profile").classList.remove("hidden");
    document.getElementById("student-sales-cta").classList.add("hidden");
    app.applyLayoutState();
  };

  app.applyLayoutState = function applyLayoutState() {
    const appEl = document.getElementById("student-app");
    const sidebarToggle = document.getElementById("module-sidebar-toggle");
    const sidebarClose = document.getElementById("module-sidebar-close");
    const sidebarBackdrop = document.getElementById("student-sidebar-backdrop");
    const commentsSection = document.getElementById("lesson-comments");
    const commentsToggle = document.getElementById("comments-toggle");
    const profileToggle = document.getElementById("profile-toggle");
    const profileBody = document.getElementById("access-state");
    const selfCheckToggle = document.getElementById("self-check-toggle");
    const selfCheckHintBtn = document.getElementById("self-check-hint-btn");
    const selfCheckHintTimer = document.getElementById("self-check-hint-timer");
    const readingPane = document.getElementById("lesson-reading-pane");
    const sidebarOpen = !app.state.sidebarCollapsed;

    if (appEl) {
      appEl.classList.toggle("sidebar-collapsed", app.state.sidebarCollapsed);
      appEl.classList.toggle("sidebar-open", sidebarOpen);
    }

    if (sidebarToggle) {
      sidebarToggle.textContent = app.state.sidebarCollapsed ? "☰ Модули" : "✕ Модули";
      sidebarToggle.setAttribute("aria-expanded", sidebarOpen ? "true" : "false");
    }

    if (sidebarClose) {
      sidebarClose.setAttribute("aria-expanded", sidebarOpen ? "true" : "false");
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.setAttribute("aria-hidden", sidebarOpen ? "false" : "true");
    }

    if (commentsSection) {
      commentsSection.classList.toggle("hidden", app.state.commentsCollapsed);
    }

    if (commentsToggle) {
      commentsToggle.textContent = app.state.commentsCollapsed ? "Открыть комментарии" : "Закрыть комментарии";
      commentsToggle.setAttribute("aria-expanded", app.state.commentsCollapsed ? "false" : "true");
    }

    if (profileBody) {
      profileBody.classList.toggle("hidden", !app.state.profileExpanded);
    }

    if (profileToggle) {
      profileToggle.textContent = app.state.profileExpanded ? "Профиль ▲" : "Профиль ▼";
      profileToggle.setAttribute("aria-expanded", app.state.profileExpanded ? "true" : "false");
    }

    if (selfCheckToggle) {
      selfCheckToggle.textContent = app.state.selfCheckMode ? "Завершить самопроверку" : "Проверить себя";
      selfCheckToggle.setAttribute("aria-pressed", app.state.selfCheckMode ? "true" : "false");
    }

    if (selfCheckHintBtn) {
      const revealActive = app.state.selfCheckMode && app.isSelfCheckRevealActive();
      selfCheckHintBtn.classList.toggle("hidden", !app.state.selfCheckMode || revealActive);
      selfCheckHintBtn.disabled = !app.state.selfCheckMode || revealActive;
    }

    if (readingPane) {
      const shouldBlur = app.state.selfCheckMode && !app.isSelfCheckRevealActive();
      readingPane.classList.toggle("self-check-blurred", shouldBlur);
    }

    if (selfCheckHintTimer) {
      if (app.state.selfCheckMode && app.isSelfCheckRevealActive()) {
        const seconds = Math.max(1, Math.ceil((app.state.selfCheckRevealUntil - Date.now()) / 1000));
        selfCheckHintTimer.textContent = `Осталось: ${seconds}с`;
      } else {
        selfCheckHintTimer.textContent = "";
      }
    }

    if (typeof global.setStudentSidebarCollapsed === "function") {
      global.setStudentSidebarCollapsed(app.state.sidebarCollapsed);
    }
    if (typeof global.setStudentCommentsCollapsed === "function") {
      global.setStudentCommentsCollapsed(app.state.commentsCollapsed);
    }

    const isMobileDrawer = window.matchMedia("(max-width: 980px)").matches;
    document.body.classList.toggle("student-drawer-open", isMobileDrawer && sidebarOpen);
    app.updateSelfCheckFloatingControls();
  };
})(window);
