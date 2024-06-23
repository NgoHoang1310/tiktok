import classNames from 'classnames/bind';
import styles from './PlayVideo.module.scss';

import { useState, useRef, useEffect, forwardRef, memo } from 'react';

import Image from '~/components/Image';
import VideoInformation from './VideoInformation';
import Video from './Video';
import Interaction from '../Interaction';
import Button from '../Button';
import ControlVideo from './ControlVideo';

import * as apiService from '~/services';
import { useStore } from '~/hooks';
import { actions } from '~/store';

const cx = classNames.bind(styles);
function PlayVideo({ data, followDisable = false }, ref) {
    const [state, dispatch] = useStore();
    const { followingUsers, isLogin, showModal } = state;
    const [following, setFollowing] = useState(false);
    const videoRef = useRef();
    //get following lists
    useEffect(() => {
        setFollowing(followingUsers.some((follow) => follow.followingId === data.userId));
    }, [followingUsers]);

    const handleFollow = async () => {
        if (isLogin) {
            if (following) {
                await apiService.unfollowAUser(data?.userId);
                setFollowing(false);
            } else {
                await apiService.followAUser(data?.userId);
                setFollowing(true);
            }

            return;
        }
        dispatch(actions.showModal(showModal));
    };

    return (
        <div ref={ref} className={cx('wrapper')}>
            <Image className={cx('avatar')} src={data?.userInfo?.avatar} alt="avatar" />
            <div className={cx('content')}>
                <div className={cx('content-header')}>
                    <VideoInformation data={data} />
                    <div className="follow-btn">
                        {followDisable ? (
                            <></>
                        ) : (
                            <Button outline simple={following} onClick={handleFollow}>
                                {following ? 'Following' : 'Follow'}
                            </Button>
                        )}
                    </div>
                </div>
                <div className={cx('content-body')}>
                    <div className={cx('video')}>
                        <Video ref={videoRef} video={data?.filePath} thumb={data?.thumbPath} preload={'auto'} />
                        <div className={cx('video-overlay')}>
                            <ControlVideo videoRef={videoRef} />
                        </div>
                    </div>
                    <Interaction />
                </div>
            </div>
        </div>
    );
}

export default memo(forwardRef(PlayVideo));
