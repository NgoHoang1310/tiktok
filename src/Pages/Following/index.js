import classNames from 'classnames/bind';
import styles from './Following.module.scss';

import { useEffect, useState } from 'react';

import PlayVideo from '~/components/PlayVideo';

import * as apiService from '~/services';
import { useStore } from '~/hooks';

const cx = classNames.bind(styles);

function Following() {
    const [state] = useStore();
    const { currentUser, isLogin } = state;
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchApi = async (userId) => {
            const res = await apiService.getFollowingVideos(userId);
            setVideos(res);
        };
        currentUser?._id && fetchApi(currentUser?._id);
    }, [currentUser?._id]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                {videos?.map((video, index) => (
                    <PlayVideo key={index} data={video} followDisable />
                ))}
            </div>
        </div>
    );
}

export default Following;
