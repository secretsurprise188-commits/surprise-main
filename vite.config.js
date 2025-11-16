import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'// https://vitejs.dev/config/
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react() ,tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'shahoda App',          // Full app name
        short_name: 'shahoda',        // Short name for home screen
        start_url: '.',                // Start URL
        display: 'standalone',         // Open without browser UI
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})

