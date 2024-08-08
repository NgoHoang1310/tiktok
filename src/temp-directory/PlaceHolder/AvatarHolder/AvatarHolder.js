import classNames from 'classnames/bind';
import styles from './Avatar.module.scss';

const cx = classNames.bind(styles);

function AvatarHolder({ width = '3.2rem', height = '3.2rem' }) {
    return (
        <div className={cx('wrapper')} style={{ width: width, height: height }}>
            <div className={cx('loading')}></div>
        </div>
    );
}

export default AvatarHolder;
