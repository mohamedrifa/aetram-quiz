function initPasswordStrength() {

  $('#c-signup-password').on(
    'input',
    function () {

      checkStrength(
        $(this).val(),
        'c-strength-fill',
        'c-strength-text'
      );

    }
  );

  $('#a-signup-password').on(
    'input',
    function () {

      checkStrength(
        $(this).val(),
        'a-strength-fill',
        'a-strength-text'
      );

    }
  );

}

function checkStrength(
  password,
  fillId,
  textId
) {

  var score = 0;

  if (password.length >= 8) score++;

  if (/[A-Z]/.test(password)) score++;

  if (/[0-9]/.test(password)) score++;

  if (/[^A-Za-z0-9]/.test(password)) score++;

  var colors = [
    '#ef4444',
    '#f59e0b',
    '#eab308',
    '#22c55e'
  ];

  var labels = [
    'Weak',
    'Fair',
    'Good',
    'Strong'
  ];

  var pct = (score / 4) * 100;

  $('#' + fillId).css({
    width: pct + '%',
    background:
      colors[Math.max(0, score - 1)] || colors[0]
  });

  $('#' + textId).text(
    password
      ? (labels[score - 1] || 'Weak')
      : ''
  );

}