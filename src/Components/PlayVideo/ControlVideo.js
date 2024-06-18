import classNames from 'classnames/bind';
import styles from './PlayVideo.module.scss';

import { useEffect, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { Slider, Stack } from '@mui/material';

import HeadlessTippy from '@tippyjs/react/headless';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import { LockScrollIcon, AutoScrollIcon } from '~/components/Icons';

import { formatTime } from '~/utils/common';

const cx = classNames.bind(styles);
function ControlVideo({ videoRef }) {
    const volumeRef = useRef();
    const preVolume = useRef(50);
    const [volume, setVolume] = useState(50);
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
        const handleGetDuration = () => {
            if (videoRef.current) {
                videoRef.current.addEventListener('loadedmetadata', () => {
                    setDuration(videoRef.current.duration);
                });
            }
        };

        handleGetDuration();
        handleOnPause();
        const interval = setInterval(handleTimeUpdate, 1000);

        return () => {
            clearInterval(interval);
            videoRef.current.removeEventListener('loadedmetadata', handleGetDuration);
        };
    }, []);

    useEffect(() => {
        const slider = volumeRef.current;
        const video = videoRef.current;
        const value = ((volume - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, white ${value}%, #cccccc ${value}%, #cccccc 100%)`;
        video.volume = value / 100;
    }, [volume]);

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
        !mute ? setVolume(0) : setVolume(preVolume.current);
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

    const handleSeeking = (e) => {
        if (videoRef.current) {
            videoRef.current.currentTime = e.target.value;
            setCurrentTime(e.target.value);
        }
    };

    const handleVolumeChange = (event) => {
        preVolume.current = event.target.value;
        setVolume(event.target.value);
        if (event.target.value == 0) {
            videoRef.current.muted = true;
            setMute(true);
        } else {
            videoRef.current.muted = false;
            setMute(false);
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
                        <div onClick={handleAutoScroll}>{autoScroll ? <AutoScrollIcon /> : <LockScrollIcon />}</div>
                        <div className={cx('scroll-volume__icon')}>
                            {mute || volume == 0 ? (
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
