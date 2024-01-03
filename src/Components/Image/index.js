import { forwardRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from '~/Components/Image/Image.module.scss';
import images from '~/Assets/Images';

const cx = classNames.bind(styles);

function Image(
    { className, src, fallback = images.imagePlaceholder, ...props },
    ref,
) {
    const [_fallback, setFallback] = useState('');

    const hanldeFallback = () => {
        setFallback(fallback);
    };

    return (
        <img
            className={cx('wrapper', className)}
            src={_fallback || src}
            ref={ref}
            {...props}
            onError={hanldeFallback}
        />
    );
}

export default forwardRef(Image);
