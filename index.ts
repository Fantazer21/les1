import * as express from 'express';
import { Express, Request, Response } from 'express';

enum API_PATHS {
    VIDEOS = '/videos',
    VIDEO_BY_ID = '/videos/:id'
}

const app: Express = express.default();
const port: number = Number(process.env.PORT) || 3000;

let videos = [
    { id: 1, title: "Video 1", author: "Author 1" },
    { id: 2, title: "Video 2", author: "Author 2" },
    { id: 3, title: "Video 3", author: "Author 3" }
];

interface Video {
    id: number;
    title: string;
    author: string;
    availableResolutions?: string[];
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get(API_PATHS.VIDEOS, (_req: Request, res: Response) => {
    res.json(videos);
});

app.get(API_PATHS.VIDEO_BY_ID, (req: Request, res: Response) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);

    if (!video) {
        res.sendStatus(404);
        return;
    }

    res.json(video);
});

app.post(API_PATHS.VIDEOS, (req: Request, res: Response) => {
    const errors: { message: string, field: string }[] = [];

    if (!req.body.title || typeof req.body.title !== 'string') {
        errors.push({
            message: "Title is required and should be a string",
            field: "title"
        });
    }

    if (errors.length) {
        res.status(400).json({ errorsMessages: errors });
        return;
    }

    const newVideo: Video = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions
    };

    videos = [...videos, newVideo];
    res.status(201).json(newVideo);
});

app.put(API_PATHS.VIDEO_BY_ID, (req: Request, res: Response) => {
    const id = +req.params.id;
    const videoIndex = videos.findIndex(v => v.id === id);

    if (videoIndex === -1) {
        res.sendStatus(404);
        return;
    }

    const updatedVideo = {
        ...videos[videoIndex],
        title: req.body.title,
        author: req.body.author
    };

    videos = [...videos.slice(0, videoIndex), updatedVideo, ...videos.slice(videoIndex + 1)];
    res.json(updatedVideo);
});

app.delete(API_PATHS.VIDEO_BY_ID, (req: Request, res: Response) => {
    const id = +req.params.id;
    const videoIndex = videos.findIndex(v => v.id === id);

    if (videoIndex === -1) {
        res.sendStatus(404);
        return;
    }

    videos = videos.filter(v => v.id !== id);
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
