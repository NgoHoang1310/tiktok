import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '~/components/Popper/Menu/Menu.module.scss';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

function MenuItem({ data, onClick }) {
    return (
        <Button
            className={cx('item', { separate: data.separate })}
            to={data.to ? data.to : `/@${JSON.parse(localStorage.getItem('currentUser'))?.tiktokID}`}
            leftIcon={data.icon}
            onClick={onClick}
        >
            {data.title}
        </Button>
    );
}

MenuItem.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,
};

export default MenuItem;
