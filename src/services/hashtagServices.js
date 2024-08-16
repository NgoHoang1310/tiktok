import * as request from '~/utils';

const createHashtag = async (payload) => {
    try {
        const res = await request.post(`/hashtags`, payload);
        return res;
    } catch (error) {
        throw error;
    }
};

const getHashtags = async (options) => {
    try {
        const res = await request.get(`/hashtags`, { params: options });
        return res;
    } catch (error) {
        throw error;
    }
};

// const postCommentVideo = async (payload) => {
//     try {
//         const res = await request.post(`/comments`, payload);
//         return res;
//     } catch (error) {
//         throw error;
//     }
// };

export { createHashtag, getHashtags };
