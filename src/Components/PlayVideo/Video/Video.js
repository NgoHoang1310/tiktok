import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import { memo, forwardRef } from 'react';
const cx = classNames.bind(styles);

function Video({ video, thumb, ...props }, ref) {
    if (typeof video != 'string') {
        video = URL.createObjectURL(video);
    }
    return (
        <div className={cx('wrapper')}>
            <video poster={thumb} ref={ref} className={cx('video')} src={video} type="video/mp4" {...props} />
        </div>
    );
}

export default memo(forwardRef(Video));
