function initParticles() {

  var canvas = document.getElementById('particles-canvas');

  if (!canvas) return;

  var ctx = canvas.getContext('2d');

  var particles = [];

  var count = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();

  window.addEventListener('resize', resize);

  for (var i = 0; i < count; i++) {

    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2
    });

  }

  function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (p) {

      p.x += p.dx;

      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;

      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.beginPath();

      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

      ctx.fillStyle = 'rgba(217, 179, 90, ' + p.opacity + ')';

      ctx.fill();

    });

    requestAnimationFrame(animate);

  }

  animate();

}