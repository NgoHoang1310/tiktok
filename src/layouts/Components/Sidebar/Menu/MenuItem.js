import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { actions } from '~/store';
import { useStore } from '~/hooks';

const cx = classNames.bind(styles);

function MenuItem({ title, icon, activeIcon, to, requireAuth = false }) {
    const [state, dispatch] = useStore();
    const { showModal, isLogin } = state;

    const handlePreventDefault = (e) => {
        if (requireAuth && !isLogin) {
            e.preventDefault();
            return dispatch(actions.showModal(showModal));
        }
    };
    return (
        <NavLink className={(nav) => cx('menu-item', { active: nav.isActive })} to={to} onClick={handlePreventDefault}>
            <span className={cx('icon')}>{icon}</span>
            <span className={cx('activeIcon')}>{activeIcon}</span>
            <span className={cx('title')}>{title}</span>
        </NavLink>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
};

export default MenuItem;
