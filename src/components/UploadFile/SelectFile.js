import classNames from 'classnames/bind';
import styles from './UploadFile.module.scss';
import { Fragment, useRef, useState, useEffect } from 'react';

import Button from '~/components/Button';
import { UploadIcon } from '~/components/Icons';
import CircularWithValueLabel from '~/components/PlaceHolder/CircularProgress/CircularProgress';

const cx = classNames.bind(styles);

function SelectFile({ onFile }) {
    const uploadRef = useRef();
    const [loading, setLoading] = useState(false);

    const handleSelectFile = () => {
        uploadRef.current.click();
    };

    const handleDropFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files) {
            console.log('đã tải file');
            onFile(files);
        }
        uploadRef.current.files = files;
    };

    const handleReadFile = () => {
        setLoading(true);
        if (uploadRef.current.files) {
            setTimeout(() => {
                setLoading(false);
                onFile(uploadRef.current.files);
            }, 3000);
        }
    };
    return (
        <Fragment>
            <input
                className={cx('drag-input')}
                type="file"
                accept="video/*"
                ref={uploadRef}
                onChange={handleReadFile}
            />
            <div
                className={cx('drag-area')}
                onClick={handleSelectFile}
                onDrop={handleDropFile}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
            >
                {!loading ? (
                    <div className={cx('upload-info')}>
                        <span className={cx('icon')}>
                            <UploadIcon />
                        </span>
                        <p className={cx('text-main')}>Chọn video để tải lên</p>
                        <p className={cx('text-sub')}>Hoặc kéo thả tập tin</p>
                        <div className={cx('video-info')}>
                            <p>MP4 hoặc WebM</p>
                            <p>Độ phân giải 720x1280 trở lên</p>
                            <p>Tối đa 10 phút</p>
                            <p>Nhỏ hơn 10 GB</p>
                        </div>
                        <Button className={cx('select-btn')} primary>
                            Chọn tập tin
                        </Button>
                    </div>
                ) : (
                    <div className={cx('loading-holder')}>
                        <CircularWithValueLabel />
                        <p>Đang tải...</p>
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export { SelectFile };
