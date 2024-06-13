import classNames from 'classnames/bind';
import styles from './Home.module.scss';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import PlayVideo from '~/components/PlayVideo';
import * as apiService from '~/services';
import { useEffect, useState } from 'react';

import { useStore } from '~/hooks';

const cx = classNames.bind(styles);
function Home() {
    const [state] = useStore();
    const { initialize } = state;
    const [listVideos, setListVideos] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiService.getListVideos();
            setListVideos(res);
        };

        fetchApi();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            console.log(window.innerHeight);
        };
        window.addEventListener('scroll', handleScroll);

        //cleanup function
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                {initialize ? (
                    <Box sx={{ width: '70%', display: 'flex', padding: '10px 0', alignItems: 'center' }}>
                        <Skeleton variant="circular" width={60} height={60} />
                        <Box sx={{ flex: 1, margin: '0 8px' }}>
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                        </Box>
                    </Box>
                ) : (
                    listVideos?.map((video, index) => <PlayVideo key={index} data={video} />)
                )}
            </div>
        </div>
    );
}

export default Home;
