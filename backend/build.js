import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'esm',
  outfile: './dist/index.js',
  packages: 'external', // Don't bundle node_modules
  sourcemap: true,
  minify: false, // Set to true for smaller bundle
});

// Build scripts
await esbuild.build({
  entryPoints: [
    './scripts/seedRecipes.ts',
    './scripts/uploadRecipeImages.ts'
  ],
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'esm',
  outdir: './dist/scripts',
  packages: 'external',
  sourcemap: true,
  minify: false,
});

console.log('Build complete!');

