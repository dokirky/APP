import { defineConfig } from 'vite';
import {resolve} from 'path';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname,'src/about.html'),
        editprofile: resolve(__dirname, 'src/editprofile.html'),
        home: resolve(__dirname, 'src/home.html'),
        otherprofile: resolve(__dirname, 'src/otherprofile.html'),
        post: resolve(__dirname, 'src/post.html'),
        profile: resolve(__dirname, 'src/profile.html'),
        signup: resolve(__dirname, 'src/signup.html'),
      },
    }
  },
});
