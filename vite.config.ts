import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

const name = "SgSpellChecker";
const fileName = "sg-spell-checker";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name,
      fileName,
      formats: ['umd']
    },
    rollupOptions: {
      output: {
        format: 'umd',
        name,
        inlineDynamicImports: true,
        // Bundle all dependencies
        manualChunks: undefined,
        // Ensure React and ReactDOM are properly exposed
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'i18next': 'i18next',
          'react-i18next': 'ReactI18next'
        },
        // Ensure proper exports
        exports: 'named'
      }
    },
    cssCodeSplit: false,
    // Enable source maps only in development
    sourcemap: process.env.NODE_ENV === 'development',
    // Ensure all dependencies are bundled
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    // Ensure proper minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3,
        dead_code: true,
        // unsafe: true,
        // unsafe_math: true,
        // unsafe_proto: true,
        // unsafe_regexp: true,
        // unsafe_undefined: true,
        // booleans_as_integers: true,
        // ecma: 2020,
        keep_infinity: false,
        module: true,
        toplevel: true
      },
      mangle: {
        toplevel: true,
        safari10: true,
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false,
        ascii_only: true,
        beautify: false,
        braces: false,
        ecma: 2020,
        keep_numbers: false,
        max_line_len: 80,
        semicolons: true,
        shebang: false,
        webkit: false,
        wrap_iife: true,
        wrap_func_args: true
      }
    },
    // Enable tree shaking
    target: 'es2015',
    // Enable code splitting
    chunkSizeWarningLimit: 1000,
    // Enable compression
    reportCompressedSize: true
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    },
    devSourcemap: true,
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    }
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
      protocol: 'ws',
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
}); 