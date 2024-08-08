// import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './CommentItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { memo, useCallback, useEffect, useState } from 'react';
import { LightHeartIcon } from '~/components/Icons';
import moment from 'moment';
import 'moment/locale/vi';
import Image from '~/components/Image';
import PostItem from '../PostItem';
import { useStore } from '~/hooks';
import { actions } from '~/store';
import * as apiServices from '~/services';

const defaultFn = () => {};

const cx = classNames.bind(styles);

function CommentItem({
    comment,
    commentator,
    time,
    content,
    repliesCount,
    currentReplyId,
    videoId,
    isReply = false,
    showLoadReplies = true,
    showReplyEditor = false,
    replies = [],
    onLoadReplies = defaultFn,
    onShowReplyEditor = defaultFn,
}) {
    const [state, dispatch] = useStore();
    const { currentUser, isLogin, showModal } = state;

    const handlePostReply = useCallback(async (result) => {
        if (result) {
            return onShowReplyEditor(null);
        }
    }, []);

    return (
        <div className={cx('wrapper', { replyMode: isReply })}>
            <div className={cx('comment-user')}>
                <div className={cx('info')}>
                    <Image src={commentator?.avatar} className={cx('avatar')} />
                    <div className={cx('sub-content')}>
                        <strong className={cx('user-name')}>{commentator?.tiktokID}</strong>
                        <p className={cx('comment-content')} dangerouslySetInnerHTML={{ __html: content }}></p>
                        <div className={cx('action')}>
                            <span className={cx('main-text')}>{moment(time).locale('vi').fromNow()}</span>
                            <span
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                    isLogin ? onShowReplyEditor(comment) : dispatch(actions.showModal(showModal))
                                }
                                className={cx('main-text')}
                            >
                                Trả lời
                            </span>
                        </div>
                    </div>
                </div>
                <div className={cx('icon')}>
                    <span></span>
                    <span>
                        <LightHeartIcon width="20px" height="20px" />
                    </span>
                    <span>3</span>
                </div>
            </div>
            <div className={cx('reply-container')}>
                {isLogin && showReplyEditor && (
                    <div className={cx('reply-editor')}>
                        <div>
                            <PostItem
                                isReply={isReply}
                                videoId={videoId}
                                commentatorId={currentUser?._id}
                                commentedUser={commentator?.tiktokID}
                                commentId={currentReplyId}
                                onSubmit={handlePostReply}
                            />
                        </div>
                        <span onClick={() => onShowReplyEditor(null)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </div>
                )}
                {!!replies.length &&
                    replies.map((reply, index) => {
                        return (
                            <CommentItem
                                key={index}
                                comment={reply._id}
                                isReply={true}
                                videoId={videoId}
                                showReplyEditor={currentReplyId === reply._id}
                                commentator={reply?.commentator}
                                content={reply?.content}
                                time={reply?.createdAt}
                                replies={reply.replies}
                                currentReplyId={comment}
                                onShowReplyEditor={onShowReplyEditor}
                            />
                        );
                    })}
                {showLoadReplies && !!repliesCount && repliesCount > replies.length && (
                    <p className={cx('see-reply', 'main-text')} onClick={() => onLoadReplies(comment)}>
                        Xem thêm {repliesCount - (!!replies.length ? replies.length : 0)} câu trả lời
                        <span style={{ margin: '0 4px' }}>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}

// CommentItem.proptypes = {
//     replies: PropTypes.array.isRequired,
// };

export default memo(CommentItem);
