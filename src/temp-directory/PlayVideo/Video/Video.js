import classNames from 'classnames/bind';
import styles from './Video.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import Loading from '~/components/PlaceHolder/Loading';
import ControlVideo from './ControlVideo';

import { memo, forwardRef, useEffect, useRef, useState, useCallback } from 'react';
const cx = classNames.bind(styles);

function Video({ video, customControl = true, thumb, className, preview, ...props }, ref) {
    const videoRef = useRef();
    const [_loading, setLoading] = useState(true);
    const mouseEnter = useRef(false);
    if (video && typeof video != 'string') {
        video = URL.createObjectURL(video);
    }

    const handleLoading = useCallback((value) => {
        setLoading(value);
    }, []);

    useEffect(() => {
        const handleVideoPlay = () => {
            mouseEnter.current = true;
            if (!_loading) {
                videoRef.current.play();
            }
        };
        const handleVideoPause = () => {
            mouseEnter.current = false;
            if (!_loading) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        };
        if (videoRef.current && !customControl) {
            videoRef.current.addEventListener('mouseenter', handleVideoPlay);
            videoRef.current.addEventListener('mouseleave', handleVideoPause);
        }

        return () => {
            // console.log(videoRef);
            if (videoRef.current) {
                videoRef.current.removeEventListener('mouseenter', handleVideoPlay);
                videoRef.current.removeEventListener('mouseleave', handleVideoPause);
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
                    <ControlVideo onLoading={handleLoading} videoRef={ref || videoRef} />
                </div>
            )}
        </div>
    );
}

export default memo(forwardRef(Video));
