import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faEllipsisV,
    faGlobeAsia,
    faKeyboard,
    faQuestion,
    faUser,
    faBookmark,
    faVideo,
    faCog,
    faMoon,
    faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';

import routeConfig from '~/Configs/routes';
import styles from './Header.module.scss';
import images from '~/Assets/Images';
import Button from '~/Components/Button';
import Menu from '~/Components/Popper/Menu';
import BoxMessage, { Message } from '~/Components/Icons';
import Image from '~/Components/Image';
import Search from '~/Layouts/Components/Search';

const cx = classNames.bind(styles);
const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faGlobeAsia} />,
        title: 'Tiếng Việt',
        children: {
            title: 'Language',
            data: [
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon icon={faQuestion} />,
        title: 'Phản hồi và trợ giúp',
        to: '/feedback',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: 'Phím tắt trên bàn phím',
    },
];

function Header() {
    const isLogin = true;
    const menuUser = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Xem hồ sơ',
            to: '/@tuanhoanguttk72',
        },
        {
            icon: <FontAwesomeIcon icon={faBookmark} />,
            title: 'Yêu thích',
            to: '/@tuanhoanguttk72',
        },
        {
            icon: <FontAwesomeIcon icon={faVideo} />,
            title: 'LIVE Studio',
            to: '/studio/download',
        },
        {
            icon: <FontAwesomeIcon icon={faCog} />,
            title: 'Cài đặt',
            to: '/setting',
        },
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faMoon} />,
            title: 'Chế độ tối',
        },
        {
            icon: <FontAwesomeIcon icon={faSignOutAlt} />,
            title: 'Đăng xuất',
            to: '/',
            separate: true,
        },
    ];

    const handleMenuChange = (menuItem) => {
        console.log(menuItem);
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <Link to={routeConfig.home}>
                        <img src={images.logo} alt="Tiktok" style={{ height: '40px' }}></img>
                    </Link>
                </div>

                <Search />

                <div className={cx('actions')}>
                    <Button simple leftIcon={<FontAwesomeIcon icon={faPlus} />}>
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
                            <Button primary>Đăng nhập</Button>
                        </>
                    )}

                    <Menu items={isLogin ? menuUser : MENU_ITEMS}>
                        {isLogin ? (
                            <Image
                                className={cx('user-avatar')}
                                src="https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/cf78b699c812fd8507e2f3a826019f32~c5_720x720.jpeg?lk3s=a5d48078&x-expires=1703930400&x-signature=ISd0KTgmXQyO9C2Nq4GX6JzUfHs%3D"
                                alt="Ngô Tuấn Hoàng"
                                // fallback="https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/9fd68e3a141b67f802b2e5ec0b115c90~c5_100x100.jpeg?lk3s=a5d48078&x-expires=1703955600&x-signature=i7N%2FQcJRcsD9zBX%2FNEjw%2BMdCHBs%3D"
                            />
                        ) : (
                            <button className={cx('setting')}>
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default Header;
