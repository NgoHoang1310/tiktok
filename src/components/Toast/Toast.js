import classNames from 'classnames/bind';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './Toast.module.scss';

const cx = classNames.bind(styles);
function Toast(props) {
    return <ToastContainer toastClassName={cx('custom-toast')} {...props} />;
}

export default Toast;
