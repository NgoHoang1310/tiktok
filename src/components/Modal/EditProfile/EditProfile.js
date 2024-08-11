import classNames from 'classnames/bind';
import styles from './EditProfile.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import Image from '~/components/Image';
import Button from '~/components/Button';

import * as apiService from '~/services';

const cx = classNames.bind(styles);
function EditProfile({ onSetModal, data }) {
    const [tiktokID, setTiktokID] = useState(data.tiktokID);
    const [nickName, setNickName] = useState(data.nickName);
    const [bio, setBio] = useState(data.bio);
    const [avatar, setAvatar] = useState('');
    const [isChanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [wordsCount, setWordsCount] = useState(() => {
        return data.bio ? data.bio.length : 0;
    });
    const [isExceeded, setIsExceeded] = useState(false);

    const handleInputChange = (e, callback) => {
        setIsExceeded(false);
        if (e.target.value.length > 80) {
            setIsExceeded(true);
        }
        setWordsCount(e.target.value.length);
        callback(e.target.value);
    };

    const handleSubmit = async () => {
        const updateProfile = {};
        setLoading(true);
        if (avatar) updateProfile.file = avatar;
        if (bio) updateProfile.bio = bio;
        if (tiktokID) updateProfile.tiktokID = tiktokID;
        if (nickName) updateProfile.nickName = nickName;

        const res = await apiService.updateProfile(data._id, updateProfile);

        if (res.status === 200 && Object.keys(res.data).length !== 0) {
            setLoading(false);
            toast('Cập nhập thành công !');
            setTimeout(() => {
                window.location.reload();
            }, 800);
            return;
        }
        setLoading(false);
        toast('Có lỗi xảy ra. Vui lòng thử lại !');
    };

    const handleChangeAvatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            file.preview = URL.createObjectURL(file);
            setAvatar(file);
        }
    };

    useEffect(() => {
        let isNotNull = tiktokID?.length > 1 && nickName?.length > 1;
        let isUpdated = tiktokID !== data.tiktokID || nickName !== data.nickName || bio !== data.bio || avatar?.preview;
        if (isNotNull && isUpdated) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    }, [tiktokID, nickName, bio, avatar]);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(avatar.preview);
        };
    }, [avatar]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header', 'fs-1')}>Sửa hồ sơ</div>
            <div className={cx('break-bar')}></div>
            <div className={cx('content')}>
                <div className={cx('row')}>
                    <div className={cx('left-part', 'col-3')}>Ảnh hồ sơ</div>
                    <div className={cx('right-part', ' col-9 d-flex justify-content-center')}>
                        <Image src={avatar.preview || data.avatar} className={cx('avatar')} />
                        <label htmlFor="image">
                            <div>
                                <FontAwesomeIcon icon={faEdit} />
                                <input
                                    onChange={handleChangeAvatar}
                                    className={cx('image-input')}
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                />
                            </div>
                        </label>
                    </div>
                </div>
                <div className={cx('break-bar')}></div>
                <div className={cx('row')}>
                    <div className={cx('left-part', 'col-3')}>Tiktok ID</div>
                    <div className={cx('right-part', ' col-9 d-flex flex-column')}>
                        <input
                            onChange={(e) => handleInputChange(e, setTiktokID)}
                            value={tiktokID}
                            placeholder="Tiktok ID"
                            className={cx('input-text')}
                        />
                        <p className={cx('notice-label', 'mt-4')}>www.tiktok.com/@{tiktokID}</p>
                        <p className={cx('notice-label', 'mt-3')}>
                            TikTok ID chỉ có thể bao gồm chữ cái, chữ số, dấu gạch dưới và dấu chấm. Khi thay đổi TikTok
                            ID, liên kết hồ sơ của bạn cũng sẽ thay đổi.
                        </p>
                    </div>
                </div>
                <div className={cx('break-bar')}></div>
                <div className={cx('row')}>
                    <div className={cx('left-part', 'col-3')}>Tên</div>
                    <div className={cx('right-part', ' col-9 d-flex flex-column')}>
                        <input
                            onChange={(e) => handleInputChange(e, setNickName)}
                            value={nickName}
                            placeholder="Tên"
                            className={cx('input-text')}
                        />
                        <p className={cx('notice-label', 'mt-3')}>Bạn chỉ có thể thay đổi biệt danh 7 ngày một lần.</p>
                    </div>
                </div>
                <div className={cx('break-bar')}></div>
                <div className={cx('row')}>
                    <div className={cx('left-part', 'col-3')}>Tiểu sử</div>
                    <div className={cx('right-part', ' col-9 d-flex flex-column')}>
                        <textarea
                            onChange={(e) => handleInputChange(e, setBio)}
                            value={bio}
                            spellCheck={false}
                            className={cx('area-text', { ['danger-border']: isExceeded })}
                        ></textarea>
                        <p className={cx('notice-label', 'mt-3')}>{wordsCount}/80</p>
                    </div>
                </div>
            </div>
            <div className={cx('break-bar')}></div>
            <div className={cx('footer', 'fs-1 d-flex justify-content-end')}>
                <Button onClick={() => onSetModal(false)} simple>
                    Hủy
                </Button>
                <Button onClick={handleSubmit} primary disabled={isExceeded || !isChanged}>
                    {loading ? <FontAwesomeIcon className={cx('fetch-loading')} icon={faCircleNotch} /> : 'Lưu'}
                </Button>
            </div>
        </div>
    );
}

export default EditProfile;
