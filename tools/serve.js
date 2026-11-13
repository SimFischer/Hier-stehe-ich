// Kleiner Webserver zum lokalen Testen: npm start
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const port = Number(process.env.PORT) || 4173;
const typen = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json' };

createServer(async (req, res) => {
  let pfad = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (pfad.endsWith('/')) pfad += 'index.html';
  const datei = normalize(join(root, pfad));
  if (!datei.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    const inhalt = await readFile(datei);
    res.writeHead(200, { 'Content-Type': (typen[extname(datei)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(inhalt);
  } catch { res.writeHead(404).end('Nicht gefunden'); }
}).listen(port, () => console.log(`Hier stehe ich läuft auf http://localhost:${port}`));
