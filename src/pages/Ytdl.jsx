import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import archiver from 'archiver';
import path from 'path';
import axios from 'axios'; // Pastikan axios terimport
import youtubeSearch from '@liamgenjs/youtube-search-api';
import config from './config.js';
import { initDb, initLocalDb, getCache, setCache } from './db.js';
import { sendReport } from './mailer.js';
import { fetchYoutube, initYTDLEngine } from './ytdl/main-ytdl.js';
import { handleAIChat } from './ai/main-ai.js';
import { handleSSWeb } from './ssweb/main-ssweb.js';
import { log, logASCII } from './logger.js';
import { startTunnel } from './tunnel_manager.js';
import { reportRequest, notifyError, triggerEmergencyShutdown } from './monitor.js';

const app = express();

// --- FIX PROXY & SECURITY ---
app.set('trust proxy', 1);

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
}));

app.use((req, res, next) => {
    req.startTime = performance.now();
    const originalIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    req.realIp = originalIp ? String(originalIp).split(',')[0].trim() : 'Unknown';
    req.safeIp = req.realIp.includes('.') ? req.realIp.split('.').slice(0,2).join('.') + '.xxx.xxx' : 'Hidden';
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});

const limiter = rateLimit({
    windowMs: 1000, max: 50,
    handler: (req) => triggerEmergencyShutdown("DDoS Detected (>50 req/s)", req.realIp)
});
app.use(limiter);

app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors({ origin: '*' }));

const TMP_DIR = config.app.tmp_dir || './temp_data';
const BACKUP_DIR = config.app.backup_dir || './backups';
const BROWSER_TEMP = './local_browser_temp';

fs.ensureDirSync(TMP_DIR); fs.emptyDirSync(TMP_DIR);
fs.ensureDirSync(BROWSER_TEMP); fs.emptyDirSync(BROWSER_TEMP);
fs.ensureDirSync(BACKUP_DIR);

app.use('/tmp', express.static(TMP_DIR, {
    setHeaders: (res) => {
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
        res.set("Access-Control-Allow-Origin", "*");
    }
}));

console.clear();
log.info("Starting KAAI Backend v18.0 [STREAM PROXY ACTIVE]");
initDb(); initLocalDb(); initYTDLEngine(); startTunnel();

// --- STREAM PROXY ENDPOINT (SOLUSI PREVIEW & DOWNLOAD) ---
app.get('/api/stream', async (req, res) => {
    const { url, type, title } = req.query;
    if (!url) return res.status(400).send("URL required");

    try {
        // Request ke URL Asli (GoogleVideo)
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // Set Header agar Browser tahu ini file Audio/Video
        const contentType = type === 'mp3' ? 'audio/mpeg' : 'video/mp4';
        const filename = `${(title || 'download').replace(/[^a-z0-9]/gi, '_')}.${type === 'mp3' ? 'mp3' : 'mp4'}`;

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', response.headers['content-length']);
        
        // Jika parameter download=true, paksa browser download
        if (req.query.download === 'true') {
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        } else {
            // Jika tidak, biarkan diputar (inline)
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        }

        // Pipe stream dari Google ke User
        response.data.pipe(res);
    } catch (e) {
        // log.error("Stream Proxy Error", e.message);
        res.status(500).end();
    }
});

// LOGGER MIDDLEWARE
app.use((req, res, next) => {
    res.on('finish', () => {
        const time = (performance.now() - req.startTime).toFixed(0);
        const isError = res.statusCode >= 400;
        // Jangan log stream chunk agar console tidak penuh
        if (!req.url.includes('/api/stream')) {
            const logData = {
                ip: req.safeIp, method: req.method, url: req.url,
                query: req.method === 'GET' ? req.query : req.body,
                time: time, error: isError ? `Status ${res.statusCode}` : null
            };
            logASCII(logData);
            if(!req.url.includes('/tmp') && !req.url.includes('/backup')) {
                reportRequest(req.url.split('?')[0], !isError, req.realIp, isError ? `Status ${res.statusCode}` : null);
            }
        }
    });
    next();
});

const fmt = (d) => ({ author: "aka", timetmp: new Date().toISOString(), ...d });

app.get('/', (r, s) => s.json({ status: true, msg: "KAAI System Online" }));
app.get('/api/backup', async (req, res) => {
    try {
        const zipName = `backup_kaai_${Date.now()}.zip`;
        const zipPath = path.join(BACKUP_DIR, zipName);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        output.on('close', () => { res.download(zipPath, zipName, () => fs.unlinkSync(zipPath)); });
        archive.on('error', (err) => { throw err; });
        archive.pipe(output);
        archive.glob('**/*', { ignore: ['node_modules/**', 'temp_data/**', 'local_browser_temp/**', 'database.json', 'backups/**', '.git/**', 'package-lock.json', '*.log'] });
        await archive.finalize();
    } catch (e) { notifyError('BACKUP_SYSTEM', e); res.status(500).json({ status: false, msg: "Backup Failed" }); }
});

app.all('/api/ytdl/search', async (req, res) => {
    const q = req.method === 'GET' ? req.query.query : req.body.query;
    if (!q) return res.status(400).json({ status: false, msg: "Query required" });
    try { const r = await youtubeSearch.GetListByKeyword(q, false); res.json(fmt({ status: true, results: r.items })); } 
    catch (e) { notifyError('YTDL_SEARCH', e); res.status(500).json({ status: false, msg: e.message }); }
});

const dlHandler = async (req, res, t) => {
    const u = req.method === 'GET' ? req.query.url : req.body.url;
    if (!u) return res.status(400).json({ status: false, msg: "URL required" });
    try {
        const cached = await getCache(u, t);
        if (cached) return res.json(fmt({ status: true, type: t, cached: true, ...cached }));
        const d = await fetchYoutube(u, t);
        await setCache(u, t, d);
        res.json(fmt({ status: true, type: t, ...d }));
    } catch (e) { notifyError(`YTDL_${t.toUpperCase()}`, e); res.status(500).json({ status: false, msg: e.message }); }
};

app.get('/api/ytdl/mp3', (req, res) => dlHandler(req, res, 'mp3'));
app.post('/api/ytdl/mp3', (req, res) => dlHandler(req, res, 'mp3'));
app.get('/api/ytdl/mp4', (req, res) => dlHandler(req, res, 'mp4'));
app.post('/api/ytdl/mp4', (req, res) => dlHandler(req, res, 'mp4'));

app.get('/api/ai', async (req, res) => {
    const { query, model } = req.query;
    if(!query) return res.json({status: false, msg: "Query kosong"});
    try { const r = await handleAIChat(query, model || 'kaai cplt'); res.json(fmt(r)); } 
    catch (e) { notifyError('AI_CHAT', e); res.json({ status: false, msg: "AI Busy" }); }
});

app.get('/api/ssweb', async (req, res) => {
    const { url, type } = req.query;
    try {
        const r = await handleSSWeb(url, type || 'desktop');
        const previewUrl = `https://${config.app.hostname}/tmp/${r.file}`;
        res.json(fmt({ status: true, url: previewUrl }));
    } catch (e) { notifyError('SSWEB', e); res.json({ status: false, msg: e.message }); }
});

app.post('/api/contact', async (req, res) => {
    try { await sendReport(req.body.name, req.body.title, req.body.message); res.json({ status: true, msg: "Sent" }); } 
    catch (e) { res.status(500).json({ status: false, msg: "Fail" }); }
});

app.use((r, s) => s.status(404).json({ status: false, msg: "Not Found" }));
app.listen(config.app.port, () => log.info(`Listening :${config.app.port}`));
