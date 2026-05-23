/**
 * AETRAM GROUP — Candidate Assessment Module
 * Instructions, proctoring, test interface, feedback
 */

window.CandidateApp = (function ($) {
  'use strict';

  var QUESTIONS = [
    { id: 1, category: 'Technical', difficulty: 'Easy', type: 'single', text: 'Which HTML5 element is used for independent, self-contained content?', options: ['<section>', '<article>', '<div>', '<content>'], answer: 1 },
    { id: 2, category: 'Technical', difficulty: 'Medium', type: 'single', text: 'What does CSS flexbox property "justify-content: space-between" do?', options: ['Centers items', 'Distributes space between items', 'Wraps items', 'Aligns vertically'], answer: 1 },
    { id: 3, category: 'Logical', difficulty: 'Medium', type: 'single', text: 'If all roses are flowers and some flowers fade quickly, which statement is necessarily true?', options: ['All roses fade quickly', 'Some roses may fade quickly', 'No roses fade', 'All flowers are roses'], answer: 1 },
    { id: 4, category: 'Aptitude', difficulty: 'Hard', type: 'single', text: 'A train 120m long passes a pole in 8 seconds. Speed in km/h?', options: ['54', '45', '60', '72'], answer: 0 },
    { id: 5, category: 'Technical', difficulty: 'Easy', type: 'multi', text: 'Select valid JavaScript ES6 features:', options: ['Arrow functions', 'var hoisting only', 'Template literals', 'Classes'], answers: [0, 2, 3] },
    { id: 6, category: 'Communication', difficulty: 'Easy', type: 'single', text: 'Best practice for professional email subject lines?', options: ['ALL CAPS URGENT', 'Clear, specific summary', 'No subject', 'Emoji only'], answer: 1 },
    { id: 7, category: 'Technical', difficulty: 'Medium', type: 'single', text: 'jQuery method to perform AJAX GET request?', options: ['$.post()', '$.get()', '$.ajax() only', '$.fetch()'], answer: 1 },
    { id: 8, category: 'HR', difficulty: 'Easy', type: 'single', text: 'STAR method in interviews stands for Situation, Task, Action, and?', options: ['Achievement', 'Result', 'Review', 'Report'], answer: 1 },
    { id: 9, category: 'Logical', difficulty: 'Hard', type: 'single', text: 'Series: 2, 6, 12, 20, 30 — next number?', options: ['40', '42', '44', '48'], answer: 1 },
    { id: 10, category: 'Technical', difficulty: 'Medium', type: 'single', text: 'Accessibility attribute for screen readers on buttons?', options: ['role="button"', 'aria-label', 'tab-focus', 'alt-text'], answer: 1 }
  ];

  var state = {
    currentIndex: 0,
    answers: {},
    review: {},
    timerSeconds: 45 * 60,
    violations: 0,
    terminated: false,
    timerInterval: null,
    autosaveInterval: null
  };

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function playWarningSound() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 440;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) { /* audio optional */ }
  }

  /* ---------- Proctoring ---------- */
  function initProctoring() {
    var violationHandler = function (reason) {
      if (state.terminated) return;
      state.violations++;
      playWarningSound();

      if (state.violations >= 2) {
        terminateAssessment();
        return;
      }

      $('#violation-text, #violation-message').text(
        'Warning: Tab switching or exiting fullscreen is prohibited. Further violations will terminate the assessment.'
      );
      $('#violation-modal').addClass('active');
    };

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && !state.terminated) violationHandler('tab');
    });

    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement && !state.terminated && window.location.pathname.indexOf('candidate-test') >= 0) {
        violationHandler('fullscreen');
      }
    });

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && !state.terminated) violationHandler('esc');
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u') || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        AetramToast.warning('Developer tools are disabled during assessment');
      }
    });

    $(document).on('contextmenu copy paste cut', function (e) {
      e.preventDefault();
      AetramToast.warning('Copy/paste is disabled during assessment');
    });

    $('#violation-ok, #violation-dismiss').on('click', function () {
      $('#violation-modal').removeClass('active');
      requestFullscreen();
    });
  }

  function requestFullscreen() {
    var el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(function () {});
  }

  function terminateAssessment() {
    state.terminated = true;
    clearInterval(state.timerInterval);
    clearInterval(state.autosaveInterval);
    autoSave();
    $('#violation-modal').removeClass('active');
    $('#terminate-modal').addClass('active');
    var count = 5;
    var iv = setInterval(function () {
      count--;
      $('#terminate-countdown').text('Redirecting in ' + count + ' seconds...');
      if (count <= 0) {
        clearInterval(iv);
        window.location.href = 'feedback.html?terminated=1';
      }
    }, 1000);
  }

  /* ---------- Timer ---------- */
  function startTimer($display, $card) {
    function tick() {
      if (state.terminated) return;
      state.timerSeconds--;
      $display.text(formatTime(state.timerSeconds));

      if (state.timerSeconds <= 300) $card.addClass('warning');
      if (state.timerSeconds <= 60) {
        $card.addClass('critical').removeClass('warning');
      }

      if (state.timerSeconds <= 0) {
        clearInterval(state.timerInterval);
        AetramToast.warning('Time expired. Auto-submitting...');
        submitAssessment(true);
      }
    }
    state.timerInterval = setInterval(tick, 1000);
  }

  function autoSave() {
    AetramSession.set('assessment_answers', {
      answers: state.answers,
      review: state.review,
      workspace: $('#rough-workspace').val(),
      remaining: state.timerSeconds
    });
    /* AetramAPI.request('/assessment/autosave', 'POST', {...}); */
    if ($('#rough-workspace').length) {
      AetramToast.success('Answers saved successfully');
    }
  }

  /* ---------- Test UI ---------- */
  function getQuestionStatus(i) {
    if (i === state.currentIndex) return 'current';
    if (state.review[i]) return 'review';
    if (state.answers[i] !== undefined) return 'answered';
    return 'unanswered';
  }

  function updateStats() {
    var answered = Object.keys(state.answers).length;
    var reviewCount = Object.keys(state.review).filter(function (k) { return state.review[k]; }).length;
    $('#stat-answered').text(answered);
    $('#stat-remaining').text(QUESTIONS.length - answered);
    $('#stat-review').text(reviewCount);
    $('#stat-total').text(QUESTIONS.length);
  }

  function renderNavigator() {
    var html = '';
    QUESTIONS.forEach(function (_, i) {
      html += '<button class="q-nav-btn ' + getQuestionStatus(i) + '" data-index="' + i + '">' + (i + 1) + '</button>';
    });
    $('#question-grid').html(html);
    updateStats();
  }

  function renderQuestion() {
    var q = QUESTIONS[state.currentIndex];
    var idx = state.currentIndex;
    $('#q-number').text('Question ' + (idx + 1) + ' of ' + QUESTIONS.length);
    $('#q-text').text(q.text);
    $('#q-category').text(q.category);
    $('#q-difficulty').text(q.difficulty).attr('class', 'badge badge-' + q.difficulty.toLowerCase());

    var html = '';
    q.options.forEach(function (opt, oi) {
      var selected = false;
      if (q.type === 'multi') {
        selected = state.answers[idx] && state.answers[idx].indexOf(oi) >= 0;
      } else {
        selected = state.answers[idx] === oi;
      }
      html += '<div class="option-card' + (q.type === 'multi' ? ' multi' : '') +
        (selected ? ' selected' : '') + '" data-option="' + oi + '">' +
        '<div class="option-indicator"></div><span>' + opt + '</span></div>';
    });
    $('#options-list').html(html);
    $('#btn-prev').prop('disabled', idx === 0);
    renderNavigator();
  }

  function saveCurrentAnswer() {
    var selected = [];
    $('#options-list .option-card.selected').each(function () {
      selected.push(parseInt($(this).data('option'), 10));
    });
    if (selected.length) {
      var q = QUESTIONS[state.currentIndex];
      state.answers[state.currentIndex] = q.type === 'multi' ? selected : selected[0];
    }
  }

  function submitAssessment(auto) {
    saveCurrentAnswer();
    AetramSession.set('assessment_submitted', { answers: state.answers, auto: !!auto });
    AetramLoader.show();
    setTimeout(function () {
      AetramLoader.hide();
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
      window.location.href = 'feedback.html';
    }, 1200);
  }

  return {
    initInstructions: function () {
      AetramSession.set('assessment_started', false);
      $('#preview-time').text(formatTime(state.timerSeconds));

      $('#terms-agree').on('click keypress', function (e) {
        if (e.type === 'keypress' && e.which !== 13 && e.which !== 32) return;
        $(this).toggleClass('checked');
        var checked = $(this).hasClass('checked');
        $(this).attr('aria-checked', checked);
        $('#start-test-btn').prop('disabled', !checked);
      });

      $('#start-test-btn').on('click', function () {
        if ($(this).prop('disabled')) return;
        AetramLoader.show();
        AetramSession.set('assessment_started', true);
        setTimeout(function () {
          window.location.href = 'candidate-test.html';
        }, 600);
      });

      initProctoring();
    },

    initTest: function () {
      if (!AetramSession.get('assessment_started')) {
        window.location.href = 'candidate-instructions.html';
        return;
      }

      initProctoring();
      requestFullscreen();

      renderQuestion();
      renderNavigator();

      startTimer($('#timer-display'), $('#live-timer'));

      state.autosaveInterval = setInterval(autoSave, 20000);

      $('#rough-workspace').on('input', function () {
        clearTimeout(window._wsTimer);
        window._wsTimer = setTimeout(autoSave, 2000);
      });

      $(document).on('click', '.option-card', function () {
        var q = QUESTIONS[state.currentIndex];
        if (q.type === 'multi') {
          $(this).toggleClass('selected');
        } else {
          $(this).siblings().removeClass('selected');
          $(this).addClass('selected');
        }
      });

      $('#btn-save-next').on('click', function () {
        saveCurrentAnswer();
        autoSave();
        if (state.currentIndex < QUESTIONS.length - 1) {
          state.currentIndex++;
          renderQuestion();
        } else {
          AetramToast.info('Last question reached');
        }
      });

      $('#btn-prev').on('click', function () {
        saveCurrentAnswer();
        if (state.currentIndex > 0) {
          state.currentIndex--;
          renderQuestion();
        }
      });

      $('#btn-review').on('click', function () {
        state.review[state.currentIndex] = true;
        AetramToast.info('Marked for review');
        renderNavigator();
      });

      $('#btn-clear').on('click', function () {
        delete state.answers[state.currentIndex];
        delete state.review[state.currentIndex];
        $('#options-list .option-card').removeClass('selected');
        renderNavigator();
      });

      $(document).on('click', '.q-nav-btn', function () {
        saveCurrentAnswer();
        state.currentIndex = parseInt($(this).data('index'), 10);
        renderQuestion();
      });

      $('#submit-assessment-btn').on('click', function () {
        $('#submit-modal').addClass('active');
      });
      $('#confirm-submit').on('click', function () {
        $('#submit-modal').removeClass('active');
        submitAssessment(false);
      });
      $('[data-close]').on('click', function () {
        $('#' + $(this).data('close')).removeClass('active');
      });

      $('#nav-drawer-toggle').on('click', function () {
        $('#test-sidebar').toggleClass('open');
      });
    },

    initFeedback: function () {
      var rating = 0;

      $('.star-btn').on('click mouseenter', function (e) {
        var r = parseInt($(this).data('rating'), 10);
        if (e.type === 'click') rating = r;
        $('.star-btn').each(function () {
          $(this).toggleClass('active', parseInt($(this).data('rating'), 10) <= r);
        });
      });

      $('#feedback-text').on('input', function () {
        $('#fb-count').text($(this).val().length);
      });

      $('#submit-feedback').on('click', function () {
        if (!rating) {
          AetramToast.warning('Please select a star rating');
          return;
        }
        AetramLoader.show();
        /* AetramAPI.request('/feedback', 'POST', { rating, feedback, suggestions }); */
        setTimeout(function () {
          AetramLoader.hide();
          $('#feedback-form-panel').hide();
          $('#feedback-success').addClass('active');
          var c = 5;
          var iv = setInterval(function () {
            c--;
            $('#redirect-count').text(c);
            if (c <= 0) {
              clearInterval(iv);
              AetramSession.clear();
              window.location.href = 'index.html';
            }
          }, 1000);
        }, 1000);
      });

      if (new URLSearchParams(window.location.search).get('terminated')) {
        AetramToast.error('Assessment was terminated due to policy violation');
      }
    }
  };

})(jQuery);
