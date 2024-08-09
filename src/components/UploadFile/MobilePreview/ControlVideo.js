import classNames from 'classnames/bind';
import styles from './MobilePreview.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute, faExpand } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useImperativeHandle, useState } from 'react';

import { formatTime } from '~/utils/common';

const cx = classNames.bind(styles);

function ControlVideo({ videoRef }) {
    const [play, setPlay] = useState(false);
    const [mute, setMute] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const timeoutId = setTimeout(handleGetDuration, 1000);
        handleTimeUpdate();
        handleOnPause();
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    const handlePlay = () => {
        videoRef.current.play();
        setPlay(true);
    };

    const handlePause = () => {
        videoRef.current.pause();
        setPlay(false);
    };
    const handleMute = (e) => {
        e.stopPropagation();
        videoRef.current.muted = !mute;
        setMute(!mute);
    };

    const handleOnPause = () => {
        videoRef.current.onpause = () => {
            handlePause();
        };
    };
    const handleTimeUpdate = () => {
        videoRef.current.ontimeupdate = function () {
            setCurrentTime(this.currentTime);
        };
    };

    const handleGetDuration = () => {
        setDuration(videoRef.current.duration);
    };

    const handleFullScreen = (e) => {
        e.stopPropagation();
        videoRef?.current.requestFullscreen();
    };

    return (
        <div className={cx('control-overlay')} onClick={play ? handlePause : handlePlay}>
            <div className={cx('control-video')}>
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
                <div className={cx('time')}>
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div className={cx('volume')} onClick={handleMute}>
                    {mute ? <FontAwesomeIcon icon={faVolumeMute} /> : <FontAwesomeIcon icon={faVolumeUp} />}
                </div>
                <div className={cx('full-screen')} onClick={handleFullScreen}>
                    <FontAwesomeIcon icon={faExpand} />
                </div>
                <div className={cx('process-bar-container')}>
                    <div className={cx('process-bar')} style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
}

export default ControlVideo;
