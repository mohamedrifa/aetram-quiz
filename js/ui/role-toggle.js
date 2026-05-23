var currentRole = 'candidate';

function initRoleToggle() {

  $('.role-toggle-btn').on('click', function () {

    setRole($(this).data('role'));

  });

}

function setRole(role) {

  currentRole = role;

  var isAdmin = role === 'admin';

  $('#role-toggle')
    .toggleClass('admin-active', isAdmin);

  $('.role-toggle-btn')
    .removeClass('active');

  $('.role-toggle-btn')
    .filter('[data-role="' + role + '"]')
    .addClass('active');

  $('#auth-title').text(
    isAdmin
      ? 'Admin Portal'
      : 'Candidate Portal'
  );

  showFormPanel('login');

}