import classNames from 'classnames/bind';
import styles from './Upload.module.scss';

import { UploadWrapper, SelectFile, EditUploadFile } from '~/components/UploadFile';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Upload() {
    const [file, setFile] = useState();
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <UploadWrapper>
                    {file ? (
                        <EditUploadFile data={file && file[0]} onFile={setFile} />
                    ) : (
                        <SelectFile onFile={setFile} />
                    )}
                </UploadWrapper>
            </div>
        </div>
    );
}

export default Upload;
