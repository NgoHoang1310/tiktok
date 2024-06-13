import axios from 'axios';
import * as apiServices from '~/services';

const request = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

const getAccessToken = () => {
    let token = localStorage.getItem('token');
    return JSON.parse(token);
};

export const get = async (url, options = {}) => {
    const res = await request.get(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res.data;
};

export const post = async (url, options = {}, configs = { contentType: 'application/json' }) => {
    const res = await request.post(url, options, {
        headers: {
            'Content-Type': `${configs?.contentType}`,
        },
    });
    return res.data;
};

export const destroy = async (url, options = {}, configs = { contentType: 'application/json' }) => {
    const res = await request.delete(url, {
        ...options,
        headers: {
            'Content-Type': `${configs?.contentType}`,
        },
    });
    return res.data;
};

request.interceptors.request.use(
    function (config) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with config data
        config.headers.Authorization = `Bearer ${getAccessToken()?.accessToken}`;
        return config;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    },
);

request.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const config = error?.config;
        try {
            if (error?.response?.data?.message === 'jwt expired' && !config?._retry) {
                config._retry = true;
                let newToken = await apiServices.refreshToken({
                    refreshToken: JSON.parse(localStorage.getItem('token'))?.refreshToken,
                });
                localStorage.setItem('token', JSON.stringify(newToken));
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${newToken?.accessToken}`,
                };
                return request(config);
            }
        } catch (error) {
            return Promise.reject(error?.response?.data);
        }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    },
);

export default request;
