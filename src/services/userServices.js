import * as request from '~/utils';

const getFollowingUsers = async (id, options) => {
    try {
        const res = await request.get(`/users/${id}/following`, { params: options });
        return res;
    } catch (error) {
        throw error;
    }
};

const getUserProfile = async (userName) => {
    try {
        const res = await request.get(`/users/${userName}/profile`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const updateProfile = async (id, payload) => {
    try {
        const res = await request.patch(`/users/${id}`, payload, { contentType: 'multipart/form-data;' });
        return res;
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

export { getFollowingUsers, getUserProfile, updateProfile, followAUser, unfollowAUser };
