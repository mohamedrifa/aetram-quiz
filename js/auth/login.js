function initLoginHandlers() {

  $('#candidate-login-form').on(
    'submit',
    function (e) {

      e.preventDefault();

      if (!validateForm($(this))) return;

      AetramLoader.show();

      setTimeout(function () {

        AetramLoader.hide();

        AetramToast.success(
          'Welcome! Redirecting...'
        );

        window.location.href =
          'candidate-instructions.html';

      }, 1200);

    }
  );

}