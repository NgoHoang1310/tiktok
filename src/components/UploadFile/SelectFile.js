import classNames from 'classnames/bind';
import styles from './UploadFile.module.scss';
import { Fragment, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '~/components/Button';
import { UploadIcon } from '~/components/Icons';
import CircularWithValueLabel from '~/components/PlaceHolder/CircularProgress/CircularProgress';

const cx = classNames.bind(styles);
//Dung lượng cao nhất 1GB
const MAX_SIZE_FILE = 1073741824;

function SelectFile({ onFile }) {
    const uploadRef = useRef();
    const [loading, setLoading] = useState(false);
    const handleSelectFile = () => {
        uploadRef.current.click();
    };

    const checkValidFile = (file, conditions) => {
        let isFileValid = file && file.type === conditions['type'] && file.size <= conditions['size'];
        return isFileValid;
    };

    const handleDropFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        const isFileValid = checkValidFile(files[0], { type: 'video/mp4', size: MAX_SIZE_FILE });

        if (isFileValid) {
            onFile(files);
            uploadRef.current.files = files;
        } else {
            toast('File video không hợp lệ. Vui lòng kiểm tra lại định dạng hoặc kích cỡ !');
        }
    };

    const handleReadFile = () => {
        setLoading(true);
        const isFileValid = checkValidFile(uploadRef.current.files[0], { type: 'video/mp4', size: MAX_SIZE_FILE });
        if (isFileValid) {
            onFile(uploadRef.current.files);
        } else {
            toast('File video không hợp lệ. Vui lòng kiểm tra lại định dạng hoặc kích cỡ !');
        }
        setLoading(false);
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
                            <p>MP4</p>
                            <p>Độ phân giải 720x1280 trở lên</p>
                            <p>Tối đa 10 phút</p>
                            <p>Nhỏ hơn 1 GB</p>
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
