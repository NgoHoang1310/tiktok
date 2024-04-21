import classNames from 'classnames/bind';
import styles from './Following.module.scss';

import PlayVideo from '~/components/PlayVideo';

const cx = classNames.bind(styles);

function Following() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                {/* <PlayVideo /> */}
                {/* <PlayVideo /> */}
            </div>
        </div>
    );
}

export default Following;
