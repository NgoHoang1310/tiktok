import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import config from '~/configs';
import Menu, { MenuItem } from '~/layouts/Components/Sidebar/Menu';
import {
    HomeIcon,
    HomeActiveIcon,
    UserFollowerIcon,
    UserFollowerActiveIcon,
    UserIcon,
    UserActiveIcon,
    UserGroupIcon,
    UserGroupActiveIcon,
    CompassIcon,
    CompassActiveIcon,
} from '~/components/Icons';
import ListAccounts from '~/components/ListAccounts';
import Login from '~/layouts/Components/Sidebar/Login';
import Footer from '~/layouts/Components/Sidebar/Footer';
import { useStore } from '~/hooks';
import { useCallback, useEffect, useState, useRef } from 'react';

import * as apiService from '~/services';

const cx = classNames.bind(styles);
function Sidebar() {
    const [state] = useStore();
    const [following, setFollowing] = useState([]);
    const { initialize, isLogin, currentUser } = state;
    const [loading, setLoading] = useState(false);
    const paginationFollowing = useRef({});

    const handleLoadMore = useCallback(async () => {
        let page = 1;
        setLoading(true);
        if (paginationFollowing.current.hasNextPage) page = paginationFollowing.current.nextPage;
        const res = await apiService.getFollowingUsers(currentUser?._id, { page: page, limit: 1 });
        paginationFollowing.current = res?.pagination;
        setFollowing((prev) => {
            return [...prev, ...res?.data];
        });
        setLoading(false);
    }, [currentUser?._id]);

    useEffect(() => {
        const fetchApi = async (userId) => {
            const res = await apiService.getFollowingUsers(userId, { page: 1, limit: 1 });
            paginationFollowing.current = res?.pagination;
            setFollowing(res.data);
        };

        isLogin && currentUser?._id && fetchApi(currentUser._id);
    }, [isLogin, currentUser?._id]);
    return (
        <aside className={cx('wrapper')}>
            <Menu>
                <MenuItem
                    title="Dành cho bạn"
                    icon={<HomeIcon />}
                    activeIcon={<HomeActiveIcon />}
                    to={config.routes.home}
                />
                <MenuItem
                    title="Đang Follow"
                    icon={<UserFollowerIcon />}
                    activeIcon={<UserFollowerActiveIcon />}
                    to={config.routes.following}
                    requireAuth
                />
                {/* <MenuItem
                    title="Bạn bè"
                    icon={<UserGroupIcon />}
                    activeIcon={<UserGroupActiveIcon />}
                    to={config.routes.friends}
                /> */}
                <MenuItem
                    title="Khám phá"
                    icon={<CompassIcon />}
                    activeIcon={<CompassActiveIcon />}
                    to={config.routes.discover}
                />
                <MenuItem
                    title="Hồ sơ"
                    icon={<UserIcon />}
                    activeIcon={<UserActiveIcon />}
                    to={`/@${currentUser?.tiktokID}`}
                    requireAuth
                />
            </Menu>
            {initialize ? (
                <Box sx={{ width: '100%', display: 'flex', padding: '10px 0' }}>
                    <Skeleton variant="circular" width={50} height={50} />
                    <Box sx={{ flex: 1, margin: '0 8px' }}>
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                    </Box>
                </Box>
            ) : (
                <>
                    {!isLogin ? (
                        <Login />
                    ) : (
                        <ListAccounts
                            loading={loading}
                            hasMore={paginationFollowing.current.hasNextPage}
                            onLoadMore={handleLoadMore}
                            label="Các tài khoản đang follow"
                            data={following}
                        />
                    )}
                </>
            )}

            <Footer />
        </aside>
    );
}

export default Sidebar;
