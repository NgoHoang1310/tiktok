import classNames from 'classnames/bind';
import styles from './Form.module.scss';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import Button from '~/components/Button';
import { Validator } from '~/utils/validation';
import * as apiServices from '~/services';

const cx = classNames.bind(styles);

function Form({ type, onLogin }) {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [nickName, setNickName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleRegister = async () => {
        if (password !== passwordConfirm) return;
        setLoading(true);
        const res = await apiServices.register({ fullName, nickName, email, password });
        if (res?.message === 'CREATED') {
            setLoading(false);
            onLogin(true);
        }
    };

    const handleLogin = async () => {
        if (password !== passwordConfirm) return;
        setLoading(true);
        // console.log('login');
        const res = await apiServices.login({ email, password });
        if (res?.message == 'OK') {
            localStorage.setItem('token', JSON.stringify(res.data));
            localStorage.setItem('isLogin', 'true');
            setLoading(false);
            window.location.reload();
        }
    };

    const handleChange = (e, callback) => {
        callback(e.target.value);
    };

    useEffect(() => {
        Validator({
            form: '#form-1',
            errorSelector: '.form-message',
            formGroupSelector: '.mb-3',
            rules: [
                Validator.isRequire('#formFullName'),
                Validator.isRequire('#formNickName'),
                Validator.isRequire('#formEmail'),
                Validator.isEmail('#formEmail'),
                Validator.isRequire(`#formPassword`),
                Validator.isPassword(`#formPassword`, 6),
                Validator.isRequire(`#formPasswordVerification`),
                Validator.isConfirm(
                    `#formPasswordVerification`,
                    function () {
                        return document.querySelector(`#formPassword`).value;
                    },
                    'Mật khẩu nhập lại không chính xác',
                ),
            ],
            onsubmit: function (data) {},
        });
    }, []);

    return (
        <form className={cx('validation')} id="form-1">
            <div className={cx('form-validation__body')}>
                {type == 'register' && (
                    <>
                        <div className={cx('mb-3')}>
                            <label htmlFor="formFullName" className={cx('form-label')}>
                                Tên đầy đủ
                            </label>
                            <input
                                type="text"
                                className={cx('form-control')}
                                id="formFullName"
                                name="userName"
                                placeholder="VD: Hoàng Ngô"
                                value={fullName}
                                onChange={(e) => handleChange(e, setFullName)}
                            />
                            <span className={cx('form-message')}></span>
                        </div>
                        <div className={cx('mb-3')}>
                            <label htmlFor="formNickName" className={cx('form-label')}>
                                Biệt danh
                            </label>
                            <input
                                type="text"
                                className={cx('form-control')}
                                id="formNickName"
                                name="nickName"
                                placeholder="VD: Hoangutt72"
                                value={nickName}
                                onChange={(e) => handleChange(e, setNickName)}
                            />
                            <span className={cx('form-message')}></span>
                        </div>
                    </>
                )}
                <div className={cx('mb-3')}>
                    <label htmlFor="formEmail" className={cx('form-label')}>
                        Email
                    </label>
                    <input
                        type="email"
                        className={cx('form-control')}
                        id="formEmail"
                        name="email"
                        placeholder="VD: email@domain.com"
                        value={email}
                        onChange={(e) => handleChange(e, setEmail)}
                    />
                    <span className={cx('form-message')}></span>
                </div>
                <div className={cx('mb-3')}>
                    <label htmlFor="formPassword" className={cx('form-label')}>
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        className={cx('form-control')}
                        id="formPassword"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => handleChange(e, setPassword)}
                    />
                    <span className={cx('form-message')}></span>
                </div>
                <div className={cx('mb-3')}>
                    <label htmlFor="formPasswordVerification" className={cx('form-label')}>
                        Xác nhận mật khẩu
                    </label>
                    <input
                        type="password"
                        className={cx('form-control')}
                        id="formPasswordVerification"
                        name="passwordConfirm"
                        placeholder="Xác nhận mật khẩu"
                        value={passwordConfirm}
                        onChange={(e) => handleChange(e, setPasswordConfirm)}
                    />
                    <span className={cx('form-message')}></span>
                    <div className={cx('check-password')}>
                        <input type="checkbox" className={cx('checkbox-btn mb-3')} value="off" />
                        Hiện mật khẩu
                    </div>
                </div>
                <Button
                    type={'button'}
                    primary
                    large
                    onClick={(type == 'login' && handleLogin) || (type == 'register' && handleRegister)}
                >
                    {loading ? (
                        <FontAwesomeIcon className={cx('fetch-loading')} icon={faCircleNotch} />
                    ) : (
                        (type == 'login' && 'Đăng nhập') || (type == 'register' && 'Đăng kí')
                    )}
                </Button>
            </div>
        </form>
    );
}

export default Form;
