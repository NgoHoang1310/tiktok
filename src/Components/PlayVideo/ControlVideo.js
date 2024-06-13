import classNames from 'classnames/bind';
import styles from './PlayVideo.module.scss';

import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { Slider } from '@mui/material';

import HeadlessTippy from '@tippyjs/react/headless';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import { LockScrollIcon, AutoScrollIcon } from '~/components/Icons';

import { formatTime } from '~/utils/common';

const cx = classNames.bind(styles);
function ControlVideo({ videoRef }) {
    const [userInteracted, setUserInteracted] = useState(false);
    const [play, setPlay] = useState(false);
    const [mute, setMute] = useState(false);
    const [autoScroll, setAutoScroll] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    //xử lý phát video mỗi khi nằm trong viewport
    useEffect(() => {
        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (userInteracted) handlePlay();
                } else {
                    handlePause();
                }
            });
        };
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.7,
        });

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
            handlePause();
        };
    }, [userInteracted]);

    //xử lí người dùng tương tác với trang wed
    useEffect(() => {
        const handleUserInteract = () => {
            setUserInteracted(true);
        };
        window.addEventListener('click', handleUserInteract);

        return () => {
            window.removeEventListener('click', handleUserInteract);
        };
    }, []);

    useEffect(() => {
        handleOnPause();
        handleGetDuration();
        const interval = setInterval(handleTimeUpdate, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const handlePlay = () => {
        videoRef.current.play();
        setPlay(true);
    };

    const handlePause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setPlay(false);
        }
    };
    const handleMute = (e) => {
        e.stopPropagation();
        videoRef.current.muted = !mute;
        setMute(!mute);
    };

    const handleAutoScroll = () => {
        setAutoScroll(!autoScroll);
    };

    const handleOnPause = () => {
        if (videoRef.current) {
            videoRef.current.onpause = () => {
                handlePause();
            };
        }
    };
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleGetDuration = () => {
        if (videoRef.current) {
            videoRef.current.addEventListener('loadedmetadata', () => {
                setDuration(videoRef.current.duration);
            });
        }
    };

    return (
        <div className={cx('control-overlay')}>
            <div className={cx('video-action')}>
                <div className={cx('video-control')}>
                    <div className={cx('play-pause')}>
                        {play ? (
                            <span onClick={handlePause}>
                                <FontAwesomeIcon icon={faPause} />
                            </span>
                        ) : (
                            <span onClick={handlePlay}>
                                <FontAwesomeIcon icon={faPlay} />
                            </span>
                        )}
                    </div>
                    <div className={cx('scroll-volume')}>
                        <span onClick={handleAutoScroll}>{autoScroll ? <AutoScrollIcon /> : <LockScrollIcon />}</span>
                        <HeadlessTippy
                            interactive
                            visible={true}
                            placement="bottom-start"
                            render={(attrs) => (
                                <div className={cx('volume-control')} tabIndex={-1} {...attrs}>
                                    {/* <PopperWrapper className={cx('volume-control-wrapper')}>
                                        <div className={cx('volume-slider')}>
                                            <div className={cx('volume-slider-rail')}></div>
                                        </div>
                                        <Slider orientation="vertical" />
                                    </PopperWrapper> */}
                                </div>
                            )}
                        >
                            <span onClick={handleMute}>
                                {mute ? <FontAwesomeIcon icon={faVolumeMute} /> : <FontAwesomeIcon icon={faVolumeUp} />}
                                {/* <div className={cx('volume-control-wrapper')}>
                                <Slider
                                    sx={{
                                        '& input[type="range"]': {
                                            WebkitAppearance: 'slider-vertical',
                                        },
                                    }}
                                    orientation="vertical"
                                />
                            </div> */}
                            </span>
                        </HeadlessTippy>
                    </div>
                </div>
                {duration >= 60 && (
                    <div className={cx('video-progress')}>
                        {/* <div className={cx('progress-bar')}>
                        <div className={cx('progress-thumb')}></div>
                    </div> */}
                        <Slider
                            aria-label="time-indicator"
                            color="success"
                            size="small"
                            value={currentTime}
                            min={0}
                            step={1}
                            max={duration}
                            sx={{
                                color: 'white',
                            }}
                        />
                        <div className={cx('progress-time')}>
                            <span>{formatTime(currentTime)}</span>
                            <span>/</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ControlVideo;
