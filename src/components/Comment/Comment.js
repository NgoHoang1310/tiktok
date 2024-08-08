import classNames from 'classnames/bind';
import styles from './Comment.module.scss';

import { useCallback, useEffect, useState, memo, useRef, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';

import CommentItem from './CommentItem/CommentItem';
import Loading from '../PlaceHolder/Loading';
import Error from '~/components/Error';

import * as apiServices from '~/services';

const cx = classNames.bind(styles);
const socket = io('http://localhost:8080', {
    transports: ['websocket'],
});

function Comment({ video }) {
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState({});
    const [currentReplyId, setCurrentReplyId] = useState(null);
    const [page, setPage] = useState(1);
    const paginationComment = useRef({});
    const paginationReply = useRef({});
    const prevVideoId = useRef(null);

    useEffect(() => {
        const fetchApi = async (video) => {
            let res = await apiServices.getCommentsVideo(video?._id, { page: page, limit: 4 });
            paginationComment.current = res?.pagination;
            setComments((prevComments) => {
                if (prevVideoId.current === video?._id) {
                    return [...prevComments, ...res?.data];
                }
                prevVideoId.current = video?._id;
                setPage(1);
                return [...res?.data];
            });
        };

        video?._id && fetchApi(video);
    }, [video?._id, page]);

    useEffect(() => {
        const handleWebSocket = (response) => {
            let commentId = response?.data[0]?.parentId;
            if (commentId === null) {
                setComments((prevComments) => [...response?.data, ...prevComments]);
            }

            if (commentId !== null) {
                setReplies((prevReplies) => {
                    if (prevReplies[commentId]) {
                        return {
                            ...prevReplies,
                            [commentId]: [...prevReplies[commentId], ...response?.data],
                        };
                    }
                    return {
                        ...prevReplies,
                        [commentId]: response?.data,
                    };
                });
            }
        };

        socket.on(`video-${video?._id}`, handleWebSocket);

        return () => {
            socket.off(`video-${video?._id}`, handleWebSocket);
        };
    }, [video?._id]);

    const handleLoadReplies = useCallback(
        async (commentId) => {
            let page = 1;
            if (paginationReply.current.hasNextPage) page = paginationReply.current.nextPage;
            let res = await apiServices.getCommentsVideo(video?._id, {
                parentId: commentId,
                page: page,
                order: 'asc',
            });
            paginationReply.current = res?.pagination;
            setReplies((prevReplies) => {
                if (prevReplies[commentId]) {
                    return {
                        ...prevReplies,
                        [commentId]: [...prevReplies[commentId], ...res.data],
                    };
                }
                return {
                    ...prevReplies,
                    [commentId]: res.data,
                };
            });
            // setComments((prevComments) => {
            //     let commentIndex = comments.findIndex((comment) => comment._id == commentId);

            //     if (commentIndex !== -1) {
            //         const newComments = [...prevComments];
            //         newComments[commentIndex] = {
            //             ...newComments[commentIndex],
            //             replies: [...newComments[commentIndex].replies, res.data],
            //         };
            //         return newComments;
            //     }

            //     return prevComments;
            // });
        },
        [replies, video],
    );
    const handleShowReplyEditor = useCallback((value) => {
        setCurrentReplyId(value);
    }, []);

    return (
        <div className={cx('wrapper')}>
            {!!comments.length ? (
                <InfiniteScroll
                    dataLength={comments.length}
                    next={() =>
                        setPage((prev) => {
                            console.log('test');
                            if (paginationComment.current?.hasNextPage) {
                                return paginationComment.current?.nextPage;
                            }
                            return prev;
                        })
                    }
                    hasMore={paginationComment.current?.hasNextPage}
                    scrollableTarget="scrollableComment"
                    loader={
                        <h4 style={{ textAlign: 'center' }}>
                            <Loading size={'small'} />
                        </h4>
                    }
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>
                                Bạn đã tải hết bình luận <FontAwesomeIcon color="#58ca50" icon={faCheck} />
                            </b>
                        </p>
                    }
                >
                    <div className={cx('comment-lists')}>
                        {comments.map((comment, index) => {
                            const showLoadReplies = comment.repliesCount !== replies[comment._id]?.length;
                            return (
                                <CommentItem
                                    comment={comment._id}
                                    commentator={comment.commentator}
                                    key={index}
                                    repliesCount={comment.repliesCount}
                                    content={comment.content}
                                    time={comment.createdAt}
                                    currentReplyId={currentReplyId}
                                    videoId={comment.videoId}
                                    replies={replies[comment._id]}
                                    showLoadReplies={showLoadReplies}
                                    showReplyEditor={currentReplyId === comment._id}
                                    onLoadReplies={handleLoadReplies}
                                    onShowReplyEditor={handleShowReplyEditor}
                                />
                            );
                        })}
                    </div>
                </InfiniteScroll>
            ) : (
                <Error title={'Chưa có bình luận nào'} description={'Hãy là người đầu tiên bình luận video này'} />
            )}
        </div>
    );
}

export default memo(Comment);
