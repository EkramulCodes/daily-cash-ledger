# Data Loss Prevention Fix

## 1. ✅ Add dirty state + ConfirmModal guard in useLedger.js
- Track `isDirty` on row changes
- Block month-load if dirty, show confirm dialog
- Preserve UX, prevent accidental overwrites

## 2. ✅ Test Complete
- Edit row → change month → ConfirmModal prompts
- Confirm = loads cloud (no data loss)
- Cancel = keeps local data
- npm run dev running OK

**Fixed**: Google Sheet data erase on month change resolved! 🎉
