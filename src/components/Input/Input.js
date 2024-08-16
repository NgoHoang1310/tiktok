import classNames from 'classnames/bind';
import styles from './Input.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function Input({ type, title, value, onChange, disabled = false, ...props }) {
    return (
        <div className={cx('wrapper')}>
            <label className={cx('title')}>{title}</label>
            <div className={cx('input')}>
                <input
                    disabled={disabled}
                    type={type}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                    {...props}
                />
            </div>
        </div>
    );
}

Input.propTypes = {
    type: PropTypes.string.isRequired,
    title: PropTypes.string,
};

export default Input;
