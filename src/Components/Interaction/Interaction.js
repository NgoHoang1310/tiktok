import classNames from 'classnames/bind';
import styles from './Interaction.module.scss';

// import { HeartIcon, CommentIcon, BookMarkIcon, ShareIcon } from '~/components/Icons';
import { faHeart, faCommentDots, faShare, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, memo } from 'react';

const cx = classNames.bind(styles);

function Interaction({ data }) {
    const [heartActive, setHeartActive] = useState(false);
    const [bookMarkActive, setBookMarkActive] = useState(false);
    console.log('interaction');
    return (
        <div className={cx('wrapper')}>
            <ul className={cx('list')}>
                <li className={cx('item')}>
                    <div onClick={() => setHeartActive(!heartActive)}>
                        <FontAwesomeIcon className={cx('icon', { heartActive: heartActive })} icon={faHeart} />
                    </div>
                    <span>14.8K</span>
                </li>
                <li className={cx('item')}>
                    <div>
                        <FontAwesomeIcon className={cx('icon')} icon={faCommentDots} />
                    </div>
                    <span>14.8K</span>
                </li>
                <li className={cx('item')}>
                    <div onClick={() => setBookMarkActive(!bookMarkActive)}>
                        <FontAwesomeIcon className={cx('icon', { bookMarkActive: bookMarkActive })} icon={faBookmark} />
                    </div>
                    <span>14.8K</span>
                </li>
                <li className={cx('item')}>
                    <div>
                        <FontAwesomeIcon className={cx('icon')} icon={faShare} />
                    </div>
                    <span>14.8K</span>
                </li>
            </ul>
        </div>
    );
}

export default memo(Interaction);
