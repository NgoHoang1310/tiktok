import classNames from 'classnames/bind';
import styles from './Video.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import numeral, { Numeral } from 'numeral';
import Loading from '~/components/PlaceHolder/Loading';
import ControlVideo from './ControlVideo';

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
const cx = classNames.bind(styles);

function Video(
    { videoId, video, views, customControl = true, loading = true, thumb, className, preview, ...props },
    ref,
) {
    const videoRef = useRef();
    const [_loading, setLoading] = useState(loading);
    const mouseEnter = useRef(false);
    if (video && typeof video != 'string') {
        video = URL.createObjectURL(video);
    }

    const handleLoading = useCallback((value) => {
        setLoading(value);
    }, []);

    useEffect(() => {
        const element = videoRef.current;
        const handleVideoPlay = () => {
            mouseEnter.current = true;
            if (!_loading) {
                element.play();
            }
        };
        const handleVideoPause = () => {
            mouseEnter.current = false;
            if (!_loading) {
                element.pause();
                element.currentTime = 0;
            }
        };
        if (element && !customControl) {
            element.addEventListener('mouseenter', handleVideoPlay);
            element.addEventListener('mouseleave', handleVideoPause);
        }

        return () => {
            if (element) {
                element.removeEventListener('mouseenter', handleVideoPlay);
                element.removeEventListener('mouseleave', handleVideoPause);
            }
        };
    }, [_loading]);

    useEffect(() => {
        const handleWaiting = () => {
            setLoading(true);
        };

        const handlePlaying = () => {
            if (!mouseEnter.current) {
                videoRef.current?.pause();
            }
            setLoading(false);
        };

        if (videoRef.current) {
            videoRef.current.addEventListener('waiting', handleWaiting);
            videoRef.current.addEventListener('canplay', handlePlaying);
            videoRef.current.addEventListener('playing', handlePlaying);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('waiting', handleWaiting);
                videoRef.current.removeEventListener('canplay', handlePlaying);
                videoRef.current.removeEventListener('playing', handlePlaying);
            }
        };
    }, []);

    return (
        <div className={cx('wrapper', className)}>
            <video
                poster={thumb}
                ref={ref || videoRef}
                className={cx('video')}
                src={video}
                type="video/mp4"
                {...props}
            />
            <div className={cx('video-overlay', { active: _loading })}>
                <Loading />
            </div>
            {customControl && (
                <div className={cx('control')}>
                    <ControlVideo videoId={videoId} onLoading={handleLoading} videoRef={ref || videoRef} />
                </div>
            )}
            {!!views && (
                <div className={cx('video-views')}>
                    <span>
                        <FontAwesomeIcon icon={faPlay} />
                    </span>
                    <span>{views > 1000 ? numeral(views).format('0.0a') : views}</span>
                </div>
            )}
        </div>
    );
}

export default memo(forwardRef(Video));
