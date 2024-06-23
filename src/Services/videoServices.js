import * as request from '~/utils';

const getListVideos = async (limit = 5) => {
    try {
        const res = await request.get(`/videos?limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const getFollowingVideos = async (userId, limit = 5) => {
    try {
        const res = await request.get(`/videos/following/${userId}/${limit}`);
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

export { getListVideos, getFollowingVideos, uploadVideo };
