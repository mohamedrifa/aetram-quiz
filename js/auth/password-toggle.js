function initPasswordToggle() {

  $(document).on(
    'click',
    '.password-toggle',
    function () {

      var target = $(this).data('target');

      var $input = $('#' + target);

      var type =
        $input.attr('type') === 'password'
          ? 'text'
          : 'password';

      $input.attr('type', type);

    }
  );

}