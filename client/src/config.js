// In dev, Vite proxies /api → localhost:5000 so API_BASE stays empty.
// In production (Netlify), VITE_API_URL is set to your Render backend URL.
const API_BASE = import.meta.env.VITE_API_URL || '';

export default API_BASE;
