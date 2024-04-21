import classNames from 'classnames/bind';
import styles from './Authentication.module.scss';

import * as apiServices from '~/services';
import { useStore } from '~/hooks';
import { actions } from '~/store';
import SocialLogin from '~/components/Authentication/SocialLogin';
import {
    FacebookIcon,
    GoogleIcon,
    TwitterIcon,
    LineIcon,
    KakaoTalkIcon,
    AppleIcon,
    QRIcon,
    UserIcon,
} from '~/components/Icons';

const cx = classNames.bind(styles);

function Authentication() {
    const [state, dispatch] = useStore();
    const { showModal } = state;
    const handleLogin = async () => {
        const response = await apiServices.loginWithFb();
        console.log(response);
        if (response?.errCode === 0) {
            dispatch(actions.showModal(showModal));
            localStorage.setItem('persist:auth', JSON.stringify({ currentUser: response?.data }));
            dispatch(actions.userLogin(response?.data));
        }
    };
    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('header')}>Đăng nhập vào TikTok</h2>
            <div className={cx('social-plugins')}>
                <SocialLogin disabled icon={<QRIcon />}>
                    Sử dụng mã QR
                </SocialLogin>
                <SocialLogin icon={<UserIcon width="2rem" height="2rem" />}>
                    Số điện thoại / Email / TikTok ID
                </SocialLogin>
                <SocialLogin icon={<FacebookIcon />} onClick={handleLogin}>
                    Tiếp tục với Facebook
                </SocialLogin>
                <SocialLogin icon={<GoogleIcon />}>Tiếp tục với Google</SocialLogin>
                <SocialLogin disabled icon={<TwitterIcon />}>
                    Tiếp tục với Twitter
                </SocialLogin>
                <SocialLogin disabled icon={<LineIcon />}>
                    Tiếp tục với LINE
                </SocialLogin>
                <SocialLogin disabled icon={<KakaoTalkIcon />}>
                    Tiếp tục với KakaoTalk
                </SocialLogin>
                <SocialLogin disabled icon={<AppleIcon />}>
                    Tiếp tục với Apple
                </SocialLogin>
            </div>
            <div className={cx('privacy')}>
                <p>
                    Bằng việc tiếp tục với tài khoản có vị trí tại <a href="">Vietnam</a>, bạn đồng ý với{' '}
                    <a href=""> Điều khoản Sử dụng</a>, đồng thời xác nhận rằng bạn đã đọc{' '}
                    <a href="">Chính sách Quyền riêng tư</a> của chúng tôi.
                </p>
            </div>
            <div className={cx('footer')}>
                <p>
                    Bạn không có tài khoản? <a href="">Đăng ký</a>
                </p>
            </div>
        </div>
    );
}

export default Authentication;
