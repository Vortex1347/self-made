(function initCrmBootstrap(global) {
  const app = global.crmApp;
  const LOGIN_PARAM = "login";
  const PASSWORD_PARAM = "password";

  function cleanupLoginParamsFromUrl() {
    const url = new URL(global.location.href);
    url.searchParams.delete(LOGIN_PARAM);
    url.searchParams.delete(PASSWORD_PARAM);
    global.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  app.tryAutoLoginFromUrl = async function tryAutoLoginFromUrl() {
    const params = new URLSearchParams(global.location.search);
    const login = params.get(LOGIN_PARAM);
    const password = params.get(PASSWORD_PARAM);
    if (!login || !password) return false;

    const form = document.getElementById("admin-login-form");
    if (form instanceof HTMLFormElement) {
      form.elements.login.value = login;
      form.elements.password.value = password;
    }

    try {
      await api.adminLogin(login, password);
      await app.openPanel();
      app.showMessage("admin-login-message", "", "success");
      cleanupLoginParamsFromUrl();
      return true;
    } catch (error) {
      app.showMessage("admin-login-message", error.message);
      cleanupLoginParamsFromUrl();
      return false;
    }
  };

  app.openPanel = async function openPanel() {
    document.getElementById("admin-auth-card").classList.add("hidden");
    document.getElementById("crm-panel").classList.remove("hidden");
    await app.refreshData();
    app.resetModuleFormMode();
    app.resetTopicFormMode();
  };

  app.bootstrap = async function bootstrap() {
    app.setupCrmTabs();
    app.setupAdminLogin();
    app.setupStudentForm();
    app.setupStudentActions();
    app.setupCommentActions();
    app.setupModuleForm();
    app.setupModuleActions();
    app.setupModuleDnD();
    app.setupTopicForm();
    app.setupTopicActions();
    app.setupTopicDnD();
    app.setupTopicPreview();
    app.setupTopicFieldValidationReset();

    const autoLoginDone = await app.tryAutoLoginFromUrl();
    if (autoLoginDone) return;
    if (!getAdminToken()) return;
    try {
      await api.adminMe();
      await app.openPanel();
    } catch (_error) {
      setAdminToken("");
    }
  };

  app.bootstrap();
})(window);
