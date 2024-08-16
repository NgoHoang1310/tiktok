import classNames from 'classnames/bind';
import styles from './Following.module.scss';

import { useEffect, useState, useRef } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import InfiniteScroll from 'react-infinite-scroll-component';

import PlayVideo from '~/components/PlayVideo';
import FullscreenVideo from '~/layouts/FullscreenVideo';
import * as apiService from '~/services';
import { useStore } from '~/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import VideoProvider from '~/hoc/Provider/VideoProvider';
import Loading from '~/components/PlaceHolder/Loading';

const cx = classNames.bind(styles);

function Following() {
    const [state] = useStore();
    const { isFullScreen, currentVideo, currentUser } = state;
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const playVideoRef = useRef([]);
    const pagination = useRef({});

    useEffect(() => {
        const fetchApi = async (userId) => {
            const res = await apiService.getFollowingVideos(userId, { page: page, limit: 5 });
            setLoading(false);
            pagination.current = res.pagination;
            setVideos((prev) => {
                return [...prev, ...res.data];
            });
        };
        currentUser?._id && fetchApi(currentUser?._id);
    }, [currentUser?._id, page]);
    //xử lí sự kiện bấm nút lên/xuống
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'ArrowDown' && !isFullScreen) {
                e.preventDefault();
                currentVideo.index < videos.length - 1 && currentVideo.index++;
                playVideoRef.current[currentVideo.index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }

            if (e.code === 'ArrowUp' && !isFullScreen) {
                e.preventDefault();
                currentVideo.index > 0 && currentVideo.index--;
                playVideoRef.current[currentVideo.index]?.scrollIntoView({
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
    }, [videos, isFullScreen]);

    //xử lí tự động cuộn đến video hiện tại khi thoát chế độ xem toàn màn hình
    useEffect(() => {
        if (!isFullScreen) {
            playVideoRef.current[currentVideo.index]?.scrollIntoView({
                behavior: 'instant',
                block: 'end',
            });
        }
    }, [currentVideo]);

    return (
        <VideoProvider>
            <div className={cx('wrapper')}>
                <div className={cx('content')}>
                    <InfiniteScroll
                        dataLength={videos.length}
                        next={() =>
                            setPage((prev) => {
                                if (pagination.current?.hasNextPage) {
                                    return pagination.current?.nextPage;
                                }
                                return prev;
                            })
                        }
                        loader={
                            <p style={{ textAlign: 'center', marginTop: 4 }}>
                                <Loading style={{ mixBlendMode: 'darken' }} />
                            </p>
                        }
                        hasMore={pagination.current?.hasNextPage}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>
                                    Bạn đã tải hết video <FontAwesomeIcon color="#58ca50" icon={faCheck} />
                                </b>
                            </p>
                        }
                    >
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
                                <PlayVideo
                                    ref={(el) => (playVideoRef.current[index] = el)}
                                    key={index}
                                    index={index}
                                    data={video}
                                    followDisable
                                />
                            ))
                        )}
                    </InfiniteScroll>
                    <FullscreenVideo followDisable={true} videos={videos} goBack={'/following'} />
                </div>
            </div>
        </VideoProvider>
    );
}

export default Following;
