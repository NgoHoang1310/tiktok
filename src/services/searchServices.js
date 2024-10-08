import * as request from '~/utils';

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
        throw error;
    }
};

export { search };
