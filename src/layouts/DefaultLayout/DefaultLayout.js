import classNames from 'classnames/bind';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './DefaultLayout.module.scss';
import { Modal, ModalBody } from 'reactstrap';
import { useContext } from 'react';

import Header from '~/layouts/Components/Header';
import Sidebar from '~/layouts/Components/Sidebar';
import Authentication from '~/components/Authentication';
import Toast from '~/components/Toast';
import { StoreContext, actions } from '~/store';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const [state, dispatch] = useContext(StoreContext);
    const { showModal } = state;
    return (
        <div className="wrapper">
            <Header />
            <div className={cx('container')}>
                <Sidebar />
                <div className={cx('content')}>{children}</div>
            </div>
            <Toast
                position="top-center"
                autoClose={1000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Modal isOpen={showModal} toggle={() => dispatch(actions.showModal(showModal))} centered>
                <ModalBody>
                    <Authentication />
                </ModalBody>
            </Modal>
        </div>
    );
}

export default DefaultLayout;
