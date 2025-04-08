/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import os from 'os';

const certPath = path.resolve(os.homedir(), '.office-addin-dev-certs');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve(certPath, 'localhost.key')),
      cert: fs.readFileSync(path.resolve(certPath, 'localhost.crt')),
    },
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      port: 3000
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        taskpane: path.resolve(__dirname, 'src/taskpane/taskpane.html')
      }
    }
  },
  publicDir: 'public',
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    force: true
  }
}); 