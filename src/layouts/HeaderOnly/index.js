import classNames from 'classnames/bind';
import styles from './HeaderOnly.module.scss';
import Header from '~/layouts/Components/Header';
import Toast from '~/components/Toast';
import { useScrollToTop } from '~/hooks';

const cx = classNames.bind(styles);

function HeaderOnly({ children }) {
    useScrollToTop();
    return (
        <div>
            <Header />
            <div className={cx('wrapper')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <Toast
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
}

export default HeaderOnly;
