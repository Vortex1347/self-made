(function initStorage(global) {
  const STORAGE_KEYS = {
    currentStudentLogin: "qa-academy-current-student-login",
    adminToken: "qa-academy-admin-token",
    studentToken: "qa-academy-student-token",
    apiBaseUrl: "qa-academy-api-base-url",
    studentSidebarCollapsed: "qa-academy-student-sidebar-collapsed",
    studentCommentsCollapsed: "qa-academy-student-comments-collapsed",
  };

  function getCurrentStudentLogin() {
    return localStorage.getItem(STORAGE_KEYS.currentStudentLogin) || "";
  }

  function setCurrentStudentLogin(login) {
    localStorage.setItem(STORAGE_KEYS.currentStudentLogin, String(login || ""));
  }

  function getAdminToken() {
    return localStorage.getItem(STORAGE_KEYS.adminToken) || "";
  }

  function setAdminToken(token) {
    if (!token) {
      localStorage.removeItem(STORAGE_KEYS.adminToken);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.adminToken, token);
  }

  function getStudentToken() {
    return localStorage.getItem(STORAGE_KEYS.studentToken) || "";
  }

  function setStudentToken(token) {
    if (!token) {
      localStorage.removeItem(STORAGE_KEYS.studentToken);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.studentToken, token);
  }

  function getApiBaseUrl() {
    return localStorage.getItem(STORAGE_KEYS.apiBaseUrl) || "http://localhost:4000";
  }

  function getStudentSidebarCollapsed() {
    const raw = localStorage.getItem(STORAGE_KEYS.studentSidebarCollapsed);
    if (raw === null) return true;
    return raw === "1";
  }

  function setStudentSidebarCollapsed(collapsed) {
    localStorage.setItem(STORAGE_KEYS.studentSidebarCollapsed, collapsed ? "1" : "0");
  }

  function getStudentCommentsCollapsed() {
    return localStorage.getItem(STORAGE_KEYS.studentCommentsCollapsed) === "1";
  }

  function setStudentCommentsCollapsed(collapsed) {
    localStorage.setItem(STORAGE_KEYS.studentCommentsCollapsed, collapsed ? "1" : "0");
  }

  global.qaStorage = {
    STORAGE_KEYS,
    getCurrentStudentLogin,
    setCurrentStudentLogin,
    getAdminToken,
    setAdminToken,
    getStudentToken,
    setStudentToken,
    getApiBaseUrl,
    getStudentSidebarCollapsed,
    setStudentSidebarCollapsed,
    getStudentCommentsCollapsed,
    setStudentCommentsCollapsed,
  };

  global.getCurrentStudentLogin = getCurrentStudentLogin;
  global.setCurrentStudentLogin = setCurrentStudentLogin;
  global.getAdminToken = getAdminToken;
  global.setAdminToken = setAdminToken;
  global.getStudentToken = getStudentToken;
  global.setStudentToken = setStudentToken;
  global.getStudentSidebarCollapsed = getStudentSidebarCollapsed;
  global.setStudentSidebarCollapsed = setStudentSidebarCollapsed;
  global.getStudentCommentsCollapsed = getStudentCommentsCollapsed;
  global.setStudentCommentsCollapsed = setStudentCommentsCollapsed;
})(window);
