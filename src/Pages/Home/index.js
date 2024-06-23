import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import PlayVideo from '~/components/PlayVideo';
import * as apiService from '~/services';
import { useStore } from '~/hooks';
import { actions } from '~/store';

const cx = classNames.bind(styles);
function Home() {
    const [state, dispatch] = useStore();
    const { currentUser, isLogin } = state;
    const [loading, setLoading] = useState(true);
    const currentVideoIndex = useRef(0);
    const playVideoRef = useRef([]);
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiService.getListVideos();
            setLoading(false);
            setVideos(res);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async (id) => {
            const res = await apiService.getFollowings(id);
            dispatch(actions.followingUsers(res));
        };
        isLogin && currentUser?._id && fetchApi(currentUser._id);
    }, [isLogin, currentUser?._id]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code == 'ArrowDown') {
                e.preventDefault();
                currentVideoIndex.current < videos.length - 1 && currentVideoIndex.current++;
                playVideoRef.current[currentVideoIndex.current].scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }

            if (e.code == 'ArrowUp') {
                e.preventDefault();
                currentVideoIndex.current > 0 && currentVideoIndex.current--;
                playVideoRef.current[currentVideoIndex.current].scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        //cleanup function
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [videos]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                {loading ? (
                    <Box sx={{ width: '70%', display: 'flex', padding: '10px 0', alignItems: 'center' }}>
                        <Skeleton variant="circular" width={60} height={60} />
                        <Box sx={{ flex: 1, margin: '0 8px' }}>
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                        </Box>
                    </Box>
                ) : (
                    videos?.map((video, index) => (
                        <PlayVideo ref={(el) => (playVideoRef.current[index] = el)} key={index} data={video} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;
