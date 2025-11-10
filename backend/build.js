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

console.log('Build complete!');

