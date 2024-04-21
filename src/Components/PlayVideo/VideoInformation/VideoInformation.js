import classNames from 'classnames/bind';
import styles from './VideoInformation.module.scss';
import { faCircleCheck, faMusic } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertTimeToISO } from '~/utils/common';

const cx = classNames.bind(styles);

function VideoInformation({ data }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('video-info')}>
                <div className={cx('account-info')}>
                    <h3 className={cx('nickname')}>
                        {data?.userInfo?.nickName}
                        <span>{data?.userInfo?.tick && <FontAwesomeIcon icon={faCircleCheck} />}</span>
                    </h3>
                    <h4 className={cx('name')}>{data?.userInfo?.fullName}</h4>
                    <span className={cx('date')}>{convertTimeToISO(data?.createdAt)}</span>
                </div>
                <div className={cx('title')}>
                    {data?.description}
                    <a className={cx('hashtags')}>
                        {/* #calisthenics_master #calisthenics_VietNam #metub #vantoi #calisthenics */}
                    </a>
                </div>
                <div className={cx('music')}>
                    <span>
                        <FontAwesomeIcon icon={faMusic} />
                    </span>
                    {data?.music}
                </div>
            </div>
        </div>
    );
}

export default VideoInformation;
