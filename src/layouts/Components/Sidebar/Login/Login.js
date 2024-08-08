import classNames from 'classnames/bind';
import styles from './Login.module.scss';

import { useStore } from '~/hooks';
import Button from '~/components/Button';
import { actions } from '~/store';

const cx = classNames.bind(styles);

function Login() {
    const [state, dispatch] = useStore();
    const { showModal } = state;
    return (
        <div className={cx('wrapper')}>
            <label>Đăng nhập để follow các tác giả, thích video và xem bình luận.</label>
            <div className={cx('login-btn')}>
                <Button outline large onClick={() => dispatch(actions.showModal(showModal))}>
                    Đăng nhập
                </Button>
            </div>
        </div>
    );
}

export default Login;
