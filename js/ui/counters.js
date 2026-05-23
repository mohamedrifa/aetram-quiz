function initCounters() {

  $('[data-counter]').each(function () {

    var $el = $(this);

    var target = parseInt(
      $el.data('counter'),
      10
    );

    animateCounter($el, target, 2000);

  });

}

function animateCounter(
  $element,
  target,
  duration
) {

  var start = 0;

  var increment = target / (duration / 16);

  function updateCounter() {

    start += increment;

    if (start >= target) {

      $element.text(target);

      return;

    }

    $element.text(Math.floor(start));

    requestAnimationFrame(updateCounter);

  }

  updateCounter();

}