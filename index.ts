import * as express from 'express';
import { Express, Request, Response } from 'express';

enum API_PATHS {
    VIDEOS = '/videos',
    VIDEO_BY_ID = '/videos/:id',
    TESTING = '/testing/all-data'
}

enum Resolution {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

const app: Express = express.default();
const port: number = Number(process.env.PORT) || 3000;

let videos: Video[] = [];

interface Video {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
    availableResolutions: string[];
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
    } else if (req.body.title.length > 40) {
        errors.push({
            message: "Title length should not exceed 40 characters",
            field: "title"
        });
    }

    if (!req.body.author || typeof req.body.author !== 'string' || req.body.author.length > 20) {
        errors.push({
            message: "Author should be a string with length less than 20",
            field: "author"
        });
    }

    if (req.body.availableResolutions && Array.isArray(req.body.availableResolutions)) {
        const isValidResolutions = req.body.availableResolutions.every((r: Resolution) => Object.values(Resolution).includes(r));
        if (!isValidResolutions) {
            errors.push({
                message: "Available resolutions should be valid",
                field: "availableResolutions"
            });
        }
    }

    if (errors.length) {
        res.status(400).json({ errorsMessages: errors });
        return;
    }

    const createdAt = new Date().toISOString();
    const publicationDate = new Date(Date.now() + 86400000).toISOString();

    const newVideo: Video = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt,
        publicationDate,
        availableResolutions: req.body.availableResolutions || []
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

    const errors: { message: string, field: string }[] = [];

    if (!req.body.title || typeof req.body.title !== 'string') {
        errors.push({
            message: "Title is required and should be a string",
            field: "title"
        });
    } else if (req.body.title.length > 40) {
        errors.push({
            message: "Title length should not exceed 40 characters",
            field: "title"
        });
    }

    if (!req.body.author || typeof req.body.author !== 'string' || req.body.author.length > 20) {
        errors.push({
            message: "Author should be a string with length less than 20",
            field: "author"
        });
    }

    if (req.body.canBeDownloaded !== undefined && typeof req.body.canBeDownloaded !== 'boolean') {
        errors.push({
            message: "canBeDownloaded should be boolean",
            field: "canBeDownloaded"
        });
    }

    if (req.body.minAgeRestriction !== null &&
        (typeof req.body.minAgeRestriction !== 'number' ||
            req.body.minAgeRestriction < 1 ||
            req.body.minAgeRestriction > 18)) {
        errors.push({
            message: "minAgeRestriction should be null or number between 1 and 18",
            field: "minAgeRestriction"
        });
    }

    if (!req.body.publicationDate || typeof req.body.publicationDate !== 'string' || isNaN(Date.parse(req.body.publicationDate))) {
        errors.push({
            message: "publicationDate should be a valid ISO string",
            field: "publicationDate"
        });
    }

    if (errors.length) {
        res.status(400).json({ errorsMessages: errors });
        return;
    }

    const updatedVideo: Video = {
        ...videos[videoIndex],
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded,
        minAgeRestriction: req.body.minAgeRestriction,
        publicationDate: req.body.publicationDate,
        availableResolutions: req.body.availableResolutions
    };

    videos = [...videos.slice(0, videoIndex), updatedVideo, ...videos.slice(videoIndex + 1)];
    res.sendStatus(204);
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

app.delete(API_PATHS.TESTING, (_req: Request, res: Response) => {
    videos = [];
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
