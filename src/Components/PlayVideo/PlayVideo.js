import classNames from 'classnames/bind';
import styles from './PlayVideo.module.scss';

import { useState, useRef } from 'react';

import Image from '~/components/Image';
import VideoInformation from './VideoInformation';
import Video from './Video';
import Interaction from '../Interaction';
import Button from '../Button';
import ControlVideo from './ControlVideo';

const cx = classNames.bind(styles);
function PlayVideo({ data }) {
    const [following, setFollowing] = useState(false);
    const videoRef = useRef();

    return (
        <div className={cx('wrapper')}>
            <Image className={cx('avatar')} src={data?.userInfo.avatar} alt="avatar" />
            <div className={cx('content')}>
                <div className={cx('content-header')}>
                    <VideoInformation data={data} />
                    <div className="follow-btn">
                        <Button outline simple={following} onClick={() => setFollowing(!following)}>
                            {following ? 'Following' : 'Follow'}
                        </Button>
                    </div>
                </div>
                <div className={cx('content-body')}>
                    <div className={cx('video')}>
                        <Video ref={videoRef} video={data?.filePath} thumb={data?.thumbPath} />
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

export default PlayVideo;
