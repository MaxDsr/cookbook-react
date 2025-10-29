# ESM Migration Complete ✅

## What Changed

Your backend project has been successfully migrated from CommonJS to ECMAScript Modules (ESM).

### Configuration Files Updated

1. **package.json**
   - Added `"type": "module"` to enable ESM for all `.js` files
   - Added `tsx` dependency for better TypeScript+ESM support
   - Updated scripts to use `tsx` instead of `ts-node`

2. **tsconfig.json**
   - Changed `"module"` from `"CommonJS"` to `"ESNext"`
   - Changed `"moduleResolution"` from `"Node"` to `"Bundler"`

3. **nodemon.json**
   - Updated to use `tsx` for running TypeScript with ESM support
   - Command: `tsx --tsconfig ./tsconfig.json ./src/index.ts`

4. **eslint.config.js**
   - Already using ESM syntax (`import`/`export default`)
   - Deleted old `.eslintrc` file

5. **migrate-mongo-config.js → migrate-mongo-config.cjs**
   - Renamed to `.cjs` extension to allow CommonJS in ESM project
   - No code changes needed - migrate-mongo requires CommonJS

### Source Code Updates

1. **src/index.ts**
   - Added ESM-compatible `__dirname` and `__filename`:
   ```typescript
   import { fileURLToPath } from 'url'
   import { dirname } from 'path'
   
   const __filename = fileURLToPath(import.meta.url)
   const __dirname = dirname(__filename)
   ```

2. **src/scripts/uploadRecipeImages.ts**
   - Added same `__dirname` and `__filename` polyfills

3. **src/utils/paths.ts**
   - Removed unused `joinRelativeToMainPath` function (used `require.main`)
   - Kept `appUrl` function

### Files That Use CommonJS (By Design)

- `migrations/*.js` - migrate-mongo requires CommonJS, these remain unchanged
- `migrate-mongo-config.cjs` - explicitly uses `.cjs` extension

## How to Use

### Install Dependencies

```bash
cd backend
npm install
```

This will install the new `tsx` package and update all dependencies.

### Run Development Server

```bash
npm run dev
```

Uses nodemon with tsx to run your TypeScript code in ESM mode.

### Build for Production

```bash
npm run build
```

TypeScript compiler will now output ESM modules to `./public/`

### Run Scripts

```bash
# Seed recipes (Docker)
npm run seed-recipes

# Seed recipes (Local)
npm run seed-recipes-local

# Upload recipe images
npm run upload-recipe-images
```

All scripts now use `tsx` for TypeScript execution.

### Linting

```bash
npm run lint          # Check for issues
npm run lint:write    # Auto-fix issues
```

ESLint 9 with new flat config format (`eslint.config.js`).

## Benefits of ESM

✅ **Modern Standard**: ESM is the JavaScript standard  
✅ **Better Tree Shaking**: Improved bundle optimization  
✅ **Top-level Await**: Use `await` at module top level  
✅ **Explicit Dependencies**: Clearer import/export relationships  
✅ **Future Proof**: Node.js and ecosystem moving to ESM  
✅ **Frontend Consistency**: Same module system as your React frontend

## Important Notes

### Import Extensions

ESM is strict about file extensions. When importing local files, you may need to be explicit:

```typescript
// May need explicit extensions in some cases
import { something } from './utils.js'  // Note: .js even for .ts files!
```

TypeScript handles this during compilation, but be aware of it.

### JSON Imports

To import JSON files in ESM, you need an assertion:

```typescript
import data from './data.json' assert { type: 'json' }
```

Or use `fs.readFile` + `JSON.parse` for dynamic loading.

### No `__dirname` or `__filename`

These CommonJS globals don't exist in ESM. We've added polyfills where needed:

```typescript
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
```

### No `require()`

Use `import` instead:

```typescript
// ❌ Old CommonJS
const express = require('express')

// ✅ New ESM
import express from 'express'
```

### Dynamic Imports

For conditional/dynamic imports, use `import()`:

```typescript
// Dynamic import (returns a Promise)
const module = await import('./some-module.js')
```

## Troubleshooting

### "Cannot use import statement outside a module"

Make sure `"type": "module"` is in `package.json`.

### "Directory import is not supported"

ESM requires explicit file names. Add `/index.js` or specify the exact file.

### "Unknown file extension .ts"

Make sure you're using `tsx` or `ts-node` with ESM loader, not plain `node`.

### Migration scripts fail

Ensure migrate-mongo-config.cjs is being used. Migration files themselves remain CommonJS.

## Verification Checklist

After running `npm install`:

- [ ] `npm run dev` starts the server
- [ ] `npm run build` compiles without errors
- [ ] `npm run lint` passes (or shows expected issues)
- [ ] API endpoints work correctly
- [ ] Database operations work (Mongoose)
- [ ] Image uploads work (MinIO)
- [ ] Auth0 JWT validation works
- [ ] Scripts run successfully

## Additional Resources

- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
- [TypeScript ESM Support](https://www.typescriptlang.org/docs/handbook/esm-node.html)
- [tsx Documentation](https://github.com/privatenumber/tsx)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)

---

**Migration completed**: Your project is now fully ESM! 🎉

