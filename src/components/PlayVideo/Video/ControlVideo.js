import classNames from 'classnames/bind';
import styles from './Video.module.scss';

import { useEffect, memo, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { Slider } from '@mui/material';

import { LockScrollIcon, AutoScrollIcon } from '~/components/Icons';

import { formatTime } from '~/utils/common';
import { useStore } from '~/hooks';
import { actions } from '~/store';
import { setVolume } from '~/store/actions';

import * as apiServices from '~/services';

const cx = classNames.bind(styles);
function ControlVideo({ videoId, videoRef, onLoading }) {
    const volumeRef = useRef();
    const preVolume = useRef(50);
    const [state, dispatch] = useStore();
    const { isAutoScroll, isMute, volume, currentVideo, isFullScreen } = state;
    const [play, setPlay] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [videoReady, setVideoReady] = useState(false);
    const isCountedView = useRef(false);

    //xử lý phát video mỗi khi nằm trong viewport
    useEffect(() => {
        const element = videoRef.current;
        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    handlePlay();
                } else {
                    handlePause();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.7,
        });

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
            handlePause();
        };
    }, [videoReady]);

    //xử lý set độ dài của video
    useEffect(() => {
        const element = videoRef.current;
        const handleSetDuration = () => {
            setDuration(element?.duration);
        };

        element.addEventListener('loadedmetadata', handleSetDuration);
        const interval = setInterval(handleTimeUpdate, 1000);

        return () => {
            clearInterval(interval);
            element?.removeEventListener('loadedmetadata', handleSetDuration);
        };
    }, []);

    //xử lý khi video kết thúc
    useEffect(() => {
        const element = videoRef.current;
        const handleEnded = () => {
            setPlay(false);
        };

        element.addEventListener('ended', handleEnded);
        return () => {
            element?.removeEventListener('ended', handleEnded);
        };
    }, []);

    //xử lí nút âm lượng
    useEffect(() => {
        const slider = volumeRef.current;
        const video = videoRef.current;
        const value = ((volume - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, white ${value}%, #cccccc ${value}%, #cccccc 100%)`;
        video.volume = value / 100;
    }, [volume]);

    useEffect(() => {
        const element = videoRef.current;
        const handleWaiting = () => {
            console.log('waiting');

            setVideoReady(false);
            onLoading(true);
        };
        const handleVideoCanplay = () => {
            console.log('canplay');

            setVideoReady(true);
            onLoading(false);
        };

        console.log('listen');

        if (element) {
            element.addEventListener('waiting', handleWaiting);
            element.addEventListener('canplay', handleVideoCanplay);
            element.addEventListener('playing', handleVideoCanplay);
        }

        return () => {
            if (element) {
                element.removeEventListener('waiting', handleWaiting);
                element.removeEventListener('canplay', handleVideoCanplay);
                element.removeEventListener('playing', handleVideoCanplay);
            }
        };
    }, []);
    //xử lí đếm lượt xem của video
    useEffect(() => {
        const element = videoRef.current;
        const handleCountingView = async () => {
            let shouldCountView = play && element.currentTime > 10 && !isCountedView.current && videoId;
            if (shouldCountView) {
                isCountedView.current = true;
                let res = await apiServices.countingView(videoId);
                if (res?.status !== 200 && Object.keys(res?.data) === 0) return;
                console.log('count');
                element.removeEventListener('timeupdate', handleCountingView);
            }
        };

        if (element) {
            element.addEventListener('timeupdate', handleCountingView);
        }

        return () => {
            if (element) {
                element.removeEventListener('timeupdate', handleCountingView);
            }
        };
    }, [play]);

    //xử lí chặn phát video khi video chưa sẵn sàng để phát
    const handlePlay = () => {
        if (videoReady) {
            videoRef.current
                .play()
                .then(() => {
                    setPlay(true);
                })
                .catch(() => {
                    setPlay(false);
                });
        }
    };

    const handlePause = () => {
        if (videoReady) {
            videoRef.current?.pause();
            setPlay(false);
        }
    };

    const handleMute = (e) => {
        e.stopPropagation();
        videoRef.current.muted = !isMute;
        dispatch(actions.mute(!isMute));
        !isMute ? dispatch(actions.setVolume(0)) : dispatch(actions.setVolume(preVolume.current));
    };

    const handleAutoScroll = () => {
        dispatch(actions.autoScroll(!isAutoScroll));
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleSeeking = (e) => {
        e.preventDefault();
        e.stopPropagation();
        videoRef.current.currentTime = e.target.value;
        setCurrentTime(e.target.value);
    };

    const handleVolumeChange = (event) => {
        preVolume.current = event.target.value;
        dispatch(setVolume(event.target.value));
        if (event.target.value === 0) {
            videoRef.current.muted = true;
            dispatch(actions.mute(true));
        } else {
            videoRef.current.muted = false;
            dispatch(actions.mute(false));
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
                        <div onClick={handleAutoScroll}>{isAutoScroll ? <AutoScrollIcon /> : <LockScrollIcon />}</div>
                        <div className={cx('scroll-volume__icon')}>
                            {isMute || volume === 0 ? (
                                <FontAwesomeIcon onClick={handleMute} icon={faVolumeMute} />
                            ) : (
                                <FontAwesomeIcon onClick={handleMute} icon={faVolumeUp} />
                            )}
                            <div className={cx('volume-slider__wrapper')}>
                                <input
                                    ref={volumeRef}
                                    className={cx('volume-slider__progress')}
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {duration >= 45 && (
                    <div className={cx('video-progress')}>
                        <Slider
                            aria-label="Small"
                            color="success"
                            size="small"
                            value={currentTime}
                            min={0}
                            step={1}
                            max={duration}
                            sx={{
                                color: 'white',
                            }}
                            onChange={handleSeeking}
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

export default memo(ControlVideo);
