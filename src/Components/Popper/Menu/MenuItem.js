import classNames from 'classnames/bind';
import styles from '~/Components/Popper/Menu/Menu.module.scss';
import Button from '~/Components/Button';
const cx = classNames.bind(styles);

function MenuItem({ data, onClick }) {
    return (
        <Button
            className={cx('item', { separate: data.separate })}
            to={data.to}
            leftIcon={data.icon}
            onClick={onClick}
        >
            {data.title}
        </Button>
    );
}

export default MenuItem;
