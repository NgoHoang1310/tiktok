import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '~/components/Popper/Menu/Menu.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';

import MenuItem from './MenuItem';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Header from './Header';
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);
const DefaultFunction = () => {};

function Menu({ items = [], children, onChange = DefaultFunction }) {
    const [history, setHistory] = useState([{ data: items }]);

    const current = history[history.length - 1].data;
    useEffect(() => {
        setHistory([{ data: items }]);
    }, [items]);
    const handleToSubMenu = (condition, subMenu) => {
        if (condition) {
            setHistory((prev) => [...prev, subMenu.children]);
        } else {
            onChange(subMenu);
        }
    };

    const handleGoBack = () => {
        setHistory((prev) => prev.slice(0, prev.length - 1));
    };

    return (
        <HeadlessTippy
            delay={100}
            interactive
            placement="bottom-end"
            hideOnClick={false}
            render={(attrs) => (
                <div className={cx('menu-items')} tabIndex={-1} {...attrs}>
                    <PopperWrapper className={cx('menu-popper')}>
                        {history.length > 1 && <Header title={'Ngôn ngữ'} onBack={handleGoBack} />}
                        <div className={cx('menu-scrollable')}>
                            {current?.map((item, index) => {
                                const isParent = !!item.children;
                                return (
                                    <MenuItem key={index} data={item} onClick={() => handleToSubMenu(isParent, item)} />
                                );
                            })}
                        </div>
                    </PopperWrapper>
                </div>
            )}
            onHide={() => {
                setHistory((prev) => prev.slice(0, 1));
            }}
        >
            {children}
        </HeadlessTippy>
    );
}

Menu.propTypes = {
    items: PropTypes.array,
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func,
};

export default Menu;
