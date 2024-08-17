import classNames from 'classnames/bind';
import styles from './Interaction.module.scss';

// import { HeartIcon, CommentIcon, BookMarkIcon, ShareIcon } from '~/components/Icons';
import { faHeart, faCommentDots, faShare, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';
import { useReaction } from '~/hooks';

const cx = classNames.bind(styles);

function Interaction({ size = 'medium', data, className, direction = 'vertical', onOpenFullscreen, ...props }) {
    const [reactions, reactionsCount, handleReactions] = useReaction(
        data?._id,
        { like: data?.isLiked, favourite: data?.isFavourited },
        { like: data?.likesCount, favourite: data?.favouritesCount },
    );
    return (
        <div className={cx('wrapper', { [className]: className })} {...props}>
            <ul className={cx('list', direction)}>
                <li className={cx('item')}>
                    <div className={cx(size)} onClick={() => handleReactions('like', 'Video')}>
                        <FontAwesomeIcon className={cx('icon', { heartActive: reactions?.like })} icon={faHeart} />
                    </div>
                    <span>{reactionsCount?.like}</span>
                </li>
                <li className={cx('item')}>
                    <div onClick={onOpenFullscreen} className={cx(size)}>
                        <FontAwesomeIcon className={cx('icon')} icon={faCommentDots} />
                    </div>
                    <span>{data?.commentsCount}</span>
                </li>
                <li className={cx('item')}>
                    <div className={cx(size)} onClick={() => handleReactions('favourite', 'Video')}>
                        <FontAwesomeIcon
                            className={cx('icon', { bookMarkActive: reactions?.favourite })}
                            icon={faBookmark}
                        />
                    </div>
                    <span>{reactionsCount?.favourite}</span>
                </li>
                <li className={cx('item')}>
                    <div className={cx(size)}>
                        <FontAwesomeIcon className={cx('icon')} icon={faShare} />
                    </div>
                    <span>{data?.sharesCount}</span>
                </li>
            </ul>
        </div>
    );
}

export default memo(Interaction);
