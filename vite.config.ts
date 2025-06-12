import { splitVendorChunkPlugin } from 'vite';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/embodiment/",
  /*build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if(id.includes('three') || id.includes('@react-three')) {
            return 'three';
          }
        }
      }
    }
  },*/
  plugins: [
    react(),
    checker({
      typescript: "tsconfig.app.json",
    }),
    //splitVendorChunkPlugin(),
  ],
});