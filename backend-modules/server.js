import * as http from "http"
import * as esbuild from 'esbuild'
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const port = process.env.PORT || 3001

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method === 'GET' && req.url === '/health_check') {
    res.statusCode = 200
    res.end("Healthy!")
  }

  if (req.method === 'POST' && req.url === '/build') {
    return (async () => {
      console.log("Received Request");
      const chunks = []
      for await (const c of req) chunks.push(c)
      const code = Buffer.concat(chunks).toString('utf8')

      const { outputFiles } = await esbuild.build({
        stdin: { contents: code, loader: 'jsx', resolveDir: '.' },
        bundle: true,
        write: false,
        globalName: 'MyApp',
        external: ['react', 'react-dom'], // will externalize 'react/jsx-runtime' too
        plugins: [{
          name: 'include-react-jsx-runtime',
          setup({ onResolve }) {
            onResolve({ filter: /^react\/jsx-runtime$/ }, args => {
              return { path: require.resolve(args.path) }
            })
          }
        }]
      }).catch(err => {
        res.statusCode = 400
        res.end(String(err))
      })
      if (!outputFiles) return
      const bundle = outputFiles[0].contents

      res.end(bundle)

    })()
  }

  res.statusCode = 404
  res.end()
})
.listen(port, () => console.log('Server Running...'))