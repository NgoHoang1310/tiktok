import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import { memo, forwardRef } from 'react';
const cx = classNames.bind(styles);

function Video({ video, thumb }, ref) {
    if (typeof video != 'string') {
        video = URL.createObjectURL(video);
    }
    return (
        <div className={cx('wrapper')}>
            <video ref={ref} className={cx('video')} src={video} type="video/mp4" />
        </div>
    );
}

export default memo(forwardRef(Video));
