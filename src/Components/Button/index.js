import classNames from "classnames/bind";
import styles from './Button.module.scss';
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary = false,
    outline = false,
    simple = false,
    rounded = false,
    small = false,
    large = false,
    disabled = false,
    leftIcon = false,
    rightIcon = false,
    className,
    children,
    onClick,
    ...passProps
}) {
    let Component = 'button';
    const classes = cx('wrapper', {
        primary,
        outline,
        simple,
        rounded,
        small,
        large,
        leftIcon,
        rightIcon,
        disabled,
        [className]: className
    });

    const props = {
        onClick,
        ...passProps
    };

    if (disabled) {
        delete props.onClick;
    }

    if (to) {
        props.to = to;
        Component = Link;
    } else if (href) {
        props.href = href;
        Component = 'a';
    }

    return (
        <Component className={classes} {...props} >
            {leftIcon && <span className={cx('icon')} >{leftIcon}</span>}
            <span className={cx('title')} > {children}</span>
            {rightIcon && <span className={cx('icon')} >{rightIcon}</span>}
        </Component>
    );
}

export default Button;