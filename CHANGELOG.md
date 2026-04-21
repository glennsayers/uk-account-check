# uk-account-check

## 1.3.0-v880.0

### Minor Changes

- Add Vocalink v8.80 VALACDOS data ahead of the 30 May 2026 effective date.

## 1.2.1

### Patch Changes

- 219d2bd: Fix commonjs compatibility:

## 1.2.0

### Minor Changes

- b3457dc: Add support for v8.70 (effective 28th March 2026)

  Internal changes:
  - Updated valacdos data file with new sort code entries (230305)
  - Fixed unsafe type cast when calling `verifyBankAccount` with a missing second argument
  - Added `exports` field to package.json for Node.js module resolution
  - Removed dead code (`account-checker.ts`, unused functions in `context.ts`)
  - Resolved duplicate `SortcodeValacdos` type definition between generated and source files
  - Fixed CI workflow to trigger on `master` branch
  - Updated biome rules to be stricter

## 1.1.0

### Minor Changes

- 8d43e47: Adds support for V8.60

## 1.0.0

### Major Changes

- 1730ec9: Initial release supporting v8.50 of the spec
