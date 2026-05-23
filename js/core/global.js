/**
 * AETRAM GROUP — Global Utilities
 * Toast, Loading, Ripple, Session, AJAX helpers
 */

(function (window, $) {
  'use strict';

  /* ---------- Toast System ---------- */
  window.AetramToast = {
    container: null,

    init: function () {
      if (!$('.toast-container').length) {
        $('body').append('<div class="toast-container" role="status" aria-live="polite"></div>');
      }
      this.container = $('.toast-container');
    },

    show: function (message, type) {
      type = type || 'info';
      this.init();
      var $toast = $('<div class="toast ' + type + '">' + message + '</div>');
      this.container.append($toast);
      setTimeout(function () {
        $toast.fadeOut(400, function () { $(this).remove(); });
      }, 4000);
    },

    success: function (msg) { this.show(msg, 'success'); },
    error: function (msg) { this.show(msg, 'error'); },
    warning: function (msg) { this.show(msg, 'warning'); },
    info: function (msg) { this.show(msg, 'info'); }
  };

  /* ---------- Loading Overlay ---------- */
  window.AetramLoader = {
    $el: null,

    init: function () {
      if (!$('.loading-overlay').length) {
        $('body').append(
          '<div class="loading-overlay" aria-hidden="true">' +
          '<div class="spinner" role="progressbar" aria-label="Loading"></div></div>'
        );
      }
      this.$el = $('.loading-overlay');
    },

    show: function () {
      this.init();
      this.$el.addClass('active').attr('aria-hidden', 'false');
    },

    hide: function () {
      this.init();
      this.$el.removeClass('active').attr('aria-hidden', 'true');
    }
  };

  /* ---------- Ripple Effect ---------- */
  window.AetramRipple = function (e) {
    var $btn = $(e.currentTarget);
    var offset = $btn.offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    var $ripple = $('<span class="ripple"></span>');
    $ripple.css({ left: x, top: y, width: 10, height: 10 });
    $btn.append($ripple);
    setTimeout(function () { $ripple.remove(); }, 600);
  };

  /* ---------- Session Storage ---------- */
  window.AetramSession = {
    set: function (key, value) {
      try {
        sessionStorage.setItem('aetram_' + key, JSON.stringify(value));
      } catch (err) { /* quota */ }
    },
    get: function (key) {
      try {
        var v = sessionStorage.getItem('aetram_' + key);
        return v ? JSON.parse(v) : null;
      } catch (err) { return null; }
    },
    remove: function (key) {
      sessionStorage.removeItem('aetram_' + key);
    },
    clear: function () {
      Object.keys(sessionStorage).forEach(function (k) {
        if (k.indexOf('aetram_') === 0) sessionStorage.removeItem(k);
      });
    }
  };

  /* ---------- Animated Counter ---------- */
  window.AetramCounter = function ($el, target, duration) {
    duration = duration || 1500;
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.floor(progress * target);
      $el.text(current.toLocaleString());
      if (progress < 1) requestAnimationFrame(step);
      else $el.text(target.toLocaleString());
    }
    requestAnimationFrame(step);
  };

  /* ---------- AJAX Placeholder ---------- */
  window.AetramAPI = {
    baseUrl: '/api', // configure for production

    request: function (endpoint, method, data) {
      return $.ajax({
        url: this.baseUrl + endpoint,
        method: method || 'GET',
        data: data ? JSON.stringify(data) : undefined,
        contentType: 'application/json',
        dataType: 'json'
      });
    }
  };

  /* ---------- Document Ready ---------- */
  $(document).ready(function () {
    AetramToast.init();

    /* Global ripple on .btn-gold, .btn-danger */
    $(document).on('click', '.btn-gold, .btn-danger, .btn-ripple', AetramRipple);

    /* Floating label sync */
    $('.form-input').each(function () {
      if ($(this).val()) $(this).addClass('has-value');
    });
    $(document).on('input blur', '.form-input', function () {
      $(this).toggleClass('has-value', !!$(this).val());
    });
  });

})(window, jQuery);
