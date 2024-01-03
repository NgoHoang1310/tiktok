import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from '~/Components/Layouts/Components/Header';
import Sidebar from './Sidebar';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className="wrapper">
            <Header />
            <div className={cx('container')}>
                <Sidebar />
                <div className="content">{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
