import classNames from 'classnames/bind';
import styles from './Profile.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck, faPhotoVideo } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody } from 'reactstrap';
import InfiniteScroll from 'react-infinite-scroll-component';

import Image from '~/components/Image';
import EditProfile from '~/components/Modal/EditProfile';
import Button from '~/components/Button';
import { LockIcon, UserIcon } from '~/components/Icons';
import Video from '~/components/PlayVideo/Video';
import Error from '~/components/Error';
import Loading from '~/components/PlaceHolder/Loading';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as apiService from '~/services';
import { useStore } from '~/hooks';
import { actions } from '~/store';
import VideoProvider from '~/hoc/Provider/VideoProvider';
import FullscreenVideo from '~/layouts/FullscreenVideo';

const cx = classNames.bind(styles);
const VIDEO_NAVS = ['video', 'favourite', 'like'];
function Profile() {
    const [state, dispatch] = useStore();
    let { tiktokID } = useParams();
    const { isLogin, currentUser, showModal, currentVideo } = state;
    const navRef = useRef();
    const initialNav = useRef();
    const [lineActive, setLineActive] = useState('video');
    const [profile, setProfile] = useState({});
    const [editable, setEditable] = useState(false);
    const [modal, setModal] = useState(false);
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [privateVideo, setPrivateVideo] = useState(false);
    const [category, setCategory] = useState(VIDEO_NAVS[0]);
    const isMe = useRef(null);
    const pagination = useRef({});

    const updateLinePosition = (item) => {
        let line = navRef.current;
        line.style.left = `${item?.offsetLeft}px`;
        line.style.width = `${item?.offsetWidth}px`;
        setLineActive(item?.dataset.tab);
    };

    const handleVideoNav = async (e, type) => {
        updateLinePosition(e.currentTarget);
        if (isMe.current) {
            setCategory(type === 'video' ? 'video' : type);
            setPage(1);
            setVideos([]);
            setPrivateVideo(false);
        } else {
            if (type === 'video') {
                setPrivateVideo(false);
            } else {
                setPrivateVideo(true);
            }
        }
    };

    const handleOpenFullscreen = useCallback((index) => {
        dispatch(actions.setCurrentVideo({ ...currentVideo, index: index }));
        dispatch(actions.setFullscreen(true));
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            let res = await apiService.getUserProfile(tiktokID.split('@')[1]);

            if (res?._id === currentUser?._id) {
                setEditable(true);
            } else {
                setEditable(false);
            }
            setProfile(res);
        };

        fetchApi();
    }, [tiktokID, currentUser?._id]);

    useEffect(() => {
        isMe.current = profile?._id === currentUser?._id;
        const fetchApi = async (userId, options) => {
            let res = await apiService.getVideosProfile(userId, options);
            pagination.current = res.pagination;
            setVideos((prev) => [...prev, ...res.data]);
        };
        switch (category) {
            case 'like': {
                profile?._id &&
                    fetchApi(profile?._id, {
                        page: page,
                        limit: 6,
                        type: 'like',
                    });
                break;
            }
            case 'favourite': {
                profile?._id &&
                    fetchApi(profile?._id, {
                        page: page,
                        limit: 6,
                        type: 'favourite',
                    });
                break;
            }

            default: {
                profile?._id &&
                    fetchApi(profile?._id, {
                        page: page,
                        limit: 6,
                        viewable: !isMe.current ? 'public' : null,
                    });
                updateLinePosition(initialNav.current);
                setPrivateVideo(false);
                break;
            }
        }
    }, [profile?._id, page, category]);

    return (
        <VideoProvider>
            <div className={cx('wrapper')}>
                <div className={cx('content')}>
                    <InfiniteScroll
                        style={{ overflow: 'initial' }}
                        dataLength={videos.length}
                        next={() => {
                            setPage((prev) => {
                                if (pagination.current?.hasNextPage) {
                                    return pagination.current?.nextPage;
                                }
                                return prev;
                            });
                        }}
                        loader={
                            <p style={{ textAlign: 'center', marginTop: 48 }}>
                                <Loading style={{ mixBlendMode: 'darken' }} />
                            </p>
                        }
                        hasMore={pagination.current?.hasNextPage}
                        endMessage={
                            !privateVideo &&
                            videos.length > 6 && (
                                <p style={{ textAlign: 'center', marginTop: 48 }}>
                                    <b>Bạn đã tải hết video</b> <FontAwesomeIcon color="#58ca50" icon={faCheck} />
                                </p>
                            )
                        }
                    >
                        <div className={cx('user-informations')}>
                            <div className={cx('user-informations__main')}>
                                <Image src={profile?.avatar} className={cx('avatar')} />
                                <div className={cx('detail')}>
                                    <h2 className={cx('')}>{profile?.tiktokID}</h2>
                                    <p className="">{profile?.nickName}</p>
                                    {isLogin ? (
                                        editable ? (
                                            <Button
                                                style={{ width: 136 }}
                                                onClick={() => {
                                                    setModal(!modal);
                                                }}
                                                className={cx('edit-profile-btn')}
                                                simple
                                                leftIcon={<FontAwesomeIcon icon={faEdit} />}
                                            >
                                                Sửa hồ sơ
                                            </Button>
                                        ) : (
                                            <Button style={{ width: 200 }} className={cx('edit-profile-btn')} outline>
                                                Tin nhắn
                                            </Button>
                                        )
                                    ) : (
                                        <Button
                                            style={{ width: 200 }}
                                            onClick={() => dispatch(actions.showModal(showModal))}
                                            primary
                                        >
                                            Follow
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className={cx('user-informations__extra')}>
                                <div className={cx('counts')}>
                                    <strong>{profile?.followingsCount}</strong>
                                    <span>Đang Follow</span>
                                </div>
                                <div className={cx('counts')}>
                                    <strong>{profile?.followersCount}</strong>
                                    <span>Follower</span>
                                </div>
                                {/* <div className={cx('counts')}>
                                <strong>14</strong>
                                <span>Thích</span>
                            </div> */}
                            </div>
                            <div className={cx('user-informations__profile')}>
                                {profile?.bio ? profile.bio : 'Chưa có tiểu sử'}
                            </div>
                        </div>
                        <div className={cx('user-videos')}>
                            <div className={cx('user-videos__nav')}>
                                <Button
                                    ref={initialNav}
                                    data-tab="video"
                                    className={cx('nav-item', { active: lineActive === VIDEO_NAVS[0] })}
                                    onClick={(e) => handleVideoNav(e, VIDEO_NAVS[0])}
                                >
                                    Video
                                </Button>
                                <Button
                                    data-tab="favourite"
                                    leftIcon={<LockIcon width="18px" height="18px" />}
                                    className={cx('nav-item', { active: lineActive === VIDEO_NAVS[1] })}
                                    onClick={(e) => handleVideoNav(e, VIDEO_NAVS[1])}
                                >
                                    Yêu thích
                                </Button>
                                <Button
                                    data-tab="like"
                                    leftIcon={<LockIcon width="18px" height="18px" />}
                                    className={cx('nav-item', { active: lineActive === VIDEO_NAVS[2] })}
                                    onClick={(e) => handleVideoNav(e, VIDEO_NAVS[2])}
                                >
                                    Đã thích
                                </Button>
                                <div ref={navRef} className={cx('line')}></div>
                            </div>
                            {!privateVideo ? (
                                !!videos.length ? (
                                    <div className={cx('user-videos__list')}>
                                        {videos.map((video, index) => {
                                            return (
                                                <div key={index} className={cx('video-item')}>
                                                    <Video
                                                        views={video.viewsCount}
                                                        onClick={() => handleOpenFullscreen(index)}
                                                        customControl={false}
                                                        className={cx('video')}
                                                        video={video.filePath}
                                                        thumb={video.thumbPath}
                                                        muted
                                                        preload="metadata"
                                                    />
                                                    <p
                                                        dangerouslySetInnerHTML={{ __html: video.description }}
                                                        className={cx('title')}
                                                    ></p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <Error icon={<UserIcon width="90px" height="90px" />} title={'Chưa có video nào'} />
                                )
                            ) : (
                                <Error
                                    icon={<UserIcon width="90px" height="90px" />}
                                    title={'Video của người dùng này ở trạng thái riêng tư'}
                                    description={`Các video được thích bởi ${profile?.tiktokID} hiện đang ẩn`}
                                />
                            )}
                        </div>
                    </InfiniteScroll>
                    <FullscreenVideo followDisable videos={videos} goBack={`/${tiktokID}`} />
                </div>
                <Modal size="lg" isOpen={modal} toggle={() => setModal(!modal)} centered>
                    <ModalBody>
                        <EditProfile data={profile} onSetModal={setModal} />
                    </ModalBody>
                </Modal>
            </div>
        </VideoProvider>
    );
}

export default Profile;
