/**
 * AETRAM GROUP — Assessment Builder
 * Multi-step wizard, question builder, import, publish
 */

(function ($) {
  'use strict';

  var currentStep = 1;
  var totalSteps = 7;
  var questionCount = 1;
  var totalQ = 25;
  var currentQType = 'mcq';
  var savedQuestions = [];
  var importQuestions = [];

  var SETTINGS = [
    { id: 'proctoring', label: 'Enable AI Proctoring', desc: 'Monitor candidate behavior' },
    { id: 'randomize_q', label: 'Randomize Questions', desc: 'Shuffle question order' },
    { id: 'randomize_o', label: 'Randomize Options', desc: 'Shuffle answer options' },
    { id: 'copypaste', label: 'Detect Copy-Paste', desc: 'Block clipboard actions' },
    { id: 'screen', label: 'Screen Switch Detection', desc: 'Detect window changes' },
    { id: 'tab', label: 'Prevent Tab Switching', desc: 'Block browser tab changes' },
    { id: 'autosubmit', label: 'Auto Submit on Timeout', desc: 'Submit when timer ends' },
    { id: 'fullscreen', label: 'Fullscreen Enforcement', desc: 'Require fullscreen mode' },
    { id: 'activity', label: 'Browser Activity Monitoring', desc: 'Track browser events' }
  ];

  var SAMPLE_IMPORT = [
    { q: 'What is REST API?', cat: 'Technical', diff: 'Easy', type: 'MCQ', status: 'Active' },
    { q: 'Explain polymorphism in OOP', cat: 'Technical', diff: 'Medium', type: 'Long', status: 'Active' },
    { q: 'Rate your teamwork skills', cat: 'HR', diff: 'Easy', type: 'Rating', status: 'Active' },
    { q: 'If A>B and B>C, then A>C?', cat: 'Logical', diff: 'Easy', type: 'True/False', status: 'Active' },
    { q: 'Describe a leadership challenge', cat: 'Behavioral', diff: 'Hard', type: 'Survey', status: 'Draft' }
  ];

  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    if (step === 5 && !validateDistribution()) return;

    currentStep = step;
    $('.step-item').removeClass('active').each(function () {
      var s = parseInt($(this).data('step'), 10);
      $(this).toggleClass('completed', s < step);
      if (s === step) $(this).addClass('active');
    });
    $('.step-panel').removeClass('active').filter('[data-step="' + step + '"]').addClass('active');
    $('#step-prev').prop('disabled', step === 1);
    $('#step-next').text(step === totalSteps ? 'Finish' : 'Continue →').toggle(step < totalSteps);
    if (step === 7) renderPublishSummary();
    if (step === 6) updatePreview();
  }

  function validateDistribution() {
    var e = parseInt($('#easy-range').val(), 10);
    var m = parseInt($('#medium-range').val(), 10);
    var h = parseInt($('#hard-range').val(), 10);
    var total = e + m + h;
    var $el = $('#dist-total');
    $el.text('Total: ' + total + '%' + (total === 100 ? ' ✓' : ' — must equal 100%'));
    $el.toggleClass('valid', total === 100).toggleClass('invalid', total !== 100);
    $('#step-next').prop('disabled', total !== 100);
    if (total !== 100) {
      AetramToast.warning('Question distribution must total exactly 100%.');
      return false;
    }
    return true;
  }

  function renderSettings() {
    var html = '';
    SETTINGS.forEach(function (s, i) {
      html += '<div class="setting-card"><div><h4>' + s.label + '</h4><p>' + s.desc + '</p></div>' +
        '<label class="toggle-switch"><input type="checkbox"' + (i < 6 ? ' checked' : '') + '><span class="toggle-slider"></span></label></div>';
    });
    $('#settings-grid').html(html);
  }

  function renderOptions(type) {
    var $c = $('#options-container');
    $c.empty();
    if (type === 'truefalse') {
      $c.html('<div class="option-row"><button type="button" class="correct-select selected" data-opt="0"></button><input class="form-input" value="True" readonly></div>' +
        '<div class="option-row"><button type="button" class="correct-select" data-opt="1"></button><input class="form-input" value="False" readonly></div>');
    } else if (type === 'short' || type === 'long' || type === 'survey' || type === 'rating') {
      $c.html('<p class="text-muted">Answer preview: candidate will provide ' + (type === 'long' ? 'extended' : 'brief') + ' text response.</p>');
    } else {
      for (var i = 0; i < 4; i++) {
        $c.append('<div class="option-row"><button type="button" class="correct-select' + (i === 0 ? ' selected' : '') + '" data-opt="' + i + '"></button>' +
          '<input class="form-input option-input" placeholder="Option ' + String.fromCharCode(65 + i) + '"></div>');
      }
      $c.append('<button type="button" class="btn btn-ghost btn-sm" id="add-option" style="margin-top:8px">+ Add Option</button>');
    }
  }

  function updateQuestionProgress() {
    var pct = Math.round((questionCount / totalQ) * 100);
    $('#q-progress').css('width', pct + '%');
    $('#q-counter').html('Question ' + questionCount + ' of ' + totalQ + ' — <span id="q-pct">' + pct + '</span>% complete');
  }

  function renderAssignCandidates() {
    var rows = [
      { name: 'Arjun Mehta', email: 'arjun.m@email.com', mobile: '+91 99887 76655', status: 'Active' },
      { name: 'Sneha Reddy', email: 'sneha.r@email.com', mobile: '+91 88776 65544', status: 'Active' },
      { name: 'Vikram Singh', email: 'vikram.s@email.com', mobile: '+91 77665 54433', status: 'Inactive' }
    ];
    var html = '';
    rows.forEach(function (r, i) {
      html += '<tr><td><input type="checkbox" class="candidate-cb" value="' + i + '"></td><td>' + r.name + '</td><td>' + r.email + '</td><td>' + r.mobile + '</td><td>' + r.status + '</td></tr>';
    });
    $('#assign-candidates-tbody').html(html);
  }

  function renderImportPreview() {
    var html = '';
    importQuestions = SAMPLE_IMPORT.slice();
    importQuestions.forEach(function (q, i) {
      html += '<tr><td><input type="checkbox" class="import-cb" data-i="' + i + '"></td><td>' + q.q + '</td><td>' + q.cat + '</td><td>' + q.diff + '</td><td>' + q.type + '</td><td>' + q.status + '</td></tr>';
    });
    $('#import-preview-tbody').html(html);
    $('#import-total').text(importQuestions.length);
    $('#import-easy').text(importQuestions.filter(function (q) { return q.diff === 'Easy'; }).length);
    $('#import-hard').text(importQuestions.filter(function (q) { return q.diff === 'Hard'; }).length);
  }

  function updatePreview() {
    $('#preview-title').text($('#test-title').val() || 'Assessment Preview');
    $('#preview-meta').text(
      ($('#duration').val() || '45') + ' min • ' +
      ($('#total-questions').val() || '25') + ' Questions • ' +
      ($('#assess-type').val() || 'Quiz')
    );
  }

  function renderPublishSummary() {
    var html = '';
    var items = [
      { label: 'Total Questions', val: $('#total-questions').val() || '25' },
      { label: 'Duration', val: ($('#duration').val() || '45') + ' min' },
      { label: 'Candidates', val: $('.candidate-cb:checked').length || '0' },
      { label: 'Pass %', val: ($('#pass-pct').val() || '60') + '%' },
      { label: 'Proctoring', val: 'Enabled' },
      { label: 'Type', val: $('#assess-type').val() || 'Quiz' }
    ];
    items.forEach(function (it) {
      html += '<div class="mini-card glass-card"><div class="val" style="font-size:1.2rem">' + it.val + '</div><div class="lbl">' + it.label + '</div></div>';
    });
    $('#publish-summary').html(html);
  }

  function publishAssessment() {
    var id = 'AET-2026-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    $('#assessment-id').text('ID: ' + id);
    $('#publish-success').addClass('active');
    $('.step-nav-footer, #publish-summary').hide();
    AetramToast.success('Assessment published successfully');
    AetramSession.set('last_assessment', { id: id, title: $('#test-title').val() });
  }

  $(document).ready(function () {
    renderSettings();
    renderOptions('mcq');
    renderAssignCandidates();
    renderImportPreview();
    totalQ = parseInt($('#total-questions').val(), 10) || 25;

    $('#total-questions').on('change', function () {
      totalQ = parseInt($(this).val(), 10) || 25;
      updateQuestionProgress();
    });

    /* Stepper clicks */
    $('.step-item').on('click', function () {
      var s = parseInt($(this).data('step'), 10);
      if (s <= currentStep + 1) goToStep(s);
    });
    $('#step-next').on('click', function () {
      if (currentStep === 5 && !validateDistribution()) return;
      goToStep(currentStep + 1);
    });
    $('#step-prev').on('click', function () { goToStep(currentStep - 1); });

    /* Q type */
    $('.qtype-card').on('click', function () {
      $('.qtype-card').removeClass('active');
      $(this).addClass('active');
      currentQType = $(this).data('type');
      renderOptions(currentQType);
    });

    $(document).on('click', '.correct-select', function () {
      if (currentQType === 'mcq') {
        $(this).toggleClass('selected');
      } else {
        $(this).siblings('.correct-select').removeClass('selected');
        $(this).addClass('selected');
      }
    });

    $('#add-option').on('click', function () {
      var n = $('#options-container .option-row').length;
      $('#options-container').find('#add-option').before(
        '<div class="option-row"><button type="button" class="correct-select" data-opt="' + n + '"></button>' +
        '<input class="form-input option-input" placeholder="Option ' + String.fromCharCode(65 + n) + '"></div>'
      );
    });

    $('#save-question, #save-add-next').on('click', function () {
      savedQuestions.push({ title: $('#q-title-input').val(), type: currentQType });
      AetramToast.success('Question saved');
      if ($(this).attr('id') === 'save-add-next') {
        questionCount = Math.min(questionCount + 1, totalQ);
        $('#q-title-input, #q-desc').val('');
        updateQuestionProgress();
      }
    });

    $('#reset-question').on('click', function () {
      $('#q-title-input, #q-desc').val('');
      renderOptions(currentQType);
    });

    /* Distribution sliders */
    $('#easy-range, #medium-range, #hard-range').on('input', function () {
      $('#easy-val').text($('#easy-range').val());
      $('#medium-val').text($('#medium-range').val());
      $('#hard-val').text($('#hard-range').val());
      validateDistribution();
    });

    /* Bank selection */
    $('.bank-card').on('click', function () {
      $('.bank-card').removeClass('active');
      $(this).addClass('active');
    });

    /* CSV upload */
    $('#csv-upload').on('click', function () { $('#csv-file').click(); });
    $('#csv-file').on('change', function () {
      if (this.files.length) {
        AetramLoader.show();
        setTimeout(function () {
          AetramLoader.hide();
          importQuestions = importQuestions.concat(SAMPLE_IMPORT);
          renderImportPreview();
          AetramToast.success('Question bank parsed successfully');
        }, 1500);
      }
    });

    /* Assignment modes */
    $('.assign-mode').on('click', function () {
      $('.assign-mode').removeClass('active btn-gold').addClass('btn-outline');
      $(this).addClass('active btn-gold').removeClass('btn-outline');
      var mode = $(this).data('mode');
      $('#assign-individual').toggleClass('hidden', mode !== 'individual');
      $('#assign-group').toggleClass('hidden', mode !== 'group');
    });

    $('#select-all-candidates').on('change', function () {
      $('.candidate-cb').prop('checked', $(this).is(':checked'));
    });

    $('#send-invite').on('click', function () {
      var n = $('.candidate-cb:checked').length;
      if (!n) { AetramToast.warning('Select at least one candidate'); return; }
      AetramToast.success('Assessment invitation sent successfully to ' + n + ' candidate(s)');
    });

    $('#team-select').on('change', function () {
      var selected = $(this).val() || [];
      $('#group-preview').html('<strong>Group Preview:</strong> ' + (selected.length ? selected.join(', ') : 'No teams selected'));
    });

    /* Preview modes */
    $('.preview-mode').on('click', function () {
      $('.preview-mode').removeClass('active btn-gold').addClass('btn-outline');
      $(this).addClass('active btn-gold').removeClass('btn-outline');
      $('#preview-frame').removeClass('desktop tablet mobile').addClass($(this).data('mode'));
    });

    $('#fullscreen-preview').on('click', function () {
      var el = document.getElementById('preview-frame');
      if (el.requestFullscreen) el.requestFullscreen();
    });

    /* Terms counter */
    $('#additional-terms').on('input', function () {
      $('#terms-count').text($(this).val().length);
    });

    /* Publish */
    $('#publish-now, #publish-top').on('click', function () {
      renderPublishSummary();
      $('#publish-modal-summary').html($('#publish-summary').html());
      $('#publish-modal').addClass('active');
    });
    $('#confirm-publish').on('click', function () {
      $('#publish-modal').removeClass('active');
      goToStep(7);
      publishAssessment();
    });
    $('[data-close]').on('click', function () {
      $('#' + $(this).data('close')).removeClass('active');
    });

    $('#save-draft').on('click', function () {
      AetramSession.set('assessment_draft', {
        title: $('#test-title').val(),
        step: currentStep
      });
      AetramToast.success('Draft saved');
    });

    $('#copy-link').on('click', function () {
      var link = window.location.origin + '/candidate-instructions.html?token=demo';
      navigator.clipboard.writeText(link).then(function () {
        AetramToast.success('Assessment link copied');
      }).catch(function () {
        AetramToast.info(link);
      });
    });

    $('#schedule-publish').on('click', function () {
      AetramToast.info('Assessment scheduled — connect scheduling API');
    });

    $('#cancel-publish').on('click', function () {
      window.location.href = 'admin-dashboard.html';
    });

    /* Image upload */
    $('#image-upload').on('click', function () {
      var inp = $('<input type="file" accept="image/*">');
      inp.on('change', function () {
        var file = this.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $('#img-preview').attr('src', e.target.result).removeClass('hidden');
          };
          reader.readAsDataURL(file);
        }
      });
      inp.click();
    });

    updateQuestionProgress();
  });

})(jQuery);
