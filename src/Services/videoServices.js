import * as request from '~/utils';

const getListVideos = async () => {
    try {
        const res = await request.get('/videos');
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const uploadVideo = async (payload) => {
    try {
        const res = await request.post('/videos', payload, { contentType: 'multipart/form-data' });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export { getListVideos, uploadVideo };
