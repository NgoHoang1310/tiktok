import * as request from '~/utils/http.js';

const search = async (q, type = 'less') => {
    try {
        const res = await request.get('/users/search', {
            params: {
                q,
                type,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export { search };
