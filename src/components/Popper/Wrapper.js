import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { forwardRef } from 'react';
import styles from '~/components/Popper/Popper.module.scss';

const cx = classNames.bind(styles);

const Wrapper = forwardRef(function Wrapper({ className, children, ...props }, ref) {
    return (
        <div ref={ref} className={cx('wrapper', className)} {...props}>
            {children}
        </div>
    );
});

Wrapper.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default Wrapper;
