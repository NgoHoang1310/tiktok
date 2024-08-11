import * as request from '~/utils';

const getListVideos = async (options) => {
    const res = await request.get(`/videos`, { params: options });
    return res;
};

const getVideosProfile = async (userId, options) => {
    const res = await request.get(`/videos/${userId}/profile`, {
        params: options,
    });

    return res;
};

const getVideosForyou = async (options) => {
    const res = await request.get(`/videos/foryou`, { params: options });
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

const countingView = async (id) => {
    const res = await request.patch(`videos/${id}/views`);
    return res;
};

export { getListVideos, getVideosProfile, getVideosForyou, getFollowingVideos, uploadVideo, countingView };
