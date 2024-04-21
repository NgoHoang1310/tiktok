import classNames from 'classnames/bind';
import styles from './ListAccounts.module.scss';

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function AccountItem() {
    return (
        <div className={cx('account-item')}>
            <Image
                src="https://p16-sign-useast2a.tiktokcdn.com/tos-useas-avt-0068-giso/cf78b699c812fd8507e2f3a826019f32~c5_100x100.jpeg?lk3s=a5d48078&x-expires=1705057200&x-signature=tG5PlFyl%2BC3zse7OVmV2%2B6LWx58%3D"
                alt="avatar"
                className={cx('avatar')}
            />
            <div className={cx('account-info')}>
                <strong className={cx('nickname')}>
                    Schannelvn
                    <span>
                        <FontAwesomeIcon icon={faCircleCheck} />
                    </span>
                </strong>
                <p className={cx('name')}>Schannelvn</p>
            </div>
        </div>
    );
}

export default AccountItem;
