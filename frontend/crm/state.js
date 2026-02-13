(function initCrmState(global) {
  const app = (global.crmApp = global.crmApp || {});

  app.state = {
    students: [],
    comments: [],
    modules: [],
    topics: [],
    editingModuleId: "",
    editingTopicId: "",
    draggingModuleId: "",
    draggingTopicId: "",
  };

  app.escapeHtml = function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  app.encodeData = function encodeData(value) {
    return encodeURIComponent(String(value || ""));
  };

  app.decodeData = function decodeData(value) {
    return decodeURIComponent(String(value || ""));
  };

  app.isStudentActive = function isStudentActive(student) {
    const today = new Date().toISOString().slice(0, 10);
    return student.accessUntil >= today;
  };

  app.showMessage = function showMessage(id, text, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("form-message-success", type === "success");
  };

  app.setFieldValidation = function setFieldValidation(fieldId, isInvalid) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.toggle("input-invalid", isInvalid);
    field.setAttribute("aria-invalid", isInvalid ? "true" : "false");
  };

  app.clearTopicJsonValidation = function clearTopicJsonValidation() {
    app.setFieldValidation("topic-content-blocks", false);
    app.setFieldValidation("topic-trainer", false);
  };

  app.clearDragOver = function clearDragOver(container, type) {
    container
      .querySelectorAll(`[data-drag-type='${type}'].drag-over`)
      .forEach((node) => node.classList.remove("drag-over"));
  };
})(window);
