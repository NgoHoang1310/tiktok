import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

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
    return { ...res.data, status: res.status };
};

export const post = async (url, options = {}, configs = { contentType: 'application/json' }) => {
    const res = await request.post(url, options, {
        headers: {
            'Content-Type': `${configs?.contentType}`,
        },
    });
    return { ...res.data, status: res.status };
};

export const patch = async (url, options = {}, configs = { contentType: 'application/json' }) => {
    const res = await request.patch(url, options, {
        headers: {
            'Content-Type': `${configs?.contentType}`,
        },
    });
    return { ...res.data, status: res.status };
};

export const destroy = async (url, options = {}, configs = { contentType: 'application/json' }) => {
    const res = await request.delete(url, {
        ...options,
        headers: {
            'Content-Type': `${configs?.contentType}`,
        },
    });
    return { ...res.data, status: res.status };
};

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });

    failedQueue = [];
};

const refreshToken = async (payload) => {
    try {
        const res = await request.post('/auth/refresh-token', payload);
        localStorage.setItem('token', JSON.stringify(res.data.data));
        processQueue(null);
        return res.data.data;
    } catch (error) {
        processQueue(error);
        throw error;
    }
};

const getNewToken = async () => {
    if (!isRefreshing) {
        isRefreshing = true;
        let newToken = await refreshToken({
            refreshToken: JSON.parse(localStorage.getItem('token'))?.refreshToken,
        });
        isRefreshing = false;
        return newToken;
    }
    return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
    });
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
        if (error?.response?.status === 401 && !config?._retry) {
            config._retry = true;
            try {
                let newToken = await getNewToken();
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${newToken?.accessToken}`,
                };
                return request(config);
            } catch (error) {
                return Promise.reject(error);
            }
        }
        if (error?.response?.status === 403) {
            localStorage.clear();
        }

        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    },
);

export default request;
