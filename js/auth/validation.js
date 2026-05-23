function validateEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

function validateForm($form) {

  var valid = true;

  $form.find('[required]').each(function () {

    var $field = $(this);

    var val = $field.val().trim();

    var $error = $field
      .closest('.form-group')
      .find('.form-error')
      .first();

    $field.removeClass('error');

    $error.removeClass('visible');

    if (!val) {

      valid = false;

      $field.addClass('error');

      $error.addClass('visible');

    }

    else if (
      $field.attr('type') === 'email' &&
      !validateEmail(val)
    ) {

      valid = false;

      $field.addClass('error');

      $error.addClass('visible');

    }

  });

  return valid;

}