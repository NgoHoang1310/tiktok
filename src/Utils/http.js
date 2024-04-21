import axios from 'axios';

const request = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const get = async (url, options = {}) => {
    const res = await request.get(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    return res.data;
};

export const post = async (url, options = {}, configs = { contentType: 'application/json' }) => {
    const res = await request.post(url, options, {
        headers: {
            'Content-Type': `${configs?.contentType}`,
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    return res.data;
};

export default request;
