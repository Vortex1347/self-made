(function initApi(global) {
  function withAdminAuth() {
    const token = global.getAdminToken();
    if (!token) throw new Error("Нужен вход администратора.");
    return { Authorization: `Bearer ${token}` };
  }

  function withStudentAuth() {
    const token = global.getStudentToken();
    if (!token) throw new Error("Нужен вход ученика.");
    return { Authorization: `Bearer ${token}` };
  }

  const api = {
    async adminLogin(login, password) {
      const data = await global.qaHttp.apiRequest("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ login, password }),
      });
      global.setAdminToken(data.accessToken);
      return data;
    },

    async adminMe() {
      return global.qaHttp.apiRequest("/api/v1/auth/me", {
        headers: withAdminAuth(),
      });
    },

    async adminListStudents() {
      return global.qaHttp.apiRequest("/api/v1/admin/students", {
        headers: withAdminAuth(),
      });
    },

    async adminCreateOrUpdateStudent(payload) {
      return global.qaHttp.apiRequest("/api/v1/admin/students", {
        method: "POST",
        headers: withAdminAuth(),
        body: JSON.stringify(payload),
      });
    },

    async adminDeleteStudent(studentId) {
      return global.qaHttp.apiRequest(`/api/v1/admin/students/${studentId}`, {
        method: "DELETE",
        headers: withAdminAuth(),
      });
    },

    async adminListComments() {
      return global.qaHttp.apiRequest("/api/v1/admin/comments", {
        headers: withAdminAuth(),
      });
    },

    async adminUpdateComment(commentId, text) {
      return global.qaHttp.apiRequest(`/api/v1/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: withAdminAuth(),
        body: JSON.stringify({ text }),
      });
    },

    async adminDeleteComment(commentId) {
      return global.qaHttp.apiRequest(`/api/v1/admin/comments/${commentId}`, {
        method: "DELETE",
        headers: withAdminAuth(),
      });
    },

    async adminListCourseModules() {
      return global.qaHttp.apiRequest("/api/v1/admin/course/modules", {
        headers: withAdminAuth(),
      });
    },

    async adminCreateCourseModule(payload) {
      return global.qaHttp.apiRequest("/api/v1/admin/course/modules", {
        method: "POST",
        headers: withAdminAuth(),
        body: JSON.stringify(payload),
      });
    },

    async adminUpdateCourseModule(moduleId, payload) {
      return global.qaHttp.apiRequest(`/api/v1/admin/course/modules/${moduleId}`, {
        method: "PATCH",
        headers: withAdminAuth(),
        body: JSON.stringify(payload),
      });
    },

    async adminDeleteCourseModule(moduleId) {
      return global.qaHttp.apiRequest(`/api/v1/admin/course/modules/${moduleId}`, {
        method: "DELETE",
        headers: withAdminAuth(),
      });
    },

    async adminListCourseTopics() {
      return global.qaHttp.apiRequest("/api/v1/admin/course/topics", {
        headers: withAdminAuth(),
      });
    },

    async adminCreateCourseTopic(payload) {
      return global.qaHttp.apiRequest("/api/v1/admin/course/topics", {
        method: "POST",
        headers: withAdminAuth(),
        body: JSON.stringify(payload),
      });
    },

    async adminUpdateCourseTopic(topicId, payload) {
      return global.qaHttp.apiRequest(`/api/v1/admin/course/topics/${topicId}`, {
        method: "PATCH",
        headers: withAdminAuth(),
        body: JSON.stringify(payload),
      });
    },

    async adminDeleteCourseTopic(topicId) {
      return global.qaHttp.apiRequest(`/api/v1/admin/course/topics/${topicId}`, {
        method: "DELETE",
        headers: withAdminAuth(),
      });
    },

    async studentLogin(login, password) {
      const data = await global.qaHttp.apiRequest("/api/public/student-auth/login", {
        method: "POST",
        body: JSON.stringify({ login, password }),
      });
      global.setStudentToken(data.accessToken);
      global.setCurrentStudentLogin(data.student.login);
      return data;
    },

    async studentMe() {
      return global.qaHttp.apiRequest("/api/public/student-auth/me", {
        headers: withStudentAuth(),
      });
    },

    async studentChangePassword(currentPassword, newPassword) {
      return global.qaHttp.apiRequest("/api/public/student-auth/password", {
        method: "PATCH",
        headers: withStudentAuth(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },

    async listModules() {
      return global.qaHttp.apiRequest("/api/public/course/modules", {
        headers: withStudentAuth(),
      });
    },

    async getTopic(topicId) {
      return global.qaHttp.apiRequest(`/api/public/course/topics/${topicId}`, {
        headers: withStudentAuth(),
      });
    },

    async getTrainer(topicId) {
      return global.qaHttp.apiRequest(`/api/public/course/topics/${topicId}/trainer`, {
        headers: withStudentAuth(),
      });
    },

    async submitTrainer(topicId, payload) {
      return global.qaHttp.apiRequest(`/api/public/course/topics/${topicId}/trainer/submit`, {
        method: "POST",
        headers: withStudentAuth(),
        body: JSON.stringify(payload),
      });
    },

    async listTopicComments(topicId) {
      return global.qaHttp.apiRequest(`/api/public/topics/${topicId}/comments`, {
        headers: withStudentAuth(),
      });
    },

    async createTopicComment(topicId, text) {
      return global.qaHttp.apiRequest(`/api/public/topics/${topicId}/comments`, {
        method: "POST",
        headers: withStudentAuth(),
        body: JSON.stringify({ text }),
      });
    },

    async updateTopicComment(topicId, commentId, text) {
      return global.qaHttp.apiRequest(`/api/public/topics/${topicId}/comments/${commentId}`, {
        method: "PATCH",
        headers: withStudentAuth(),
        body: JSON.stringify({ text }),
      });
    },

    async deleteTopicComment(topicId, commentId) {
      return global.qaHttp.apiRequest(`/api/public/topics/${topicId}/comments/${commentId}`, {
        method: "DELETE",
        headers: withStudentAuth(),
      });
    },
  };

  global.api = api;
})(window);
