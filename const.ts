export const SETTINGS = {
    LOCAL_URL: 'http://localhost:3000',
    PROD_URL: 'https://les1-a5qe.vercel.app',
    IS_LOCAL: process.env.IS_LOCAL === 'true'
}

export const getBaseUrl = () => SETTINGS.IS_LOCAL ? SETTINGS.LOCAL_URL : SETTINGS.PROD_URL;
