# QA Academy Frontend

## Pages
- `index.html` - entry page
- `crm/index.html` - admin CRM UI (path `/crm`)
- `student/index.html` - student learning UI (path `/student`)
- `404.html` - fallback page for missing routes

## CRM structure
- `crm/state.js` - shared state and helpers
- `crm/render.js` - UI render functions and refresh pipeline
- `crm/handlers.js` - forms/actions/preview/drag-and-drop handlers
- `crm/bootstrap.js` - startup and auth bootstrap

## Student structure
- `student/state.js` - auth/session state and shared helpers
- `student/render.js` - module/topic/trainer/comments rendering
- `student/handlers.js` - login/navigation/comment actions
- `student/bootstrap.js` - startup with token restore

## Data/API structure
- `data/storage.js` - localStorage keys and token/login helpers
- `data/http.js` - base URL and unified HTTP request wrapper
- `data/api.js` - backend API client for CRM and student portal

## Common UI bootstrap
- `site-config.js` - editable site-level config (WhatsApp/contact values)
- `common/config.js` - config normalization and derived links
- `common/dom.js` - shared DOM bindings (year, links, contacts)
- `common/bootstrap.js` - runs shared UI bootstrap

## Requirements
- backend must be running on `http://localhost:4000`
- frontend should be served by a static server (not `file://`)

## Notes
- API base URL is read from localStorage key: `qa-academy-api-base-url`
- if key is missing, default is `http://localhost:4000`
- sales WhatsApp contact is configured in `site-config.js`
