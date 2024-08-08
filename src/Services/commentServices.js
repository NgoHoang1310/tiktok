import * as request from '~/utils';

const getCommentsVideo = async (videoId, options = {}) => {
    try {
        const res = await request.get(`/comments/${videoId}`, {
            params: {
                ...options,
            },
        });
        return res;
    } catch (error) {
        throw error;
    }
};

const postCommentVideo = async (payload) => {
    try {
        const res = await request.post(`/comments`, payload);
        return res;
    } catch (error) {
        throw error;
    }
};

export { getCommentsVideo, postCommentVideo };
