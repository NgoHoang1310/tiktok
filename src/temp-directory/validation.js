import classNames from 'classnames/bind';
import styles from '~/components/Authentication/Form/Form.module.scss';

const cx = classNames.bind(styles);

function Validator(options) {
    //lấy thẻ cha
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var getElementForm = document.querySelector(options.form);
    var selectorRules = {};
    //xử lí báo lỗi
    function validate(inputElement, rule) {
        var rules = selectorRules[rule.selector];
        var errorMessage;
        var getMessage = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            getMessage.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add(cx('invalid'));
        } else {
            getMessage.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove(cx('invalid'));
        }
        //xử lí khi người dùng nhập
        inputElement.oninput = function () {
            getMessage.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove(cx('invalid'));
        };
        return !errorMessage;
    }

    if (getElementForm) {
        //xử lí nút submit
        getElementForm.onsubmit = function (e) {
            e.preventDefault();
            var isFormValid = true;
            options.rules.forEach(function (rule) {
                var inputElement = getElementForm.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                if (typeof options.onsubmit === 'function') {
                    var isEnable = getElementForm.querySelectorAll('[name]');
                    var formValue = Array.from(isEnable).reduce(function (value, input) {
                        value[input.name] = input.value;
                        return value;
                    }, {});
                    options.onsubmit(formValue);
                }
            }
        };

        options.rules.forEach(function (rule) {
            //xử lí lấy ra tất cả các rule của mỗi trường
            var inputElement = getElementForm.querySelector(rule.selector);
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };
            }
        });
    }
    //xử lí nút hiện mật khẩu
    var showMessage = document.querySelector('.checkbox-btn');
    showMessage.onclick = function () {
        if (!showMessage.checked) {
            document.querySelector('#formPassword').type = 'password';
            document.querySelector('#formPasswordVerification').type = 'password';
        } else {
            document.querySelector('#formPassword').type = 'Text';
            document.querySelector('#formPasswordVerification').type = 'Text';
        }
    };
}

//kiểm tra tên
Validator.isRequire = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Vui lòng nhập trường này';
        },
    };
};

//kiểm tra email
Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regux = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regux.test(value) ? undefined : message || 'Email không hợp lệ';
        },
    };
};
//kiểm tra mật khẩu
Validator.isPassword = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
        },
    };
};

//kiểm tra xác thực mật khẩu
Validator.isConfirm = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value == getConfirmValue() ? undefined : message || 'Dữ liệu nhập lại không chính xác';
        },
    };
};

export { Validator };
