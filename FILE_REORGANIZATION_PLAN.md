# File Reorganization Plan - Aetram Platform

## Executive Summary

This document provides a step-by-step guide to reorganize misplaced files from the root and incorrect subdirectories into the correct folder structure based on the target architecture.

## Current State Analysis

### Files in Root Directory (Need Reorganization)
```
Root/
├── HTML Files (8 files)
│   ├── index.html                    ✅ Keep in root (main entry)
│   ├── admin-dashboard.html          ✅ Keep in root
│   ├── analytics-dashboard.html      ⚠️  Merge or rename
│   ├── candidate-instructions.html   ⚠️  Rename to candidate-dashboard.html
│   ├── candidate-test.html           ⚠️  Rename to assessment.html
│   ├── create-assessment.html        ⚠️  Merge into assessment.html
│   ├── feedback.html                 ⚠️  Rename to results.html
│   └── reports.html                  ⚠️  Merge into admin-dashboard.html
│
├── Documentation
│   ├── README.md                     ✅ Keep in root
│   └── REFACTORING_COMPLETE_GUIDE.md ✅ Keep in root
│
├── Directories (Already organized)
│   ├── assets/                       ✅ Correct
│   ├── backend/                      ✅ Correct
│   ├── components/                   ✅ Correct
│   ├── css/                          ⚠️  Needs cleanup
│   ├── data/                         ✅ Correct
│   ├── docs/                         ✅ Correct
│   └── js/                           ⚠️  Needs cleanup
│
└── System
    └── .git/                         ✅ Keep
```

### CSS Files Misplaced in css/ Root
```
css/
├── global.css                        ❌ MISPLACED - Split into base/
├── auth.css                          ❌ MISPLACED - Move to pages/
├── admin-dashboard.css               ❌ MISPLACED - Split into layout/ + components/
├── candidate.css                     ❌ MISPLACED - Split into pages/
├── create-assessment.css             ❌ MISPLACED - Merge into pages/
├── analytics.css                     ❌ MISPLACED - Split into components/ + pages/
│
├── base/                             ✅ Correct structure
│   ├── variables.css                 ✅ Keep
│   ├── reset.css                     ✅ Keep
│   ├── typography.css                ✅ Keep
│   ├── animations.css                ✅ Keep
│   └── utilities.css                 ✅ Keep
│
├── layout/                           ✅ Empty - Ready for files
├── components/                       ✅ Empty - Ready for files
└── pages/                            ✅ Empty - Ready for files
```

### JavaScript Files Misplaced in js/ Root
```
js/
├── global.js                         ❌ MISPLACED - Split into core/
├── auth.js                           ❌ MISPLACED - Split into services/ + pages/
├── admin-dashboard.js                ❌ MISPLACED - Move to pages/dashboard/
├── candidate.js                      ❌ MISPLACED - Split into services/ + pages/
├── create-assessment.js              ❌ MISPLACED - Split into pages/assessment/
├── analytics.js                      ❌ MISPLACED - Split into services/ + pages/
├── component_loader.js               ❌ MISPLACED - Move to core/ as router.js
│
├── core/                             ✅ Empty - Ready for files
├── services/                         ✅ Empty - Ready for files
├── components/                       ✅ Empty - Ready for files
└── pages/                            ✅ Structure exists, needs files
    ├── auth/
    ├── dashboard/
    ├── assessment/
    └── analytics/
```

## Step-by-Step Reorganization Plan

### Phase 1: CSS Reorganization

#### Step 1.1: Extract global.css into base/ layer
**Current:** `css/global.css`
**Action:** Split content into existing base files
- Variables → Already in `css/base/variables.css` ✅
- Reset → Already in `css/base/reset.css` ✅
- Typography → Already in `css/base/typography.css` ✅
- Animations → Already in `css/base/animations.css` ✅
- Utilities → Already in `css/base/utilities.css` ✅

**Command:**
```bash
# After verifying content is in base files, delete the original
rm css/global.css
```

#### Step 1.2: Create layout/ CSS files
**Source files to split:**
- `css/admin-dashboard.css` → Extract sidebar, dashboard layout
- `css/global.css` → Extract navbar, footer (already being split)

**Create these files:**
```bash
# Create layout files
touch css/layout/navbar.css
touch css/layout/footer.css
touch css/layout/sidebar.css
touch css/layout/grid.css
touch css/layout/dashboard-layout.css
```

**Content mapping:**
- **navbar.css**: Extract navbar styles from global.css (lines with `.auth-navbar`, `.nav-logo`, etc.)
- **footer.css**: Extract footer styles from global.css and auth.css
- **sidebar.css**: Extract from admin-dashboard.css (`.admin-sidebar`, `.sidebar-nav`, etc.)
- **grid.css**: Extract grid/layout utilities from global.css
- **dashboard-layout.css**: Extract from admin-dashboard.css (`.admin-layout`, `.admin-main`, etc.)

#### Step 1.3: Create components/ CSS files
**Source files to split:**
- `css/global.css` → Buttons, cards, forms, modals, toasts, loaders, glassmorphism
- `css/admin-dashboard.css` → Tables, modals
- `css/analytics.css` → Charts

**Create these files:**
```bash
touch css/components/buttons.css
touch css/components/cards.css
touch css/components/forms.css
touch css/components/modals.css
touch css/components/tables.css
touch css/components/toasts.css
touch css/components/loaders.css
touch css/components/dropdowns.css
touch css/components/tabs.css
touch css/components/charts.css
touch css/components/glassmorphism.css
```

#### Step 1.4: Create pages/ CSS files
**Source files to move/split:**
- `css/auth.css` → Move to `css/pages/auth.css`
- `css/candidate.css` → Split into `css/pages/assessment.css` and `css/pages/results.css`
- `css/create-assessment.css` → Merge into `css/pages/assessment.css`
- `css/analytics.css` → Move page-specific parts to `css/pages/analytics.css`

**Create these files:**
```bash
touch css/pages/auth.css
touch css/pages/dashboard.css
touch css/pages/assessment.css
touch css/pages/results.css
touch css/pages/analytics.css
touch css/pages/profile.css
```

**Action commands:**
```bash
# Move auth.css
mv css/auth.css css/pages/auth.css

# Split candidate.css
# - Copy assessment-related styles to css/pages/assessment.css
# - Copy feedback/results styles to css/pages/results.css
# Then delete original
rm css/candidate.css

# Merge create-assessment.css into assessment.css
cat css/create-assessment.css >> css/pages/assessment.css
rm css/create-assessment.css

# Move analytics page styles
# - Extract page-specific styles to css/pages/analytics.css
# - Keep chart styles in css/components/charts.css
rm css/analytics.css
```

#### Step 1.5: Create main.css
**Create central import file:**
```bash
touch css/main.css
```

**Content:**
```css
/* Base Layer */
@import url('base/variables.css');
@import url('base/reset.css');
@import url('base/typography.css');
@import url('base/animations.css');
@import url('base/utilities.css');

/* Layout Layer */
@import url('layout/navbar.css');
@import url('layout/footer.css');
@import url('layout/sidebar.css');
@import url('layout/grid.css');
@import url('layout/dashboard-layout.css');

/* Components Layer */
@import url('components/glassmorphism.css');
@import url('components/buttons.css');
@import url('components/cards.css');
@import url('components/forms.css');
@import url('components/modals.css');
@import url('components/tables.css');
@import url('components/toasts.css');
@import url('components/loaders.css');
@import url('components/dropdowns.css');
@import url('components/tabs.css');
@import url('components/charts.css');

/* Pages Layer */
@import url('pages/auth.css');
@import url('pages/dashboard.css');
@import url('pages/assessment.css');
@import url('pages/results.css');
@import url('pages/analytics.css');
@import url('pages/profile.css');
```

### Phase 2: JavaScript Reorganization

#### Step 2.1: Create core/ layer
**Source:** `js/global.js` + new utilities

**Create these files:**
```bash
touch js/core/config.js
touch js/core/constants.js
touch js/core/helpers.js
touch js/core/storage.js
touch js/core/router.js
touch js/core/event-bus.js
```

**Action:**
```bash
# Move component_loader.js to router.js
mv js/component_loader.js js/core/router.js
```

#### Step 2.2: Create services/ layer
**Source:** Split functionality from existing files

**Create these files:**
```bash
touch js/services/api.service.js
touch js/services/auth.service.js
touch js/services/assessment.service.js
touch js/services/analytics.service.js
touch js/services/websocket.service.js
```

#### Step 2.3: Create components/ layer
**Source:** Extract from global.js, auth.js, analytics.js

**Create these files:**
```bash
touch js/components/Toast.js
touch js/components/Loader.js
touch js/components/Modal.js
touch js/components/Particles.js
touch js/components/Counters.js
touch js/components/Typing.js
touch js/components/Forms.js
touch js/components/Charts.js
touch js/components/Navbar.js
touch js/components/Sidebar.js
```

#### Step 2.4: Create pages/ layer
**Source:** Split page-specific logic

**Move/split files:**
```bash
# Auth pages
touch js/pages/auth/login.js
touch js/pages/auth/signup.js
touch js/pages/auth/role-toggle.js
touch js/pages/auth/auth-validation.js

# Dashboard pages
mv js/admin-dashboard.js js/pages/dashboard/admin-dashboard.js
touch js/pages/dashboard/dashboard.js
touch js/pages/dashboard/candidate-dashboard.js

# Assessment pages
touch js/pages/assessment/assessment-engine.js
touch js/pages/assessment/timer.js
touch js/pages/assessment/proctoring.js
touch js/pages/assessment/question-renderer.js

# Analytics pages
touch js/pages/analytics/charts.js
touch js/pages/analytics/reports.js
```

#### Step 2.5: Create main.js
**Create central initialization file:**
```bash
touch js/main.js
```

### Phase 3: HTML File Reorganization

#### Step 3.1: Rename HTML files
```bash
# Rename for clarity
mv candidate-instructions.html candidate-dashboard.html
mv candidate-test.html assessment.html
mv feedback.html results.html
```

#### Step 3.2: Merge redundant files
```bash
# Merge analytics-dashboard.html into admin-dashboard.html (or keep separate)
# Merge reports.html into admin-dashboard.html (or keep separate)
# Merge create-assessment.html into assessment.html (or keep separate)
```

**Decision:** Keep separate for now, but update navigation to reflect new names.

#### Step 3.3: Update HTML references
**Update all HTML files to use new CSS:**
```html
<!-- Replace this -->
<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/auth.css">

<!-- With this -->
<link rel="stylesheet" href="css/main.css">
```

**Update all HTML files to use new JS:**
```html
<!-- Replace individual JS files -->
<script src="js/global.js"></script>
<script src="js/auth.js"></script>

<!-- With organized structure -->
<script src="js/core/config.js"></script>
<script src="js/core/constants.js"></script>
<script src="js/core/helpers.js"></script>
<script src="js/core/storage.js"></script>
<script src="js/services/api.service.js"></script>
<script src="js/services/auth.service.js"></script>
<script src="js/components/Toast.js"></script>
<script src="js/components/Loader.js"></script>
<!-- ... page-specific scripts -->
<script src="js/main.js"></script>
```

### Phase 4: Cleanup

#### Step 4.1: Delete original flat files
```bash
# CSS files (after splitting)
rm css/global.css
rm css/auth.css              # Already moved
rm css/admin-dashboard.css   # After splitting
rm css/candidate.css         # After splitting
rm css/create-assessment.css # After merging
rm css/analytics.css         # After splitting

# JS files (after splitting)
rm js/global.js              # After splitting
rm js/auth.js                # After splitting
rm js/admin-dashboard.js     # Already moved
rm js/candidate.js           # After splitting
rm js/create-assessment.js   # After splitting
rm js/analytics.js           # After splitting
rm js/component_loader.js    # Already moved
```

#### Step 4.2: Update asset paths in HTML
```html
<!-- Replace -->
<img src="./assets/aetram_logo_full.png" alt="Logo">

<!-- With -->
<img src="./assets/images/logos/aetram_logo_full.png" alt="Logo">
```

## Execution Priority

### High Priority (Do First)
1. ✅ Create all empty directories (DONE)
2. ✅ Create CSS base files (DONE)
3. Create CSS layout files
4. Create CSS components files
5. Create CSS pages files
6. Create css/main.css
7. Update HTML files to use main.css

### Medium Priority (Do Second)
8. Create JS core files
9. Create JS services files
10. Create JS components files
11. Create JS pages files
12. Create js/main.js
13. Update HTML files to use new JS structure

### Low Priority (Do Last)
14. Delete original flat CSS files
15. Delete original flat JS files
16. Update all asset paths
17. Test all pages
18. Final cleanup

## File Movement Commands (Copy-Paste Ready)

### CSS Reorganization
```bash
# Create layout files
touch css/layout/{navbar,footer,sidebar,grid,dashboard-layout}.css

# Create component files
touch css/components/{buttons,cards,forms,modals,tables,toasts,loaders,dropdowns,tabs,charts,glassmorphism}.css

# Create page files
touch css/pages/{auth,dashboard,assessment,results,analytics,profile}.css

# Create main.css
touch css/main.css

# Move files that can be directly moved
mv css/auth.css css/pages/auth.css
```

### JavaScript Reorganization
```bash
# Create core files
touch js/core/{config,constants,helpers,storage,router,event-bus}.js

# Create service files
touch js/services/{api,auth,assessment,analytics,websocket}.service.js

# Create component files
touch js/components/{Toast,Loader,Modal,Particles,Counters,Typing,Forms,Charts,Navbar,Sidebar}.js

# Create page files
touch js/pages/auth/{login,signup,role-toggle,auth-validation}.js
touch js/pages/dashboard/{dashboard,admin-dashboard,candidate-dashboard}.js
touch js/pages/assessment/{assessment-engine,timer,proctoring,question-renderer}.js
touch js/pages/analytics/{charts,reports}.js

# Create main.js
touch js/main.js

# Move file that can be directly moved
mv js/component_loader.js js/core/router.js
mv js/admin-dashboard.js js/pages/dashboard/admin-dashboard.js
```

## Verification Checklist

After completing reorganization, verify:

- [ ] All CSS files exist in correct folders
- [ ] All JS files exist in correct folders
- [ ] css/main.css imports all CSS files
- [ ] HTML files reference css/main.css
- [ ] HTML files reference new JS structure
- [ ] No broken file paths
- [ ] All pages load without errors
- [ ] No 404 errors in browser console
- [ ] Original flat files deleted
- [ ] Asset paths updated

## Files That Don't Fit Structure

The following files need manual decision:

1. **company logo.jpg** - Already moved to `assets/images/logos/`
2. **front screen.png** - Already moved to `assets/images/backgrounds/`
3. **REFACTORING_COMPLETE_GUIDE.md** - Keep in root as meta-documentation
4. **.git/** - Keep in root (version control)

## Timeline Estimate

- **Phase 1 (CSS):** 2-3 hours
- **Phase 2 (JS):** 4-6 hours
- **Phase 3 (HTML):** 1-2 hours
- **Phase 4 (Cleanup):** 1 hour

**Total:** 8-12 hours of focused work

---

**Plan Version:** 1.0  
**Created:** 2026-05-23  
**Status:** Ready for Execution