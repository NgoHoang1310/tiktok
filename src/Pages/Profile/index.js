import classNames from 'classnames/bind';
import styles from './Profile.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody } from 'reactstrap';

import Image from '~/components/Image';
import EditProfile from '~/components/Modal/EditProfile';
import Button from '~/components/Button';
import { LockIcon, UserIcon } from '~/components/Icons';
import Video from '~/components/PlayVideo/Video';
import Error from '~/components/Error';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as apiService from '~/services';
import { useStore } from '~/hooks';
import { actions } from '~/store';

const cx = classNames.bind(styles);
const VIDEO_NAVS = ['video', 'loved', 'liked'];
function Profile() {
    const [state, dispatch] = useStore();
    let { tiktokID } = useParams();
    const { isLogin, currentUser, showModal } = state;
    const navRef = useRef();
    const [lineActive, setLineActive] = useState('video');
    const [profile, setProfile] = useState({});
    const [editable, setEditable] = useState(false);
    const [modal, setModal] = useState(false);
    const [video, setVideo] = useState([]);

    const handleVideoNav = (e) => {
        let line = navRef.current;
        line.style.left = `${e.currentTarget.offsetLeft}px`;
        line.style.width = `${e.currentTarget.offsetWidth}px`;
        setLineActive(e.currentTarget.dataset.tab);
    };

    useLayoutEffect(() => {
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
    }, [tiktokID, currentUser]);

    useEffect(() => {
        let viewable = profile?._id === currentUser?._id;
        const fetchApi = async (userId) => {
            let res = await apiService.getVideosProfile(userId, viewable);
            setVideo(res.data);
        };

        profile?._id && fetchApi(profile?._id);
    }, [profile]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
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
                        <div className={cx('counts')}>
                            <strong>14</strong>
                            <span>Thích</span>
                        </div>
                    </div>
                    <div className={cx('user-informations__profile')}>
                        {profile?.bio ? profile.bio : 'Chưa có tiểu sử'}
                    </div>
                </div>
                <div className={cx('user-videos')}>
                    <div className={cx('user-videos__nav')}>
                        <Button
                            data-tab="video"
                            className={cx('nav-item', { active: lineActive == VIDEO_NAVS[0] })}
                            onClick={handleVideoNav}
                        >
                            Video
                        </Button>
                        <Button
                            data-tab="loved"
                            leftIcon={<LockIcon width="18px" height="18px" />}
                            className={cx('nav-item', { active: lineActive == VIDEO_NAVS[1] })}
                            onClick={handleVideoNav}
                        >
                            Yêu thích
                        </Button>
                        <Button
                            data-tab="liked"
                            leftIcon={<LockIcon width="18px" height="18px" />}
                            className={cx('nav-item', { active: lineActive == VIDEO_NAVS[2] })}
                            onClick={handleVideoNav}
                        >
                            Đã thích
                        </Button>
                        <div ref={navRef} className={cx('line')}></div>
                    </div>
                    {isLogin ? (
                        <div className={cx('user-videos__list')}>
                            {video?.map((video, index) => {
                                return (
                                    <div key={index} className={cx('video-item')}>
                                        <Video
                                            customControl={false}
                                            className={cx('video')}
                                            video={video.filePath}
                                            thumb={video.thumbPath}
                                            muted
                                            preload="metadata"
                                        />
                                        <p className={cx('title')}>{video.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <Error
                            icon={<UserIcon width="90px" height="90px" />}
                            title={'Đây là tài khoản riêng tư'}
                            description={'Hãy Follow tài khoản này để xem nội dung và các lượt thích của họ'}
                        />
                    )}
                </div>
            </div>
            <Modal size="lg" isOpen={modal} toggle={() => setModal(!modal)} centered>
                <ModalBody>
                    <EditProfile data={profile} onSetModal={setModal} />
                </ModalBody>
            </Modal>
        </div>
    );
}

export default Profile;
