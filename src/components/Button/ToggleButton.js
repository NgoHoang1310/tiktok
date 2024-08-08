import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

function ToggleButton() {
    const [toggle, setToggle] = useState(false);
    return (
        <div className={cx('toggle-container', { toggle: toggle })} onClick={() => setToggle(!toggle)}>
            <div className={cx('node', { toggle: toggle })}></div>
        </div>
    );
}

export default ToggleButton;
