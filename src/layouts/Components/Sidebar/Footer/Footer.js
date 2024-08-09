import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';

import { Wrapper as PopperWrapper } from '~/components/Popper';

const cx = classNames.bind(styles);

const informations = [
    {
        section: 'about',
        data: [
            { title: 'Giới thiệu', link: 'https://www.tiktok.com/about?lang=vi-VN' },
            { title: 'Bảng tin', link: '/' },
            { title: 'Liên hệ', link: '/' },
            { title: 'Sự nghiệp', link: '/' },
        ],
    },
    {
        section: 'tiktok',
        data: [
            { title: 'TikTok for Good', link: '/' },
            { title: 'Quảng cáo', link: '/' },
            { title: 'TikTok LIVE Creator Networks', link: '/' },
            { title: 'Developers', link: '/' },
            { title: 'Minh bạch', link: '/' },
            { title: 'TikTok Rewards', link: '/' },
            { title: 'TikTok Embeds', link: '/' },
        ],
    },
    {
        section: 'privacy',
        data: [
            { title: 'Trợ giúp', link: '/' },
            { title: 'An toàn', link: '/' },
            { title: 'Điều khoản', link: '/' },
            { title: 'Quyền riêng tư', link: '/' },
            { title: 'Cổng thông tin Tác giả', link: '/' },
            { title: 'Hướng dẫn Cộng đồng', link: '/' },
        ],
    },
];

function Footer() {
    return (
        <div className={cx('wrapper')}>
            {informations.map((section, index) => {
                return (
                    <div key={index} className={cx('section')}>
                        {section.data.map((item, index) => {
                            return (
                                <a href={item.link} key={index}>
                                    {item.title}
                                </a>
                            );
                        })}
                    </div>
                );
            })}
            <div className={cx('more-btn')}>
                <HeadlessTippy
                    interactive
                    delay={(200, 0)}
                    placement="top-start"
                    // visible={showResult && searchResult && searchResult.length > 0}
                    render={(attrs) => (
                        <div className={cx('principles')} tabIndex={-1} {...attrs}>
                            <PopperWrapper>
                                <a href="">NGUYÊN TẮC THỰC THI PHÁP LUẬT CỦA TIKTOK</a>
                            </PopperWrapper>
                        </div>
                    )}
                >
                    <span>Thêm</span>
                </HeadlessTippy>
            </div>
            <span className={cx('copy-right')}>&#169; 2024 TikTok</span>
        </div>
    );
}

export default Footer;
