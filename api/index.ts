import server from '../dist/server.cjs';

// In CJS, the default export is wrapped
const app = (server as any).default || server;

export default app;
