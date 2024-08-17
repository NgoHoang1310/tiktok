import classNames from 'classnames/bind';
import styles from './PlayVideo.module.scss';

import { useRef, forwardRef, memo, useCallback } from 'react';

import Image from '~/components/Image';
import VideoInformation from './VideoInformation';
import Video from './Video';
import Interaction from '../Interaction';
import Button from '../Button';

import { useStore, useFollow, useFullScreen } from '~/hooks';

import { actions } from '~/store';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
function PlayVideo({ index, data, followDisable = false }, ref) {
    const [state, dispatch] = useStore();
    const [follow, handleFollow] = useFollow(data?.userId, data?.userInfo?.isFollowing);
    const { currentUser, isFullScreen, currentVideo } = state;
    const videoRef = useRef();
    const openFullscreen = useFullScreen();

    return (
        <div ref={ref} className={cx('wrapper')}>
            <Link to={`/@${data?.userInfo?.tiktokID}`}>
                <Image className={cx('avatar')} src={data?.userInfo?.avatar} alt="avatar" />
            </Link>
            <div className={cx('content')}>
                <div className={cx('content-header')}>
                    <VideoInformation data={data} />
                    <div className="follow-btn">
                        {followDisable ? (
                            <></>
                        ) : currentUser?._id !== data?.userInfo?._id ? (
                            <Button outline simple={follow} onClick={handleFollow}>
                                {follow ? 'Following' : 'Follow'}
                            </Button>
                        ) : (
                            <Button outline simple>
                                You
                            </Button>
                        )}
                    </div>
                </div>
                <div className={cx('content-body')}>
                    <div className={cx('video')}>
                        <Video
                            videoId={data?._id}
                            onClick={() => {
                                videoRef.current?.pause();
                                let currentTime = videoRef.current?.currentTime;
                                openFullscreen(index, currentTime);
                            }}
                            ref={videoRef}
                            video={data?.filePath}
                            thumb={data?.thumbPath}
                            preload="metadata"
                            loop={true}
                        />
                    </div>
                    <Interaction
                        data={data}
                        onOpenFullscreen={() => {
                            videoRef.current?.pause();
                            let currentTime = videoRef.current?.currentTime;
                            openFullscreen(index, currentTime);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(forwardRef(PlayVideo));
