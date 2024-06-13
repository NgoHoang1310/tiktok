import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link, useNavigate } from 'react-router-dom';

import { signOut } from 'firebase/auth';

import styles from './Header.module.scss';
import images from '~/assets/Images';
import Button from '~/components/Button/Button';
import Menu from '~/components/Popper/Menu';
import { Message, BoxMessage } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '~/layouts/Components/Search';
import AvatarHolder from '~/components/PlaceHolder';

import config from '~/configs';
import { auth } from '~/firebase/firebaseConfig';
import { actions } from '~/store';
import { useStore } from '~/hooks';
import * as apiServices from '~/services';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate();
    const [state, dispatch] = useStore();
    const { showModal, isLogin, currentUser, initialize } = state;

    const handleLogOut = async (item) => {
        if (item?.logOut) {
            const token = JSON.parse(localStorage.getItem('token'));
            const res = await apiServices.logout(token?.refreshToken);
            if (res?.message === 'Log out successfully !') {
                localStorage.removeItem('token');
                dispatch(actions.userLogOut());
                window.location.reload();
            }
        }
    };

    const handleUpload = () => {
        navigate(config.routes.upload);
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <Link to={config.routes.home}>
                        <img src={images.logo} alt="Tiktok" style={{ height: '40px' }}></img>
                    </Link>
                </div>

                <Search />

                {initialize ? (
                    <AvatarHolder />
                ) : (
                    <div className={cx('actions')}>
                        <Button
                            simple
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={isLogin ? handleUpload : () => dispatch(actions.showModal(showModal))}
                        >
                            Tải lên
                        </Button>
                        {isLogin ? (
                            <>
                                <Tippy content="Tin nhắn">
                                    <button className={cx('actions-btn')}>
                                        <Message />
                                    </button>
                                </Tippy>
                                <Tippy content="Hộp thoại">
                                    <button className={cx('actions-btn')}>
                                        <BoxMessage />
                                    </button>
                                </Tippy>
                            </>
                        ) : (
                            <>
                                <Button primary onClick={() => dispatch(actions.showModal(showModal))}>
                                    Đăng nhập
                                </Button>
                            </>
                        )}

                        <Menu items={isLogin ? config.menus.menuUser : config.menus.MENU_ITEMS} onChange={handleLogOut}>
                            {isLogin ? (
                                <Image
                                    className={cx('user-avatar')}
                                    src={currentUser.avatar}
                                    alt="Ngô Tuấn Hoàng"
                                    // fallback="https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png"
                                />
                            ) : (
                                <button className={cx('setting')}>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                            )}
                        </Menu>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
