import * as request from '~/utils';

const getFollowings = async (id) => {
    try {
        const res = await request.get(`/users/${id}/following`);
        return res.data;
    } catch (error) {
        throw error;
    }
};
const followAUser = async (id) => {
    try {
        const res = await request.post(`/users/${id}/follow`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const unfollowAUser = async (id) => {
    try {
        const res = await request.destroy(`/users/${id}/unfollow`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export { getFollowings, followAUser, unfollowAUser };
