import classNames from 'classnames/bind';
import styles from './PostItem.module.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '~/hooks';

import { useStore } from '~/hooks';
import { actions } from '~/store';
import * as apiServices from '~/services';

const cx = classNames.bind(styles);
const defaultFn = () => {};

function PostItem({
    isReply = false,
    videoId,
    commentatorId,
    commentedUser = null,
    commentId = null,
    onSubmit = defaultFn,
}) {
    const [state, dispatch] = useStore();
    const { showModal, isLogin } = state;
    const [comment, setComment] = useState('');
    const [postable, setPostable] = useState(false);
    const [hasBorder, setHasBorder] = useState(false);
    const handleChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async () => {
        let payload = {
            videoId,
            userId: commentatorId,
            parentId: commentId,
            content: isReply && commentedUser ? `<span>@${commentedUser}</span>` + comment : comment,
        };

        let res = await apiServices.postCommentVideo(payload);
        if (res?.status === 201) {
            setComment('');
            return onSubmit(res.data);
        }
    };

    useEffect(() => {
        if (comment?.length > 0) {
            setPostable(true);
        } else {
            setPostable(false);
        }
    }, [comment]);

    return (
        <div onClick={() => setHasBorder(false)} className={cx('wrapper')}>
            {isLogin ? (
                <>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setHasBorder(true);
                        }}
                        className={cx('comment-input', { border: hasBorder })}
                    >
                        <textarea placeholder="Thêm bình luận..." value={comment} onChange={handleChange} rows={2} />
                        <span>
                            <FontAwesomeIcon icon={faSmile} />
                        </span>
                    </div>
                    <Button primary disabled={!postable} className={cx('post-btn')} onClick={handleSubmit}>
                        Đăng
                    </Button>
                </>
            ) : (
                <div
                    onClick={() => dispatch(actions.showModal(showModal))}
                    style={{
                        width: '100%',
                        backgroundColor: '#f8f8f8',
                        padding: '10px 18px',
                        color: 'var(--primary-color)',
                    }}
                >
                    Đăng nhập để bình luận
                </div>
            )}
        </div>
    );
}

export default PostItem;
