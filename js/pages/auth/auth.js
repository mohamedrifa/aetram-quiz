/**
 * AETRAM GROUP — Authentication Page
 * Role toggle, form switching, validation, redirects
 */

(function ($) {
  'use strict';

  var currentRole = 'candidate';
  var currentMode = 'login'; // login | signup

  var typingPhrases = [
    'Secure AI-proctored assessments for global enterprises.',
    'Real-time analytics powering smarter hiring decisions.',
    'Trusted by multinational HR teams worldwide.'
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;

  /* ---------- Particles ---------- */
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

  /* ---------- Typing Animation ---------- */
  function typeText() {
    var el = $('#typing-text');
    if (!el.length) return;
    var current = typingPhrases[phraseIndex];
    var display = isDeleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
    el.html(display + '<span class="typing-cursor"></span>');

    if (!isDeleting && charIndex === current.length) {
      setTimeout(function () { isDeleting = true; typeText(); }, 2000);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    }
    setTimeout(typeText, isDeleting ? 40 : 80);
  }

  /* ---------- Mouse Glow ---------- */
  function initMouseGlow() {
    var $glow = $('#mouse-glow');
    $(document).on('mousemove', function (e) {
      $glow.css({ left: e.clientX, top: e.clientY });
    });
  }

  /* ---------- Navbar Scroll ---------- */
  function initNavbar() {
    $(window).on('scroll', function () {
      $('#auth-navbar').toggleClass('scrolled', $(this).scrollTop() > 20);
    });
    $('#nav-hamburger').on('click', function () {
      $(this).toggleClass('active');
      $('#nav-links').toggleClass('open');
      $(this).attr('aria-expanded', $(this).hasClass('active'));
    });
  }

  /* ---------- Role Toggle ---------- */
  function setRole(role) {
    currentRole = role;
    var isAdmin = role === 'admin';
    $('#role-toggle').toggleClass('admin-active', isAdmin);
    $('.role-toggle-btn').removeClass('active').filter('[data-role="' + role + '"]')
      .addClass('active').attr('aria-selected', 'true');
    $('.role-toggle-btn').not('[data-role="' + role + '"]').attr('aria-selected', 'false');

    $('#auth-title').text(isAdmin ? 'Admin Portal' : 'Candidate Portal');
    $('#auth-subtitle').text(isAdmin
      ? 'Manage assessments, creators & analytics'
      : 'Sign in to access your assessments');

    showFormPanel(currentMode);
  }

  /* ---------- Form Panel Switch ---------- */
  function showFormPanel(mode) {
    currentMode = mode;
    var panels = {
      candidate: { login: '#candidate-login-panel', signup: '#candidate-signup-panel' },
      admin: { login: '#admin-login-panel', signup: '#admin-signup-panel' }
    };
    $('.form-panel').removeClass('active').addClass('hidden');
    var selector = panels[currentRole][mode];
    $(selector).removeClass('hidden').addClass('active');
  }

  function switchFormAnimated(mode) {
    var $active = $('.form-panel.active');
    $active.addClass('exit-left');
    setTimeout(function () {
      $active.removeClass('active exit-left');
      showFormPanel(mode);
    }, 200);
  }

  /* ---------- Password Toggle ---------- */
  $(document).on('click', '.password-toggle', function () {
    var target = $(this).data('target');
    var $input = $('#' + target);
    var type = $input.attr('type') === 'password' ? 'text' : 'password';
    $input.attr('type', type);
  });

  /* ---------- Password Strength ---------- */
  function checkStrength(password, fillId, textId) {
    var score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    var colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e'];
    var labels = ['Weak', 'Fair', 'Good', 'Strong'];
    var pct = (score / 4) * 100;
    $('#' + fillId).css({ width: pct + '%', background: colors[Math.max(0, score - 1)] || colors[0] });
    $('#' + textId).text(password ? (labels[score - 1] || 'Weak') : '');
  }

  $('#c-signup-password').on('input', function () {
    checkStrength($(this).val(), 'c-strength-fill', 'c-strength-text');
  });
  $('#a-signup-password').on('input', function () {
    checkStrength($(this).val(), 'a-strength-fill', 'a-strength-text');
  });

  /* ---------- Validation ---------- */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm($form) {
    var valid = true;
    $form.find('[required]').each(function () {
      var $field = $(this);
      var $error = $field.closest('.form-group').find('.form-error').first();
      var val = $field.val().trim();
      $field.removeClass('error');
      $error.removeClass('visible');

      if (!val) {
        valid = false;
        $field.addClass('error');
        $error.addClass('visible');
      } else if ($field.attr('type') === 'email' && !validateEmail(val)) {
        valid = false;
        $field.addClass('error');
        $error.addClass('visible');
      }
    });
    return valid;
  }

  /* ---------- Login Handlers (AJAX-ready) ---------- */
  $('#candidate-login-form').on('submit', function (e) {
    e.preventDefault();
    if (!validateForm($(this))) return;
    AetramLoader.show();
    /* AJAX placeholder:
    AetramAPI.request('/auth/candidate/login', 'POST', {...})
    */
    setTimeout(function () {
      AetramLoader.hide();
      AetramSession.set('user', { role: 'candidate', email: $('#c-login-email').val() });
      AetramToast.success('Welcome! Redirecting to assessment...');
      setTimeout(function () {
        window.location.href = '../candidate/candidate-instructions.html';
      }, 800);
    }, 1200);
  });

  $('#admin-login-form').on('submit', function (e) {
    e.preventDefault();
    if (!validateForm($(this))) return;
    AetramLoader.show();
    setTimeout(function () {
      AetramLoader.hide();
      AetramSession.set('user', { role: 'admin', email: $('#a-login-email').val() });
      AetramToast.success('Admin access granted. Loading dashboard...');
      setTimeout(function () {
        window.location.href = '../admin/admin-dashboard.html';
      }, 800);
    }, 1200);
  });

  /* ---------- Signup Handlers ---------- */
  function handleSignup(e, role, pwdId, confirmId, confirmErrId) {
    e.preventDefault();
    var $form = $(e.target);
    if (!validateForm($form)) return;
    var pwd = $('#' + pwdId).val();
    var confirm = $('#' + confirmId).val();
    if (pwd !== confirm) {
      $('#' + confirmErrId).addClass('visible');
      $('#' + confirmId).addClass('error');
      return;
    }
    AetramLoader.show();
    setTimeout(function () {
      AetramLoader.hide();
      AetramToast.success('Account created successfully!');
      switchFormAnimated('login');
    }, 1500);
  }

  $('#candidate-signup-form').on('submit', function (e) {
    handleSignup(e, 'candidate', 'c-signup-password', 'c-signup-confirm', 'c-confirm-error');
  });
  $('#admin-signup-form').on('submit', function (e) {
    handleSignup(e, 'admin', 'a-signup-password', 'a-signup-confirm', 'a-confirm-error');
  });

  /* ---------- Event Bindings ---------- */
  $(document).ready(function () {
    initParticles();
    initMouseGlow();
    initNavbar();
    typeText();

    /* Animated counters */
    $('[data-counter]').each(function () {
      var $el = $(this);
      var target = parseInt($el.data('counter'), 10);
      AetramCounter($el, target, 2000);
    });

    /* Role toggle */
    $('.role-toggle-btn').on('click', function () {
      setRole($(this).data('role'));
    });

    /* Login/Signup switches */
    $('#candidate-to-signup, #admin-to-signup').on('click', function (e) {
      e.preventDefault();
      switchFormAnimated('signup');
    });
    $('#candidate-to-login, #admin-to-login').on('click', function (e) {
      e.preventDefault();
      switchFormAnimated('login');
    });

    /* Social buttons */
    $('.social-btn').on('click', function () {
      AetramToast.info('Social login integration — connect OAuth API');
    });
  });

})(jQuery);
