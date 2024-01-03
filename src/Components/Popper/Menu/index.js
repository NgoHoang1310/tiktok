import classNames from 'classnames/bind';
import styles from '~/Components/Popper/Menu/Menu.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import MenuItem from './MenuItem';
import { Wrapper as PopperWrapper } from '~/Components/Popper';
import Header from './Header';
import { useState } from 'react';

const cx = classNames.bind(styles);
const DefaultFunction = () => {};

function Menu({ items = [], children, onChange = DefaultFunction }) {
    const [history, setHistory] = useState([{ data: items }]);

    const current = history[history.length - 1].data;

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
            render={(attrs) => (
                <div className={cx('menu-items')} tabIndex={-1} {...attrs}>
                    <PopperWrapper className={cx('menu-popper')}>
                        {history.length > 1 && (
                            <Header title={'Ngôn ngữ'} onBack={handleGoBack} />
                        )}
                        {current &&
                            current.map((item, index) => {
                                const isParent = !!item.children;

                                return (
                                    <MenuItem
                                        key={index}
                                        data={item}
                                        onClick={() =>
                                            handleToSubMenu(isParent, item)
                                        }
                                    />
                                );
                            })}
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

export default Menu;
