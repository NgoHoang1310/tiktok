import {
    SHOW_MODAL,
    INITIALIZE,
    USER_LOGOUT,
    USER_LOGIN,
    AUTO_SCROLL,
    MUTE,
    SET_VOLUME,
    FOLLOWING_USERS,
} from './constants';

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

const autoScroll = (payload) => {
    return {
        type: AUTO_SCROLL,
        payload: payload,
    };
};

const mute = (payload) => {
    return {
        type: MUTE,
        payload: payload,
    };
};
const setVolume = (payload) => {
    return {
        type: SET_VOLUME,
        payload: payload,
    };
};

const followingUsers = (payload) => {
    return {
        type: FOLLOWING_USERS,
        payload: payload,
    };
};
export { showModal, initialize, userLogin, userLogOut, autoScroll, mute, setVolume, followingUsers };
