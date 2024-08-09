import classNames from 'classnames/bind';
import styles from './Input.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function Input({ type, title, value, onInput }) {
    return (
        <div className={cx('wrapper')}>
            <label className={cx('title')}>{title}</label>
            <div className={cx('input')}>
                <input
                    type={type}
                    value={value}
                    onInput={(e) => {
                        onInput(e.target.value);
                    }}
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
