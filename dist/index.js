"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
var API_PATHS;
(function (API_PATHS) {
    API_PATHS["VIDEOS"] = "/hometask_01/api/videos";
    API_PATHS["VIDEO_BY_ID"] = "/hometask_01/api/videos/:id";
})(API_PATHS || (API_PATHS = {}));
const app = express.default();
const port = Number(process.env.PORT) || 3000;
let videos = [
    { id: 1, title: "Video 1", author: "Author 1" },
    { id: 2, title: "Video 2", author: "Author 2" },
    { id: 3, title: "Video 3", author: "Author 3" }
];
app.get(API_PATHS.VIDEOS, (req, res) => {
    res.json(videos);
});
app.get(API_PATHS.VIDEO_BY_ID, (req, res) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.json(video);
});
app.post(API_PATHS.VIDEOS, (req, res) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author
    };
    videos = [...videos, newVideo];
    res.status(201).json(newVideo);
});
app.put(API_PATHS.VIDEO_BY_ID, (req, res) => {
    const id = +req.params.id;
    const videoIndex = videos.findIndex(v => v.id === id);
    if (videoIndex === -1) {
        res.sendStatus(404);
        return;
    }
    const updatedVideo = Object.assign(Object.assign({}, videos[videoIndex]), { title: req.body.title, author: req.body.author });
    videos = [...videos.slice(0, videoIndex), updatedVideo, ...videos.slice(videoIndex + 1)];
    res.json(updatedVideo);
});
app.delete(API_PATHS.VIDEO_BY_ID, (req, res) => {
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
