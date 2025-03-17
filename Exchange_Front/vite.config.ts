import { defineConfig, UserConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/src/@types/**',       
        '**/src/models/**',        
        '**/eslint.config.js',     
        '**/jest.config.js',      
        '**/vite.config.ts',      
        '**/main.tsx',             
        '**/vite-env.d.ts',        
      ],
      reportsDirectory: './coverage',
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__test__/setup.ts', 
  }
} as UserConfig)