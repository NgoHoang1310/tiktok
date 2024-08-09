import classNames from 'classnames/bind';
import styles from './Authentication.module.scss';
import { useState } from 'react';

import * as apiServices from '~/services';
import { useStore } from '~/hooks';
import { actions } from '~/store';
import SocialLogin from '~/components/Authentication/SocialLogin';
import Form from './Form';
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
    const [login, setLogin] = useState(true);
    const [form, setForm] = useState(false);
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
        <>
            <div className={cx('wrapper')}>
                <h2 className={cx('header')}>{login ? 'Đăng nhập' : 'Đăng kí'} vào TikTok</h2>
                {form ? (
                    <Form type={login ? 'login' : 'register'} onLogin={setLogin} />
                ) : (
                    <div className={cx('social-plugins')}>
                        <SocialLogin disabled icon={<QRIcon />}>
                            Sử dụng mã QR
                        </SocialLogin>
                        <SocialLogin
                            icon={<UserIcon width="2rem" height="2rem" />}
                            onClick={() => {
                                setForm(true);
                            }}
                        >
                            Số điện thoại / Email / TikTok ID
                        </SocialLogin>
                        <SocialLogin icon={<FacebookIcon />} onClick={handleLogin}>
                            Tiếp tục với Facebook
                        </SocialLogin>
                        <SocialLogin icon={<GoogleIcon />}>Tiếp tục với Google</SocialLogin>
                        <SocialLogin disabled={!login} icon={<TwitterIcon />}>
                            Tiếp tục với Twitter
                        </SocialLogin>
                        <SocialLogin disabled={!login} icon={<LineIcon />}>
                            Tiếp tục với LINE
                        </SocialLogin>
                        <SocialLogin disabled={!login} icon={<KakaoTalkIcon />}>
                            Tiếp tục với KakaoTalk
                        </SocialLogin>
                        <SocialLogin disabled={!login} icon={<AppleIcon />}>
                            Tiếp tục với Apple
                        </SocialLogin>
                    </div>
                )}
                <div className={cx('privacy')}>
                    <p>
                        Bằng việc tiếp tục với tài khoản có vị trí tại <a href="">Vietnam</a>, bạn đồng ý với{' '}
                        <a href=""> Điều khoản Sử dụng</a>, đồng thời xác nhận rằng bạn đã đọc{' '}
                        <a href="">Chính sách Quyền riêng tư</a> của chúng tôi.
                    </p>
                </div>
                <div className={cx('footer')}>
                    <p>
                        Bạn {login ? 'không' : 'đã'} có tài khoản?{' '}
                        <a
                            onClick={(e) => {
                                e.preventDefault();
                                setLogin(!login);
                            }}
                            href=""
                        >
                            {login ? 'Đăng ký' : 'Đăng nhập'}
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Authentication;
