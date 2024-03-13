import { viteStaticCopy } from 'vite-plugin-static-copy'

export default {
    root: './',
    build: {
        outDir: './dist',
    },
    plugins: [
        viteStaticCopy({
          targets: [
            {
              src: './.well-known',
              dest: './'
            }
          ]
        })
    ],
    server: {
      port: '3000',
      host: '0.0.0.0',
      strictPort: 'true',
    },
  } 
    