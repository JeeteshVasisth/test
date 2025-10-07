import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(() => {
    return {
      server: {
        port: 5000,
        host: '0.0.0.0',
        allowedHosts: ['*'],
      },
      plugins: [],
      resolve: {
        alias: {
          '@': resolve(__dirname, '.'),
        }
      }
    };
});
