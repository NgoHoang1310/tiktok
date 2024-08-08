import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '~/components/Popper/Popper.module.scss';

const cx = classNames.bind(styles);

function Wrapper({ className, children }) {
    return <div className={cx('wrapper', className)}>{children}</div>;
}
Wrapper.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default Wrapper;
