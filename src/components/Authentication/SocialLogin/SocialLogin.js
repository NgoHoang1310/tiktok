import classNames from 'classnames/bind';
import styles from './SocialLogin.module.scss';

const cx = classNames.bind(styles);

function SocialLogin({ icon, children, disabled, onClick }) {
    const classes = cx('wrapper', {
        disabled,
    });
    return (
        <button className={classes} onClick={onClick}>
            <span className={cx('icon')}>{icon}</span>
            {children}
        </button>
    );
}

export default SocialLogin;
