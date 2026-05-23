var currentMode = 'login';

function initFormSwitcher() {

  $('#candidate-to-signup, #admin-to-signup')
    .on('click', function (e) {

      e.preventDefault();

      switchFormAnimated('signup');

    });

  $('#candidate-to-login, #admin-to-login')
    .on('click', function (e) {

      e.preventDefault();

      switchFormAnimated('login');

    });

}

function showFormPanel(mode) {

  currentMode = mode;

  var panels = {
    candidate: {
      login: '#candidate-login-panel',
      signup: '#candidate-signup-panel'
    },
    admin: {
      login: '#admin-login-panel',
      signup: '#admin-signup-panel'
    }
  };

  $('.form-panel')
    .removeClass('active')
    .addClass('hidden');

  $(panels[currentRole][mode])
    .removeClass('hidden')
    .addClass('active');

}

function switchFormAnimated(mode) {

  var $active = $('.form-panel.active');

  $active.addClass('exit-left');

  setTimeout(function () {

    $active.removeClass('active exit-left');

    showFormPanel(mode);

  }, 200);

}