import classNames from 'classnames/bind';
import styles from './FullscreenVideo.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronUp, faChevronDown, faMusic, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Video from '~/components/PlayVideo/Video';
import Comment from '~/components/Comment';
import Interaction from '~/components/Interaction';
import Image from '~/components/Image';
import { useStore, useFollow } from '~/hooks';
import { actions } from '~/store';
import Button from '~/components/Button';
import PostItem from '~/components/Comment/PostItem';

const cx = classNames.bind(styles);

function FullscreenVideo({ videos = [], goBack }) {
    const [state, dispatch] = useStore();
    const { currentVideo, isFullScreen, currentUser } = state;
    const [videoIndex, setVideoIndex] = useState();
    const [follow, handleFollow] = useFollow(
        videos[videoIndex]?.userInfo?._id,
        videos[videoIndex]?.userInfo?.isFollowing,
    );
    const videoRef = useRef();
    const navigate = useNavigate();

    const handleCloseFullscreen = () => {
        let currentTime = videoRef.current?.currentTime;
        dispatch(actions.setFullscreen(false));
        dispatch(actions.setCurrentVideo({ index: videoIndex, currentTime: currentTime }));
        navigate(goBack);
    };

    const handleNext = () => {
        setVideoIndex((prev) => (prev < videos.length - 1 ? prev + 1 : prev));
    };

    const handlePrevious = () => {
        setVideoIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    useEffect(() => {
        setVideoIndex(currentVideo.index);
        videoRef.current.currentTime = currentVideo.currentTime;
    }, [currentVideo]);

    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFullScreen]);

    useEffect(() => {
        if (isFullScreen) {
            window.history.replaceState(
                null,
                '',
                `/@${videos[videoIndex]?.userInfo?.tiktokID}/video/${videos[videoIndex]?._id}`,
            );
        }
    }, [videoIndex, isFullScreen]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content', { fullscreen: isFullScreen })}>
                <div className={cx('left')}>
                    {<Video autoPlay ref={videoRef} className={cx('video')} video={videos[videoIndex]?.filePath} />}
                    <div onClick={handleCloseFullscreen} className={cx('button', 'close-btn')}>
                        <FontAwesomeIcon size={'2x'} icon={faTimes} />
                    </div>
                    <div className={cx('arrow-btn')}>
                        <div onClick={handlePrevious} className={cx('button')}>
                            <FontAwesomeIcon size="2x" icon={faChevronUp} />
                        </div>
                        <div onClick={handleNext} className={cx('button')}>
                            <FontAwesomeIcon size="2x" icon={faChevronDown} />
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundImage: `url('${videos[videoIndex]?.thumbPath}')`,
                        }}
                        className={cx('image-background')}
                    >
                        <div className={cx('blur-overlay')}></div>
                    </div>
                </div>
                <div className={cx('right')}>
                    <div id="scrollableComment" className={cx('comment-container')}>
                        <div className={cx('video-desc')}>
                            <div className={cx('video-desc__header')}>
                                <Link>
                                    <Image
                                        src={videos[videoIndex]?.userInfo?.avatar}
                                        className={cx('avatar')}
                                        alt="avatar"
                                    />
                                </Link>
                                <div className={cx('user-info')}>
                                    <p className={cx('fs-3 fw-bold')}>
                                        {videos[videoIndex]?.userInfo?.tiktokID}
                                        <span>
                                            {videos[videoIndex]?.userInfo?.tick && (
                                                <FontAwesomeIcon icon={faCircleCheck} />
                                            )}
                                        </span>
                                    </p>
                                    <p className={cx('fs-4 ')}>{videos[videoIndex]?.userInfo?.nickName}</p>
                                </div>
                                <div className={cx('follow-btn')}>
                                    <Button primary simple={follow} onClick={handleFollow}>
                                        {follow ? 'Following' : 'Follow'}
                                    </Button>
                                </div>
                            </div>
                            <div className={cx('video-desc__body')}>
                                <div className={cx('video-content')}>
                                    <span>{videos[videoIndex]?.description}</span>
                                    <a className={cx('hashtags')}>#hoang</a>
                                    <a className={cx('hashtags')}>#hoang</a>
                                </div>
                                <div className={cx('video-music')}>
                                    <span>
                                        <FontAwesomeIcon icon={faMusic} />
                                    </span>
                                    <a>Nhạc gốc</a>
                                </div>
                            </div>
                        </div>
                        <div className={cx('video-media')}>
                            <Interaction
                                data={videos[videoIndex]}
                                size="small"
                                className={cx('interaction')}
                                direction="horizontal"
                            />
                            <div className={cx('copy-link')}>
                                <p>
                                    https://www.tiktok.com/@tuanhoanguttk72/video/7382495738149768455?is_from_webapp=1&sender_device=pc&web_id=7365153185948468737
                                </p>
                                <button>Sao chép liên kết</button>
                            </div>
                        </div>
                        <div className={cx('video-comment')}>
                            <div className={cx('video-comment__nav')}>
                                <Button className={cx('nav-item')}>
                                    Bình luận ({videos[videoIndex]?.commentsCount})
                                </Button>
                            </div>
                            <div className={cx('break-bar')}></div>
                            <Comment video={videos[videoIndex]} />
                        </div>
                    </div>
                    <div className={cx('break-bar')}></div>
                    <div className={cx('comment-post')}>
                        <PostItem videoId={videos[videoIndex]?._id} commentatorId={currentUser?._id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(FullscreenVideo);
