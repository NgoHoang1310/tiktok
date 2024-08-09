import classNames from 'classnames/bind';
import styles from './ListAccounts.module.scss';

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function AccountItem({ data, comment }) {
    return (
        <Link to={`/@${data?.tiktokID}`} className={cx('account-item')}>
            <Image src={data?.avatar} alt={data?.nickName} className={cx('avatar')} />
            <div className={cx('account-info')}>
                <strong className={cx('nickname')}>
                    {data?.tiktokID}
                    <span>{data?.isFollowing && <FontAwesomeIcon icon={faCircleCheck} />}</span>
                </strong>
                {comment ? <p className={'comment'}>{comment}</p> : <p className={cx('name')}>{data?.nickName}</p>}
            </div>
        </Link>
    );
}

export default AccountItem;
