import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from '~/Components/AccountItem/AccountItem.module.scss';
import Image from '~/Components/Image';

const cx = classNames.bind(styles);

function AccountItem({ data }) {
    return (
        <div className={cx('wrapper')}>
            <Image className={cx('avatar')} src={data.avatar} alt="avatar"></Image>
            <Link to={`/@${data.nickname}`} className={cx('info')}>
                <h4 className={cx('nickname')}>
                    {data.nickname}
                    {data.tick && (
                        <span>
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </span>
                    )}
                </h4>
                <p className={cx('name')}>{data.full_name}</p>
            </Link>
        </div>
    );
}

export default AccountItem;
