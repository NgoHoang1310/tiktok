import classNames from 'classnames/bind';
import styles from '~/Components/Popper/Popper.module.scss';

const cx = classNames.bind(styles);

function Wrapper({ className, children }) {
    return <div className={cx('wrapper', className)}>{children}</div>;
}

export default Wrapper;
