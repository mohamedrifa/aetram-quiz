/**
 * AETRAM GROUP — Admin Dashboard
 * Tables, filters, pagination, modals, CRUD placeholders
 */

(function ($) {
  'use strict';

  var data = { creators: [], candidates: [], assessments: [] };
  var state = {
    creators: { page: 1, perPage: 10, sortKey: 'name', sortDir: 'asc', filters: {} },
    candidates: { page: 1, perPage: 10, sortKey: 'name', sortDir: 'asc', filters: {} },
    assessments: { page: 1, perPage: 10, sortKey: 'title', sortDir: 'asc', filters: {} }
  };
  var deleteTarget = null;

  /* ---------- Auth Guard ---------- */
  function checkAuth() {
    var user = AetramSession.get('user');
    if (!user || user.role !== 'admin') {
      /* Allow demo access without login for development */
      if (!window.location.search.includes('demo')) {
        /* Uncomment for strict auth:
        window.location.href = 'index.html';
        return false;
        */
      }
    }
    return true;
  }

  /* ---------- Load Data ---------- */
  function loadData() {
    return $.getJSON('data/sample-data.json').then(function (json) {
      data.creators = json.creators || [];
      data.candidates = json.candidates || [];
      data.assessments = json.assessments || [];
    }).fail(function () {
      /* Fallback inline data if file not served */
      data.creators = [
        { id: 1, name: 'Dr. Sarah Mitchell', email: 'sarah.m@aetram.com', mobile: '+91 98765 43210', company: 'Aetram Tech', specialization: 'Full Stack', designation: 'Senior Creator', experience: '8 years', status: true },
        { id: 2, name: 'James Chen', email: 'james.chen@aetram.com', mobile: '+91 87654 32109', company: 'Aetram Finance', specialization: 'Data Science', designation: 'Lead Creator', experience: '10 years', status: true }
      ];
      data.candidates = [
        { id: 1, name: 'Arjun Mehta', email: 'arjun.m@email.com', mobile: '+91 99887 76655', domain: 'Technology', assessment: 'UI Developer Aptitude', status: true }
      ];
      data.assessments = [
        { id: 1, title: 'UI Developer Aptitude', category: 'Technical', type: 'Quiz', questions: 25, duration: '45 min', status: true }
      ];
    });
  }

  /* ---------- Filter & Sort ---------- */
  function filterSort(list, tableKey) {
    var s = state[tableKey];
    var result = list.slice();

    Object.keys(s.filters).forEach(function (key) {
      var val = s.filters[key];
      if (!val) return;
      result = result.filter(function (row) {
        if (key === 'status') {
          var active = val === 'active';
          return row.status === active;
        }
        if (key === 'experience') {
          var yrs = parseInt(String(row.experience), 10);
          return yrs >= parseInt(val, 10);
        }
        var field = row[key] || row.name || row.title || '';
        return String(field).toLowerCase().indexOf(val.toLowerCase()) >= 0;
      });
    });

    result.sort(function (a, b) {
      var av = (a[s.sortKey] || '').toString().toLowerCase();
      var bv = (b[s.sortKey] || '').toString().toLowerCase();
      if (typeof a[s.sortKey] === 'number') {
        av = a[s.sortKey]; bv = b[s.sortKey];
      }
      if (av < bv) return s.sortDir === 'asc' ? -1 : 1;
      if (av > bv) return s.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }

  function paginate(list, tableKey) {
    var s = state[tableKey];
    var start = (s.page - 1) * s.perPage;
    return { rows: list.slice(start, start + s.perPage), total: list.length, start: start + 1, end: Math.min(start + s.perPage, list.length) };
  }

  /* ---------- Render Helpers ---------- */
  function statusToggle(id, tableKey, checked) {
    return '<label class="toggle-switch" title="Toggle status">' +
      '<input type="checkbox" class="status-toggle-input" data-id="' + id + '" data-table="' + tableKey + '"' + (checked ? ' checked' : '') + '>' +
      '<span class="toggle-slider"></span></label>';
  }

  function actionBtns(id, tableKey) {
    return '<div class="action-btns">' +
      '<button class="action-btn view" data-action="view" data-id="' + id + '" data-table="' + tableKey + '" data-tooltip="View">👁</button>' +
      '<button class="action-btn edit" data-action="edit" data-id="' + id + '" data-table="' + tableKey + '" data-tooltip="Edit">✎</button>' +
      '<button class="action-btn delete" data-action="delete" data-id="' + id + '" data-table="' + tableKey + '" data-tooltip="Delete">🗑</button>' +
      '</div>';
  }

  function renderPagination($bar, tableKey, total) {
    var s = state[tableKey];
    var pages = Math.ceil(total / s.perPage) || 1;
    var paginated = paginate(filterSort(data[tableKey], tableKey), tableKey);
    var html = '<span class="pagination-info">Showing ' + (total ? paginated.start : 0) + '–' + paginated.end + ' of ' + total + ' records</span>';
    html += '<div class="pagination-controls">';
    html += '<button class="page-btn" data-page="prev" data-table="' + tableKey + '"' + (s.page <= 1 ? ' disabled' : '') + '>‹ Prev</button>';
    for (var p = 1; p <= Math.min(pages, 5); p++) {
      html += '<button class="page-btn' + (p === s.page ? ' active' : '') + '" data-page="' + p + '" data-table="' + tableKey + '">' + p + '</button>';
    }
    if (pages > 5) html += '<span class="text-muted">...</span>';
    html += '<button class="page-btn" data-page="next" data-table="' + tableKey + '"' + (s.page >= pages ? ' disabled' : '') + '>Next ›</button>';
    html += '<select class="per-page-select" data-table="' + tableKey + '">';
    [5, 10, 25, 50].forEach(function (n) {
      html += '<option value="' + n + '"' + (s.perPage === n ? ' selected' : '') + '>' + n + ' / page</option>';
    });
    html += '</select></div>';
    $bar.html(html);
  }

  /* ---------- Table Renders ---------- */
  function renderCreators() {
    var filtered = filterSort(data.creators, 'creators');
    var p = paginate(filtered, 'creators');
    var html = '';
    p.rows.forEach(function (r) {
      html += '<tr data-id="' + r.id + '">' +
        '<td>' + r.name + '</td><td>' + r.email + '</td><td>' + r.mobile + '</td>' +
        '<td>' + r.company + '</td><td>' + r.specialization + '</td><td>' + r.designation + '</td>' +
        '<td>' + r.experience + '</td><td>' + 
        // statusToggle(r.id, 'creators', r.status) + '</td><td>' + 
        actionBtns(r.id, 'creators') + '</td></tr>';
    });
    $('#creators-tbody').html(html || '<tr><td colspan="9" style="text-align:center;padding:40px">No records found</td></tr>');
    renderPagination($('[data-table="creators"].pagination-bar'), 'creators', filtered.length);
  }

  function renderCandidates() {
    var filtered = filterSort(data.candidates, 'candidates');
    var p = paginate(filtered, 'candidates');
    var html = '';
    p.rows.forEach(function (r) {
      html += '<tr data-id="' + r.id + '">' +
        '<td>' + r.name + '</td><td>' + r.email + '</td><td>' + r.mobile + '</td>' +
        '<td>' + r.domain + '</td><td>' + r.assessment + '</td><td>' + 
        // statusToggle(r.id, 'candidates', r.status) + '</td><td>' + 
        actionBtns(r.id, 'candidates') + '</td></tr>';
    });
    $('#candidates-tbody').html(html || '<tr><td colspan="7" style="text-align:center;padding:40px">No records found</td></tr>');
    renderPagination($('[data-table="candidates"].pagination-bar'), 'candidates', filtered.length);
  }

  function renderAssessments() {
    var filtered = filterSort(data.assessments, 'assessments');
    var p = paginate(filtered, 'assessments');
    var html = '';
    p.rows.forEach(function (r) {
      html += '<tr data-id="' + r.id + '">' +
        '<td>' + r.title + '</td><td>' + r.category + '</td><td>' + r.type + '</td>' +
        '<td>' + r.questions + '</td><td>' + r.duration + '</td><td>' + 
        // statusToggle(r.id, 'assessments', r.status) + '</td><td>' + 
        actionBtns(r.id, 'assessments') + '</td></tr>';
    });
    $('#assessments-tbody').html(html || '<tr><td colspan="7" style="text-align:center;padding:40px">No records found</td></tr>');
    renderPagination($('[data-table="assessments"].pagination-bar'), 'assessments', filtered.length);
  }

  function renderAll() {
    renderCreators();
    renderCandidates();
    renderAssessments();
  }

  /* ---------- Modals ---------- */
  function openModal(id) { $('#' + id).addClass('active'); }
  function closeModal(id) { $('#' + id).removeClass('active'); }

  function findRecord(tableKey, id) {
    return data[tableKey].find(function (r) { return r.id === parseInt(id, 10); });
  }

  /* ---------- Module Switch ---------- */
  function switchModule(module) {
    if (module === 'analytics') {
      window.location.href = 'analytics-dashboard.html';
      return;
    }
    if (module === 'reports') {
      window.location.href = 'reports.html';
      return;
    }
    $('.sidebar-link').removeClass('active').filter('[data-module="' + module + '"]').addClass('active');
    $('.module-panel').removeClass('active');
    $('#module-' + module).addClass('active');
    $('#sidebar-overlay, #admin-sidebar').removeClass('active open');
  }

  /* ---------- Init ---------- */
  $(document).ready(function () {
    checkAuth();
    AetramLoader.show();

    loadData().always(function () {
      AetramLoader.hide();
      renderAll();
    });

    /* Sidebar */
    $('.sidebar-link').on('click', function () {
      var mod = $(this).data('module');
      if ($(this).data('href')) {
        window.location.href = $(this).data('href');
        return;
      }
      switchModule(mod);
    });
    $('#sidebar-toggle').on('click', function () {
      $('#admin-sidebar').toggleClass('open');
      $('#sidebar-overlay').toggleClass('active');
    });
    $('#sidebar-overlay').on('click', function () {
      $('#admin-sidebar').removeClass('open');
      $(this).removeClass('active');
    });

    /* Logout */
    $('#logout-btn').on('click', function () {
      AetramSession.clear();
      window.location.href = '../../index.html';
    });

    /* Filters */
    $('.filter-bar').on('input change', '.filter-input, .filter-select', function () {
      var $bar = $(this).closest('.filter-bar');
      var tableKey = $bar.closest('.module-panel').attr('id').replace('module-', '');
      if (tableKey === 'creators') tableKey = 'creators';
      if (tableKey === 'candidates') tableKey = 'candidates';
      if (tableKey === 'assessments') tableKey = 'assessments';
      var key = $(this).data('filter');
      state[tableKey].filters[key] = $(this).val();
      state[tableKey].page = 1;
      if (tableKey === 'creators') renderCreators();
      else if (tableKey === 'candidates') renderCandidates();
      else renderAssessments();
    });

    /* Sort buttons */
    $('.sort-controls').on('click', '.sort-btn', function () {
      var $panel = $(this).closest('.module-panel');
      var tableKey = $panel.attr('id').replace('module-', '');
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      state[tableKey].sortKey = $(this).data('sort');
      state[tableKey].sortDir = $(this).data('dir');
      if (tableKey === 'creators') renderCreators();
      else if (tableKey === 'candidates') renderCandidates();
      else renderAssessments();
    });

    /* Table header sort */
    $('.data-table th[data-sort]').on('click', function () {
      var table = $(this).closest('table').attr('id');
      var tableKey = table.replace('-table', '').replace('s', '') + 's';
      if (table === 'creators-table') tableKey = 'creators';
      if (table === 'candidates-table') tableKey = 'candidates';
      if (table === 'assessments-table') tableKey = 'assessments';
      var key = $(this).data('sort');
      if (state[tableKey].sortKey === key) {
        state[tableKey].sortDir = state[tableKey].sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state[tableKey].sortKey = key;
        state[tableKey].sortDir = 'asc';
      }
      $(this).addClass('sorted').siblings().removeClass('sorted');
      if (tableKey === 'creators') renderCreators();
      else if (tableKey === 'candidates') renderCandidates();
      else renderAssessments();
    });

    /* Pagination */
    $(document).on('click', '.page-btn', function () {
      var tableKey = $(this).data('table');
      var page = $(this).data('page');
      var total = filterSort(data[tableKey], tableKey).length;
      var pages = Math.ceil(total / state[tableKey].perPage) || 1;
      if (page === 'prev') state[tableKey].page = Math.max(1, state[tableKey].page - 1);
      else if (page === 'next') state[tableKey].page = Math.min(pages, state[tableKey].page + 1);
      else state[tableKey].page = parseInt(page, 10);
      if (tableKey === 'creators') renderCreators();
      else if (tableKey === 'candidates') renderCandidates();
      else renderAssessments();
    });
    $(document).on('change', '.per-page-select', function () {
      var tableKey = $(this).data('table');
      state[tableKey].perPage = parseInt($(this).val(), 10);
      state[tableKey].page = 1;
      if (tableKey === 'creators') renderCreators();
      else if (tableKey === 'candidates') renderCandidates();
      else renderAssessments();
    });

    /* Status toggle */
    $(document).on('change', '.status-toggle-input', function () {
      var id = $(this).data('id');
      var tableKey = $(this).data('table');
      var row = findRecord(tableKey, id);
      if (row) {
        row.status = $(this).is(':checked');
        AetramToast.success('Status updated');
        /* AetramAPI.request('/' + tableKey + '/' + id + '/status', 'PATCH', { status: row.status }); */
      }
    });

    /* Actions */
    $(document).on('click', '[data-action]', function () {
      var action = $(this).data('action');
      var id = $(this).data('id');
      var tableKey = $(this).data('table');
      var row = findRecord(tableKey, id);
      if (!row) return;

      if (action === 'view') {
        var content = '<dl style="line-height:2">';
        Object.keys(row).forEach(function (k) {
          if (k !== 'id') content += '<dt style="color:var(--gold-primary);display:inline">' + k + ':</dt> <dd style="display:inline;margin-right:16px">' + row[k] + '</dd><br>';
        });
        content += '</dl>';
        $('#view-modal-content').html(content);
        openModal('view-modal');
      } else if (action === 'delete') {
        deleteTarget = { tableKey: tableKey, id: id };
        openModal('delete-modal');
      } else if (action === 'edit') {
        AetramToast.info('Edit mode — populate form via API');
        if (tableKey === 'creators') {
          $('#cr-name').val(row.name); $('#cr-email').val(row.email);
          openModal('creator-modal');
        } else if (tableKey === 'candidates') {
          $('#ca-name').val(row.name); openModal('candidate-modal');
        }
      }
    });

    $('#confirm-delete').on('click', function () {
      if (!deleteTarget) return;
      data[deleteTarget.tableKey] = data[deleteTarget.tableKey].filter(function (r) {
        return r.id !== parseInt(deleteTarget.id, 10);
      });
      closeModal('delete-modal');
      AetramToast.success('Record deleted');
      renderAll();
      deleteTarget = null;
    });

    /* Modals */
    $('#add-creator-btn').on('click', function () {
      $('#creator-form')[0].reset();
      $('#creator-modal-title').text('Add Creator');
      openModal('creator-modal');
    });
    $('#add-candidate-btn').on('click', function () {
      $('#candidate-form')[0].reset();
      openModal('candidate-modal');
    });
    $('[data-close]').on('click', function () {
      closeModal($(this).data('close'));
    });
    $('.modal-overlay').on('click', function (e) {
      if (e.target === this) closeModal($(this).attr('id'));
    });

    $('#creator-form').on('submit', function (e) {
      e.preventDefault();
      var newId = Math.max.apply(null, data.creators.map(function (r) { return r.id; }).concat([0])) + 1;
      data.creators.push({
        id: newId,
        name: $('#cr-name').val(),
        email: $('#cr-email').val(),
        mobile: $('#cr-mobile').val(),
        company: $('#cr-company').val(),
        specialization: $('#cr-spec').val(),
        designation: $('#cr-designation').val(),
        experience: $('#cr-exp').val(),
        status: $('#cr-status').is(':checked')
      });
      closeModal('creator-modal');
      AetramToast.success('Creator added successfully');
      renderCreators();
    });

    $('#candidate-form').on('submit', function (e) {
      e.preventDefault();
      var newId = Math.max.apply(null, data.candidates.map(function (r) { return r.id; }).concat([0])) + 1;
      data.candidates.push({
        id: newId,
        name: $('#ca-name').val(),
        email: $('#ca-email').val(),
        mobile: $('#ca-mobile').val(),
        domain: $('#ca-domain').val(),
        assessment: $('#ca-assessment').val(),
        status: $('#ca-status').is(':checked')
      });
      closeModal('candidate-modal');
      AetramToast.success('Candidate added successfully');
      renderCandidates();
    });
  });

})(jQuery);
