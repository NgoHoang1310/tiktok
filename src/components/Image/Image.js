import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from '~/components/Image/Image.module.scss';
import images from '~/assets/Images';

const cx = classNames.bind(styles);

function Image({ className, rounded, src, fallback = images.imagePlaceholder, ...props }, ref) {
    const [_fallback, setFallback] = useState('');

    const handelFallback = () => {
        setFallback(fallback);
    };

    return (
        <img
            alt="Avatar"
            className={cx('wrapper', { rounded }, className)}
            src={src || _fallback}
            ref={ref}
            {...props}
            onError={handelFallback}
        ></img>
    );
}
forwardRef.propTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
    fallback: PropTypes.string,
};

export default forwardRef(Image);
