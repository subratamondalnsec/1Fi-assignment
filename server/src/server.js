import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
const port = Number(process.env.PORT ?? 5000);
async function start() { await connectDatabase(); createApp().listen(port, () => console.log(`API listening on port ${port}`)); }
start().catch((error) => { console.error('Unable to start the API:', error); process.exit(1); });
