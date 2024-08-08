import classNames from 'classnames/bind';
import styles from './Loading.module.scss';

const cx = classNames.bind(styles);
function Loading({ size }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('circle', size)}></div>
            <div className={cx('circle', size)}></div>
        </div>
    );
}

export default Loading;
