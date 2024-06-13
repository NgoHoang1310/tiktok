import * as request from '~/utils';

const getListVideos = async (page = 1, limit = 8) => {
    try {
        const res = await request.get(`/videos?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const uploadVideo = async (payload) => {
    try {
        const res = await request.post('/videos/upload', payload, { contentType: 'multipart/form-data' });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export { getListVideos, uploadVideo };
