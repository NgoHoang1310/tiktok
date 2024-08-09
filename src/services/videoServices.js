import * as request from '~/utils';

const getListVideos = async (page = 1, limit = 5) => {
    const res = await request.get(`/videos?page=${page}&limit=${limit}`);
    return res;
};

const getVideosProfile = async (userId, options) => {
    const res = await request.get(`/videos/${userId}/profile`, {
        params: options,
    });

    return res;
};

const getVideosForyou = async (page = 1, limit = 5) => {
    const res = await request.get(`/videos/foryou?page=${page}&limit=${limit}`);
    return res;
};

const getFollowingVideos = async (userId, options = { page: 1, limit: 3 }) => {
    const res = await request.get(`/videos/following/${userId}`, {
        params: options,
    });
    return res;
};

const uploadVideo = async (payload) => {
    const res = await request.post('/videos/upload', payload, { contentType: 'multipart/form-data' });
    return res.data;
};

export { getListVideos, getVideosProfile, getVideosForyou, getFollowingVideos, uploadVideo };
