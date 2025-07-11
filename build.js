// build.js
const esbuild = require('esbuild');
const { version } = require('./package.json');

esbuild.build({
  entryPoints: ['brainsprite.js'],
  outfile: 'dist/brainsprite.min.js',
  minify: true,
  banner: {
    js: `/*! brainsprite v${version} */`
  }
});
