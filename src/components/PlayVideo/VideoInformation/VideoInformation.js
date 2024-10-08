import classNames from 'classnames/bind';
import styles from './VideoInformation.module.scss';
import { faCircleCheck, faMusic } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertTimeToISO } from '~/utils/common';

import { memo } from 'react';

const cx = classNames.bind(styles);

function VideoInformation({ data }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('video-info')}>
                <div className={cx('account-info')}>
                    <h3 className={cx('nickname')}>
                        {data?.userInfo?.tiktokID}
                        <span>{data?.userInfo?.tick && <FontAwesomeIcon icon={faCircleCheck} />}</span>
                    </h3>
                    <h4 className={cx('name')}>{data?.userInfo?.nickName}</h4>
                    <span className={cx('date')}>{convertTimeToISO(data?.createdAt)}</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: data?.description }} className={cx('title')}></div>
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

export default memo(VideoInformation);
