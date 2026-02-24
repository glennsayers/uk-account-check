---
"uk-account-check": minor
---

Add support for v8.70 (effective 28th March 2026)

Internal changes:

- Updated valacdos data file with new sort code entries (230305)
- Fixed unsafe type cast when calling `verifyBankAccount` with a missing second argument
- Added `exports` field to package.json for Node.js module resolution
- Removed dead code (`account-checker.ts`, unused functions in `context.ts`)
- Resolved duplicate `SortcodeValacdos` type definition between generated and source files
- Fixed CI workflow to trigger on `master` branch
- Updated biome rules to be stricter
