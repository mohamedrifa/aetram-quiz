function initMouseGlow() {

  var $glow = $('#mouse-glow');

  $(document).on('mousemove', function (e) {

    $glow.css({
      left: e.clientX,
      top: e.clientY
    });

  });

}