(function initStudentBootstrap(global) {
  const app = global.studentApp;

  app.bootstrap = async function bootstrap() {
    app.setupLogin();
    app.setupTopicClicks();
    app.setupCommentForm();
    app.setupCommentActions();
    app.setupLayoutToggles();
    app.setupSelfCheck();
    app.setupProfileActions();
    app.applyLayoutState();

    if (!getStudentToken()) return;
    try {
      app.state.auth = await api.studentMe();
      app.showStudentApp();
      await app.loadModules();
    } catch (_error) {
      setStudentToken("");
    }
  };

  app.bootstrap();
})(window);
