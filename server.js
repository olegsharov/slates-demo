import express from 'express'
import fs from 'fs';
import path from 'path'
import dotenv from 'dotenv';
import makeBoxesJson from './boxesService.js';
import cors from 'cors'
dotenv.config()

const app = express();
app.use(cors())

app.get('/videos.json', (req, res) => {
    const files = fs.readdirSync(process.env.DATA_ROOT)
      .filter(f => fs.existsSync(path.join(process.env.DATA_ROOT,`${f}.csv`)));
    res.send(files)
});

app.get('/video/:filename/boxes.json', (req, res) => {
    const filename = req.params.filename;
    const videopath = path.join(process.env.DATA_ROOT, filename);

    if (!fs.existsSync(videopath)) {
        return res.status(404).send();
    }

    const csvpath = path.join(process.env.DATA_ROOT, `${filename}.csv`);

    if (!fs.existsSync(csvpath)) {
        return res.status(404).send();
    }

    const csv = fs.readFileSync(csvpath).toString();

    const result = makeBoxesJson(csv);
   
    res.header('Content-type', 'application/json');
    res.send(JSON.stringify(result, null, 2))
});

app.get('/video/:filename', (req, res) => {
    const filename = req.params.filename;
    const videopath = path.join(process.env.DATA_ROOT, filename);

    if (!fs.existsSync(videopath)) {
        return res.status(404).send();
    }

    const videoPath = videopath;
    const videoSize = fs.statSync(videoPath).size
    const chunkSize = 1 * 1e6;
    const range = req.headers.range
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + chunkSize, videoSize - 1)
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers)
    const stream = fs.createReadStream(videoPath, {
        start,
        end
    })
    stream.pipe(res)
})
app.listen(3000);