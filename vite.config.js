import { defineConfig } from 'vite';
import { readFile } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';

const runtimeAssets = [
  'app.js',
  'karaoke.js',
  'supabase-config.js',
  'nearby.js',
  'shared-listening.js',
  'js/player.js',
  'css/player.css',
  'music/tracks.json',
  'album_aurora.jpg',
  'album_jazz.jpg',
  'album_lofi.jpg',
  'album_lumina.jpg',
  'album_nova.jpg',
];

export default defineConfig({
  base: './',
  plugins: [{
    name: 'spotisix-runtime-assets',
    apply: 'build',
    async generateBundle() {
      const root = process.cwd();
      const tracks = JSON.parse(await readFile(resolve(root, 'music/tracks.json'), 'utf8'));
      if (!Array.isArray(tracks)) throw new Error('music/tracks.json must contain an array');
      const mediaAssets = tracks.flatMap(track =>
        ['audioSrc', 'img', 'lrc']
          .map(key => track?.[key])
          .filter(path => typeof path === 'string' && path.trim() && !/^(?:[a-z]+:|\/\/|data:)/i.test(path))
          .map(path => path.replace(/^\.\//, '')),
      );
      const assets = new Set([...runtimeAssets, ...mediaAssets]);

      for (const fileName of assets) {
        const absolutePath = resolve(root, fileName);
        const relativePath = relative(root, absolutePath);
        if (isAbsolute(relativePath) || relativePath === '..' || relativePath.startsWith(`..${sep}`)) {
          throw new Error(`Runtime asset must stay inside the project directory: ${fileName}`);
        }
        this.emitFile({
          type: 'asset',
          fileName,
          source: await readFile(absolutePath),
        });
      }
    },
  }],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
