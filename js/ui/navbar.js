function initNavbar() {

  $(window).on('scroll', function () {

    $('#auth-navbar')
      .toggleClass(
        'scrolled',
        $(this).scrollTop() > 20
      );

  });

  $('#nav-hamburger').on('click', function () {

    $(this).toggleClass('active');

    $('#nav-links').toggleClass('open');

    $(this).attr(
      'aria-expanded',
      $(this).hasClass('active')
    );

  });

}