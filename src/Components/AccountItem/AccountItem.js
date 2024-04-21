import PropTypes from 'prop-types';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { memo } from 'react';

import styles from '~/components/AccountItem/AccountItem.module.scss';
import Image from '~/components/Image/Image';

const cx = classNames.bind(styles);

function AccountItem({ data }) {
    return (
        <div className={cx('wrapper')}>
            <Image className={cx('avatar')} src={data.avatar} alt="avatar"></Image>
            <Link to={`/@${data.nickName}`} className={cx('info')}>
                <h4 className={cx('nickname')}>
                    {data.nickName}
                    {data.tick && (
                        <span>
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </span>
                    )}
                </h4>
                <p className={cx('name')}>{data.name}</p>
            </Link>
        </div>
    );
}

AccountItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default memo(AccountItem);
