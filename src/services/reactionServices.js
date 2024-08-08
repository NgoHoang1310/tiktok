import * as request from '~/utils';

const postReaction = async (payload) => {
    try {
        const res = await request.post(`/reactions`, payload);
        return res;
    } catch (error) {
        throw error;
    }
};

const retrieveReaction = async (payload) => {
    try {
        const res = await request.destroy(`/reactions`, { data: payload });
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

export { postReaction, retrieveReaction };
