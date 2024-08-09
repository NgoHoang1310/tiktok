import classNames from 'classnames/bind';
import styles from './Error.module.scss';

const cx = classNames.bind(styles);

function Error({ style, icon, title, description, button }) {
    return (
        <div style={style} className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('icon')}>{icon}</div>
                <div className={cx('message')}>
                    <h1 className={cx('title', 'fw-bold')}>{title}</h1>
                    <p className={cx('description')}>{description}</p>
                </div>
                <div className={cx('button')}>{button}</div>
            </div>
        </div>
    );
}

export default Error;
