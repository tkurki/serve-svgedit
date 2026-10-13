#!/usr/bin/env node
// Serves SVG-Edit's prebuilt editor on localhost and opens it in the browser.
// Usage: svgedit-serve [port] [--no-open]
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { spawn } = require('node:child_process')

const root = path.join(path.dirname(require.resolve('svgedit/package.json')), 'dist', 'editor')
const args = process.argv.slice(2)
const port = Number(args.find(a => /^\d+$/.test(a)) || process.env.PORT || 8000)
const noOpen = args.includes('--no-open')
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.gif': 'image/gif',
  '.jpg': 'image/jpeg', '.json': 'application/json', '.map': 'application/json',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf'
}

http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (rel.endsWith('/')) rel += 'index.html'
  const file = path.join(root, rel)
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end('Not found'); return }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
    res.end(data)
  })
}).listen(port, '127.0.0.1', () => {
  const url = `http://localhost:${port}/`
  console.log(`SVG-Edit running at ${url}`)
  if (!noOpen) openBrowser(url)
})

function openBrowser (url) {
  const [cmd, cmdArgs] =
    process.platform === 'darwin' ? ['open', [url]]
      : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
        : ['xdg-open', [url]]
  const child = spawn(cmd, cmdArgs, { stdio: 'ignore', detached: true })
  child.on('error', () => console.log('Could not open a browser; open the URL above manually.'))
  child.unref()
}