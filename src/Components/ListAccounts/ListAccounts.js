import classNames from 'classnames/bind';
import styles from './ListAccounts.module.scss';
import PropTypes from 'prop-types';
import { memo } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import AccountItem from '~/components/ListAccounts/AccountItem';
import Button from '~/components/Button';

const cx = classNames.bind(styles);
const defaultFn = () => {};

function ListAccounts({ onLoadMore = defaultFn, loading, hasMore, label, data = [] }) {
    return (
        <div className={cx('wrapper')}>
            <label className={cx('list-label')}>{label}</label>
            {data.length > 0 ? (
                data?.map((account, index) => <AccountItem key={index} data={account?.userInfo} />)
            ) : (
                <div>Chưa có tài khoản follow</div>
            )}
            {loading && (
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px 0' }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Box sx={{ flex: 1, margin: '0 8px' }}>
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                    </Box>
                </Box>
            )}
            {hasMore && (
                <p onClick={onLoadMore} className={cx('more-btn')}>
                    Xem thêm
                </p>
            )}
        </div>
    );
}

ListAccounts.propTypes = {
    label: PropTypes.string.isRequired,
};

export default memo(ListAccounts);
