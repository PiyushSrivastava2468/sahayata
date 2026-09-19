import app from '../src/serverApp';

export default function handler(req: any, res: any) {
  // If Vercel rewrites the request to /api, use x-matched-path header if present
  const matchedPath = req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'];
  if (matchedPath && typeof matchedPath === 'string' && (req.url === '/api' || req.url === '/api/')) {
    req.url = matchedPath;
  }
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
