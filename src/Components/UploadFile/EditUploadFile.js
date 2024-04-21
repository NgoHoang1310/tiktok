import { Fragment, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './UploadFile.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faMusic, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import videoframesMin from 'video-frames';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import { SelectFile } from './SelectFile';
import Input from '~/components/Input';
import Button, { ToggleButton } from '~/components/Button';
import Video from '~/components/PlayVideo/Video';
import MobilePreview from './MobilePreview';

import { useStore } from '~/hooks';
import * as apiService from '~/services';

const cx = classNames.bind(styles);

const VIEWABLE_LIST = [
    {
        title: 'Công khai',
        value: 'public',
    },
    {
        title: 'Riêng tư',
        value: 'private',
    },
    {
        title: 'Bạn bè',
        value: 'friend',
    },
];

const ALLOWS = [
    {
        title: 'Comment',
        value: 'comment',
    },
    {
        title: 'Duet',
        value: 'duet',
    },
];

function EditUploadFile({ data, onFile }) {
    const [state] = useStore();
    const { currentUser } = state;

    const frameChooseRef = useRef();
    const frameVideoRef = useRef();
    const [loading, setLoading] = useState(false);
    const [showViewable, setShowViewable] = useState(false);
    const [viewable, setViewable] = useState(VIEWABLE_LIST[0]);
    const [allows, setAllows] = useState(['comment']);
    const [videoNote, setVideoNote] = useState(data?.name);
    const [frames, setFrames] = useState([]);
    const [videoThumb, setVideoThumb] = useState();

    useEffect(() => {
        videoframesMin({
            url: URL.createObjectURL(data),
            count: 8,
        }).then((frames) => setFrames(frames));
    }, []);

    useEffect(() => {
        handleChooseFrame();
    }, [frames]);

    const handleCancel = () => {
        onFile('');
    };

    const handleChooseFrame = () => {
        const minPos = 0,
            maxPos = 599;
        let pos1 = 0,
            pos2 = 0,
            videoProgress = 0;
        frameChooseRef.current.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos2 = e.clientX;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos2 - e.clientX;
            pos2 = e.clientX;
            // set the element's new position:
            videoProgress = ((frameChooseRef.current.offsetLeft - pos1) / 600) * frameVideoRef.current.duration;
            if (
                frameChooseRef.current.offsetLeft - pos1 <= minPos ||
                frameChooseRef.current.offsetLeft - pos1 > maxPos
            ) {
                return;
            }
            frameChooseRef.current.style.left = frameChooseRef.current.offsetLeft - pos1 + 'px';
            frameVideoRef.current.currentTime = videoProgress;
        }
        function closeDragElement() {
            setVideoThumb(frames[Math.floor(videoProgress)]?.image);
            document.onmouseup = null;
            document.onmousemove = null;
        }
    };

    const handleCheck = (value) => {
        setAllows((prev) => {
            const isChecked = allows.includes(value);
            if (isChecked) {
                return allows.filter((item) => item !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const res = await apiService.uploadVideo({
            uid: currentUser.uid,
            description: videoNote,
            viewable: viewable.value,
            allows,
            filePath: data,
            thumbPath: videoThumb,
        });
        if (res) {
            setLoading(false);
            onFile('');
        }
    };

    return (
        <Fragment>
            <div className={cx('header')}>
                <h3>Tải video lên</h3>
                <p>Đăng video vào tài khoản của bạn</p>
            </div>
            <div className={cx('content')}>
                <div className={cx('select-file')}>
                    {data ? (
                        <div className={cx('mobile-preview')}>
                            <MobilePreview data={data} currentUser={currentUser} />
                            <div className={cx('mobile-video-info')}>
                                <span>@{currentUser?.fullName}</span>
                                <p>{videoNote}</p>
                                <div>
                                    <FontAwesomeIcon icon={faMusic} />
                                    <p>{currentUser?.fullName}-Âm thanh gốc</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <SelectFile />
                    )}
                </div>
                <div className={cx('edit-info')}>
                    <div className={cx('video-info')}>
                        <Input value={videoNote} title="Chú thích" type="option" onInput={setVideoNote} />
                    </div>
                    <div className={cx('video-info')}>
                        <div className={cx('video-thumb')}>
                            <label className={cx('title')}>Ảnh bìa</label>
                            <div className={cx('thumb-timeline')}>
                                {frames &&
                                    frames.map((frame, index) => (
                                        <div
                                            key={index}
                                            className={cx('frame-image')}
                                            style={{ backgroundImage: `url(${frame.image})` }}
                                        ></div>
                                    ))}
                                <div ref={frameChooseRef} className={cx('frame-chose')}>
                                    <Video ref={frameVideoRef} video={data} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('video-info')}>
                        <div className={cx('video-rule')}>
                            <label className={cx('title')}>Ai có thể xem video này</label>
                            <HeadlessTippy
                                interactive
                                visible={showViewable}
                                placement="bottom-start"
                                render={(attrs) => (
                                    <div className={cx('viewable-options')} tabIndex={-1} {...attrs}>
                                        <PopperWrapper>
                                            {VIEWABLE_LIST?.map((option, index) => (
                                                <div
                                                    key={index}
                                                    className={cx('item', {
                                                        selected: viewable.value === option.value,
                                                    })}
                                                    onClick={() => {
                                                        setViewable(option);
                                                        setShowViewable(false);
                                                    }}
                                                >
                                                    {option.title}
                                                </div>
                                            ))}
                                        </PopperWrapper>
                                    </div>
                                )}
                                onClickOutside={() => setShowViewable(false)}
                            >
                                <div className={cx('video-viewable')} onClick={() => setShowViewable(!showViewable)}>
                                    <span>{viewable.title}</span>
                                    <span className={cx('drop-icon', { rotate: showViewable })}>
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </span>
                                </div>
                            </HeadlessTippy>
                        </div>
                    </div>
                    <div className={cx('video-info')}>
                        <div className={cx('video-allow')}>
                            <label className={cx('title')}>Cho phép người dùng</label>
                            <div className={cx('checkbox-options')}>
                                {ALLOWS.map((allow, index) => (
                                    <div key={index} className={cx('checkbox-btn')}>
                                        <input
                                            checked={allows.includes(allow.value)}
                                            onChange={() => handleCheck(allow.value)}
                                            type="checkbox"
                                        />
                                        <span>{allow.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={cx('video-info')}>
                        <div className={cx('video-other-setting')}>
                            <label className={cx('title')}>Lên lịch cho video</label>
                            <div className={cx('toggle-btn')}>
                                <ToggleButton />
                            </div>
                        </div>
                    </div>
                    <div className="action-btn">
                        <Button simple onClick={handleCancel}>
                            Hủy bỏ
                        </Button>
                        <Button primary onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <FontAwesomeIcon className={cx('fetch-loading')} icon={faCircleNotch} />
                            ) : (
                                'Đăng'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export { EditUploadFile };
