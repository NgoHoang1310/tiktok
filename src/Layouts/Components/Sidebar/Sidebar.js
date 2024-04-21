import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import { Placeholder } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

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

const cx = classNames.bind(styles);
function Sidebar() {
    const [state] = useStore();
    const { initialize, isLogin } = state;

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
                />
                <MenuItem
                    title="Bạn bè"
                    icon={<UserGroupIcon />}
                    activeIcon={<UserGroupActiveIcon />}
                    to={config.routes.friends}
                />
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
                    to={config.routes.profile}
                />
            </Menu>
            {initialize ? (
                <Placeholder.Paragraph style={{ margin: '30px 0' }} graph="circle" />
            ) : (
                <>{!isLogin ? <Login /> : <ListAccounts label="Các tài khoản đang follow" />}</>
            )}

            <Footer />
        </aside>
    );
}

export default Sidebar;
