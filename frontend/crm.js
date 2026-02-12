let studentsState = [];
let commentsState = [];

function isStudentActive(student) {
  const today = new Date().toISOString().slice(0, 10);
  return student.accessUntil >= today;
}

function renderStudents() {
  const container = document.getElementById("students-list");
  const selected = getCurrentStudentLogin();

  if (studentsState.length === 0) {
    container.innerHTML = "<p>Пока нет учеников.</p>";
    return;
  }

  container.innerHTML = studentsState
    .map((student) => {
      const status = isStudentActive(student) ? "active" : "expired";
      const statusText = status === "active" ? "Доступ активен" : "Доступ истек";
      return `
        <article class="student-row">
          <div>
            <strong>${student.name}</strong>
            <p>${student.login}</p>
            <p>До: ${student.accessUntil}</p>
            <p class="student-status ${status}">${statusText}</p>
          </div>
          <div class="student-actions">
            <button class="btn btn-ghost" data-action="select" data-login="${student.login}">
              ${selected === student.login ? "Выбран" : "Выбрать"}
            </button>
            <button class="btn btn-ghost" data-action="delete" data-id="${student.id}">
              Удалить
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCommentsAdmin() {
  const container = document.getElementById("comments-admin-list");

  if (commentsState.length === 0) {
    container.innerHTML = "<p>Комментариев пока нет.</p>";
    return;
  }

  container.innerHTML = commentsState
    .map(
      (comment) => `
        <article class="comment-admin-row">
          <p><strong>${comment.authorName}</strong> (${comment.authorLogin})</p>
          <p>Тема: ${comment.topicTitle || comment.topicId}</p>
          <p class="comment-text">${comment.text}</p>
          <div class="student-actions">
            <button class="btn btn-ghost" data-action="edit-comment" data-id="${comment.id}">Редактировать</button>
            <button class="btn btn-ghost" data-action="delete-comment" data-id="${comment.id}">Удалить</button>
          </div>
        </article>
      `,
    )
    .join("");
}

async function refreshData() {
  studentsState = await api.adminListStudents();
  commentsState = await api.adminListComments();
  renderStudents();
  renderCommentsAdmin();
}

function showMessage(id, text) {
  document.getElementById(id).textContent = text;
}

function setupAdminLogin() {
  const form = document.getElementById("admin-login-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await api.adminLogin(payload.login, payload.password);
      await openPanel();
      showMessage("admin-login-message", "");
      form.reset();
    } catch (error) {
      showMessage("admin-login-message", error.message);
    }
  });
}

function setupStudentForm() {
  const form = document.getElementById("student-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await api.adminCreateOrUpdateStudent(payload);
      await refreshData();
      showMessage("student-form-message", "Ученик сохранен.");
      form.reset();
    } catch (error) {
      showMessage("student-form-message", error.message);
    }
  });
}

function setupStudentActions() {
  const container = document.getElementById("students-list");
  container.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (!action) return;

    if (action === "select") {
      const login = target.dataset.login;
      if (!login) return;
      setCurrentStudentLogin(login);
      renderStudents();
      return;
    }

    if (action === "delete") {
      const id = target.dataset.id;
      if (!id) return;
      try {
        await api.adminDeleteStudent(id);
        await refreshData();
      } catch (error) {
        alert(error.message);
      }
    }
  });
}

function setupCommentActions() {
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
        await refreshData();
        return;
      }

      if (action === "edit-comment") {
        const comment = commentsState.find((item) => item.id === id);
        const next = prompt("Новый текст комментария", comment?.text || "");
        if (!next || !next.trim()) return;
        await api.adminUpdateComment(id, next.trim());
        await refreshData();
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

async function openPanel() {
  document.getElementById("admin-auth-card").classList.add("hidden");
  document.getElementById("crm-panel").classList.remove("hidden");
  await refreshData();
}

async function bootstrap() {
  setupAdminLogin();
  setupStudentForm();
  setupStudentActions();
  setupCommentActions();

  if (!getAdminToken()) return;
  try {
    await api.adminMe();
    await openPanel();
  } catch (error) {
    setAdminToken("");
  }
}

bootstrap();
