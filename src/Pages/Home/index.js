import classNames from 'classnames/bind';
import styles from './Home.module.scss';

import PlayVideo from '~/components/PlayVideo';
import * as apiService from '~/services';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
function Home() {
    const [listVideos, setListVideos] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiService.getListVideos();
            setListVideos(res);
        };

        fetchApi();
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                {listVideos && listVideos.map((video, index) => <PlayVideo key={index} data={video} />)}
            </div>
        </div>
    );
}

export default Home;
