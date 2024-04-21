import { SHOW_MODAL, INITIALIZE, USER_LOGOUT, USER_LOGIN } from './constants';

const showModal = (payload) => {
    return {
        type: SHOW_MODAL,
        payload: payload,
    };
};

const initialize = (payload) => {
    return {
        type: INITIALIZE,
        payload: payload,
    };
};

const userLogin = (payload) => {
    return {
        type: USER_LOGIN,
        payload: payload,
    };
};

const userLogOut = (payload) => {
    return {
        type: USER_LOGOUT,
        payload: payload,
    };
};

export { showModal, initialize, userLogin, userLogOut };
