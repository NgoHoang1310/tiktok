import classNames from 'classnames/bind';
import styles from './ListAccounts.module.scss';
import PropTypes from 'prop-types';

import AccountItem from '~/components/ListAccounts/AccountItem';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function ListAccounts({ label, data = [] }) {
    return (
        <div className={cx('wrapper')}>
            <label className={cx('list-label')}>{label}</label>
            {data.length > 0 ? (
                data.map((account, index) => <AccountItem key={index} data={account?.userInfo} />)
            ) : (
                <div>Chưa có tài khoản follow</div>
            )}
            <p className={cx('more-btn')}>Xem thêm</p>
        </div>
    );
}

ListAccounts.propTypes = {
    label: PropTypes.string.isRequired,
};

export default ListAccounts;
