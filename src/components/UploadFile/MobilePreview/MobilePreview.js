import classNames from 'classnames/bind';
import styles from './MobilePreview.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faCommentDots, faShare } from '@fortawesome/free-solid-svg-icons';
import { useRef, memo } from 'react';

import { LiveIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Video from '~/components/PlayVideo/Video';
import ControlVideo from './ControlVideo';

const cx = classNames.bind(styles);

function MobilePreview({ data, currentUser }) {
    const videoRef = useRef();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('video-mobile')}>
                <Video loading={false} customControl={false} className={cx('video')} ref={videoRef} video={data} />
                <div className={cx('overlay-preview')}>
                    <div className={cx('header-mobile')}>
                        <LiveIcon />
                        <div>Đang Follow</div>
                        <div>Dành cho bạn</div>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <div className={cx('sidebar-mobile')}>
                        <Image className={cx('avatar-mobile')} src={currentUser?.avatar} />
                        <div>
                            <FontAwesomeIcon icon={faHeart} />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faCommentDots} />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faShare} />
                        </div>
                        <div></div>
                    </div>
                    <div className={cx('nav-mobile')}></div>
                </div>
            </div>
            <ControlVideo videoRef={videoRef} />
        </div>
    );
}

export default memo(MobilePreview);
