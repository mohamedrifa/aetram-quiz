function initSignupHandlers() {

  $('#candidate-signup-form').on(
    'submit',
    function (e) {

      handleSignup(
        e,
        'c-signup-password',
        'c-signup-confirm',
        'c-confirm-error'
      );

    }
  );

  $('#admin-signup-form').on(
    'submit',
    function (e) {

      handleSignup(
        e,
        'a-signup-password',
        'a-signup-confirm',
        'a-confirm-error'
      );

    }
  );

}

function handleSignup(
  e,
  pwdId,
  confirmId,
  confirmErrId
) {

  e.preventDefault();

  var $form = $(e.target);

  if (!validateForm($form)) return;

  var pwd = $('#' + pwdId).val();

  var confirm = $('#' + confirmId).val();

  if (pwd !== confirm) {

    $('#' + confirmErrId)
      .addClass('visible');

    $('#' + confirmId)
      .addClass('error');

    return;

  }

  AetramLoader.show();

  setTimeout(function () {

    AetramLoader.hide();

    AetramToast.success(
      'Account created successfully!'
    );

    switchFormAnimated('login');

  }, 1500);

}