import classNames from 'classnames/bind';
import styles from './Discover.module.scss';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '~/components/PlaceHolder/Loading';

import Video from '~/components/PlayVideo/Video';
import * as apiService from '~/services';

const cx = classNames.bind(styles);

const CATEGORIES = [
    {
        name: 'Tất cả',
    },
    {
        name: 'Đời sống',
        keyword: ['doisong', 'doi song', 'đời sống'],
    },
    {
        name: 'Xe cộ',
        keyword: ['xeco', 'xe co', 'xe cộ'],
    },
    {
        name: 'Ca nhạc',
        keyword: ['nhac', 'nhạc', 'nhạc đỏ', 'nhạc cách mạng', 'nhacchill'],
    },
    {
        name: 'Ẩm thực',
        keyword: ['food', 'amthuc'],
    },
    {
        name: 'Gym & Sức khỏe',
        keyword: ['gym', 'thethao', 'fitness', 'workout'],
    },
    {
        name: 'Giáo dục',
        keyword: ['giaoduc', 'edu'],
    },
    {
        name: 'Chuyện drama',
        keyword: ['drama'],
    },
    {
        name: 'Xã hội',
        keyword: ['xahoi', 'social'],
    },
    {
        name: 'Trò chơi',
        keyword: ['game', 'trochoi', 'dientu'],
    },
    {
        name: 'Thể thao',
        keyword: ['sport', 'thethao', 'bongda', 'caulong'],
    },
];

function Discover() {
    const [videos, setVideos] = useState([]);
    const [showArrow, setShowArrow] = useState({ left: false, right: true });
    const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);
    const [page, setPage] = useState(1);
    const categoryRef = useRef();
    const pagination = useRef({});

    const handleFilterByCategory = (category) => {
        setPage(1);
        setVideos([]);
        setCurrentCategory(category);
    };

    useEffect(() => {
        const fetchApi = async () => {
            let res = await apiService.getDiscoverVideos({
                page: page,
                limit: 6,
                sort: 'viewsCount',
                category: currentCategory ? JSON.stringify(currentCategory.keyword) : null,
            });
            pagination.current = res.pagination;
            setVideos((prev) => {
                return [...prev, ...res?.data];
            });
        };
        fetchApi();
    }, [currentCategory, page]);

    const handleArrowClick = (arrow) => {
        const scrollLeft = categoryRef.current.scrollLeft;
        const scrollWidth = categoryRef.current.scrollWidth;
        const clientWidth = categoryRef.current.clientWidth;

        if (arrow === 'right') {
            categoryRef.current.scrollBy({
                top: 0,
                left: 200,
                behavior: 'smooth',
            });
        }
        if (arrow === 'left') {
            categoryRef.current.scrollBy({
                top: 0,
                left: -200,
                behavior: 'smooth',
            });
        }
        setShowArrow({ left: scrollLeft > 0, right: scrollLeft + clientWidth < scrollWidth });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <InfiniteScroll
                    style={{ overflow: 'initial' }}
                    dataLength={videos.length}
                    next={() =>
                        setPage((prev) => {
                            if (pagination.current?.hasNextPage) {
                                return pagination.current?.nextPage;
                            }
                            return prev;
                        })
                    }
                    hasMore={pagination.current?.hasNextPage}
                    loader={
                        <p style={{ textAlign: 'center', marginTop: 48 }}>
                            <Loading style={{ mixBlendMode: 'darken' }} />
                        </p>
                    }
                    endMessage={
                        videos.length > 6 && (
                            <p style={{ textAlign: 'center', marginTop: 48 }}>
                                <b>Bạn đã tải hết video</b> <FontAwesomeIcon color="#58ca50" icon={faCheck} />
                            </p>
                        )
                    }
                >
                    <div className={cx('video-category-container')}>
                        {showArrow['left'] && (
                            <button onClick={() => handleArrowClick('left')} className={cx('arrow', 'arrow-left')}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                        )}
                        <div ref={categoryRef} className={cx('video-category')}>
                            {CATEGORIES.map((category, index) => (
                                <button
                                    onClick={() => handleFilterByCategory(category)}
                                    key={index}
                                    className={cx('category-item', { active: category === currentCategory })}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                        {showArrow['right'] && (
                            <button onClick={() => handleArrowClick('right')} className={cx('arrow', 'arrow-right')}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        )}
                    </div>
                    <div className={cx('video-list')}>
                        {videos?.map((video, index) => {
                            return (
                                <div key={index} className={cx('video-item')}>
                                    <Video
                                        muted
                                        customControl={false}
                                        className={cx('video')}
                                        video={video?.filePath}
                                        preload="metadata"
                                        autoPlay={false}
                                        views={video.viewsCount}
                                    />
                                    <p
                                        className={cx('title')}
                                        dangerouslySetInnerHTML={{ __html: video.description }}
                                    ></p>
                                </div>
                            );
                        })}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default Discover;
