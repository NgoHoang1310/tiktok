import classNames from 'classnames/bind';
import styles from './Video.module.scss';

import { useEffect, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { Slider } from '@mui/material';

import { LockScrollIcon, AutoScrollIcon } from '~/components/Icons';

import { formatTime } from '~/utils/common';
import { useStore } from '~/hooks';
import { actions } from '~/store';
import { setVolume } from '~/store/actions';

const cx = classNames.bind(styles);
function ControlVideo({ videoRef, onLoading }) {
    const volumeRef = useRef();
    const preVolume = useRef(50);
    const [state, dispatch] = useStore();
    const { isAutoScroll, isMute, volume } = state;
    const [play, setPlay] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoReady = useRef(false);
    //xử lý phát video mỗi khi nằm trong viewport
    useEffect(() => {
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

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
            handlePause();
        };
    }, [videoReady.current]);

    //xử lý set độ dài của video
    useEffect(() => {
        const handleSetDuration = () => {
            setDuration(videoRef.current?.duration);
        };

        videoRef.current.addEventListener('loadedmetadata', handleSetDuration);
        const interval = setInterval(handleTimeUpdate, 1000);

        return () => {
            clearInterval(interval);
            videoRef.current?.removeEventListener('loadedmetadata', handleSetDuration);
        };
    }, []);
    //xử lý khi video kết thúc
    useEffect(() => {
        const handleEnded = () => {
            setPlay(false);
        };
        videoRef.current.addEventListener('ended', handleEnded);
        return () => {
            videoRef.current?.removeEventListener('ended', handleEnded);
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
        const handleWaiting = () => {
            videoReady.current = false;
            onLoading(true);
        };
        const handleVideoCanplay = () => {
            videoReady.current = true;
            onLoading(false);
        };
        if (videoRef.current) {
            videoRef.current.addEventListener('waiting', handleWaiting);
            videoRef.current.addEventListener('canplay', handleVideoCanplay);
            videoRef.current.addEventListener('playing', handleVideoCanplay);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('waiting', handleWaiting);
                videoRef.current.removeEventListener('canplay', handleVideoCanplay);
                videoRef.current.removeEventListener('playing', handleVideoCanplay);
            }
        };
    }, []);

    //xử lí chặn phát video khi video chưa sẵn sàng để phát

    const handlePlay = () => {
        if (videoReady.current) {
            videoRef.current?.play();
            setPlay(true);
        }
    };

    const handlePause = () => {
        if (videoReady.current) {
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
        if (event.target.value == 0) {
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
                            {isMute || volume == 0 ? (
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
                {duration >= 60 && (
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

export default ControlVideo;
