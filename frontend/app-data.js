const STORAGE_KEYS = {
  currentStudentLogin: "qa-academy-current-student-login",
  adminToken: "qa-academy-admin-token",
  studentToken: "qa-academy-student-token"
};

const API_BASE_URL = localStorage.getItem("qa-academy-api-base-url") || "http://localhost:4000";

function getCurrentStudentLogin() {
  return localStorage.getItem(STORAGE_KEYS.currentStudentLogin) || "";
}

function setCurrentStudentLogin(login) {
  localStorage.setItem(STORAGE_KEYS.currentStudentLogin, login);
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

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const json = text ? tryParseJson(text) : null;
  if (!response.ok) {
    const message = json?.message || `Request failed: ${response.status}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }
  return json;
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function withAdminAuth() {
  const token = getAdminToken();
  if (!token) throw new Error("Нужен вход администратора.");
  return { Authorization: `Bearer ${token}` };
}

function withStudentAuth() {
  const token = getStudentToken();
  if (!token) throw new Error("Нужен вход ученика.");
  return { Authorization: `Bearer ${token}` };
}

const api = {
  async adminLogin(login, password) {
    const data = await apiRequest("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password })
    });
    setAdminToken(data.accessToken);
    return data;
  },

  async adminMe() {
    return apiRequest("/api/v1/auth/me", {
      headers: withAdminAuth()
    });
  },

  async adminListStudents() {
    return apiRequest("/api/v1/admin/students", {
      headers: withAdminAuth()
    });
  },

  async adminCreateOrUpdateStudent(payload) {
    return apiRequest("/api/v1/admin/students", {
      method: "POST",
      headers: withAdminAuth(),
      body: JSON.stringify(payload)
    });
  },

  async adminDeleteStudent(studentId) {
    return apiRequest(`/api/v1/admin/students/${studentId}`, {
      method: "DELETE",
      headers: withAdminAuth()
    });
  },

  async adminListComments() {
    return apiRequest("/api/v1/admin/comments", {
      headers: withAdminAuth()
    });
  },

  async adminUpdateComment(commentId, text) {
    return apiRequest(`/api/v1/admin/comments/${commentId}`, {
      method: "PATCH",
      headers: withAdminAuth(),
      body: JSON.stringify({ text })
    });
  },

  async adminDeleteComment(commentId) {
    return apiRequest(`/api/v1/admin/comments/${commentId}`, {
      method: "DELETE",
      headers: withAdminAuth()
    });
  },

  async studentLogin(login, password) {
    const data = await apiRequest("/api/public/student-auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password })
    });
    setStudentToken(data.accessToken);
    setCurrentStudentLogin(data.student.login);
    return data;
  },

  async studentMe() {
    return apiRequest("/api/public/student-auth/me", {
      headers: withStudentAuth()
    });
  },

  async listModules() {
    return apiRequest("/api/public/course/modules", {
      headers: withStudentAuth()
    });
  },

  async getTopic(topicId) {
    return apiRequest(`/api/public/course/topics/${topicId}`, {
      headers: withStudentAuth()
    });
  },

  async listTopicComments(topicId) {
    return apiRequest(`/api/public/topics/${topicId}/comments`, {
      headers: withStudentAuth()
    });
  },

  async createTopicComment(topicId, text) {
    return apiRequest(`/api/public/topics/${topicId}/comments`, {
      method: "POST",
      headers: withStudentAuth(),
      body: JSON.stringify({ text })
    });
  },

  async updateTopicComment(topicId, commentId, text) {
    return apiRequest(`/api/public/topics/${topicId}/comments/${commentId}`, {
      method: "PATCH",
      headers: withStudentAuth(),
      body: JSON.stringify({ text })
    });
  },

  async deleteTopicComment(topicId, commentId) {
    return apiRequest(`/api/public/topics/${topicId}/comments/${commentId}`, {
      method: "DELETE",
      headers: withStudentAuth()
    });
  }
};
