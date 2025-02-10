"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseUrl = exports.SETTINGS = void 0;
exports.SETTINGS = {
    LOCAL_URL: 'http://localhost:3000',
    PROD_URL: 'https://les1-a5qe.vercel.app',
    IS_LOCAL: process.env.IS_LOCAL === 'true'
};
const getBaseUrl = () => exports.SETTINGS.IS_LOCAL ? exports.SETTINGS.LOCAL_URL : exports.SETTINGS.PROD_URL;
exports.getBaseUrl = getBaseUrl;
