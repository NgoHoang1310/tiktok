import {
    SHOW_MODAL,
    INITIALIZE,
    USER_LOGOUT,
    USER_LOGIN,
    VIDEOS,
    AUTO_SCROLL,
    MUTE,
    SET_VOLUME,
    FOLLOWING_USERS,
    SET_FULLSCREEN,
    SET_CURRENT_VIDEO,
    SET_FOLLOW,
    SET_REACTIONS,
    SET_REACTIONS_COUNT,
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

const setVideos = (payload) => {
    return {
        type: VIDEOS,
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

const setFullscreen = (payload) => {
    return {
        type: SET_FULLSCREEN,
        payload: payload,
    };
};

const setCurrentVideo = (payload) => {
    return {
        type: SET_CURRENT_VIDEO,
        payload: payload,
    };
};

const setFollow = (payload) => {
    return {
        type: SET_FOLLOW,
        payload: payload,
    };
};

const setReactions = (payload) => {
    return {
        type: SET_REACTIONS,
        payload: payload,
    };
};

const setReactionsCount = (payload) => {
    return {
        type: SET_REACTIONS_COUNT,
        payload: payload,
    };
};
export {
    showModal,
    initialize,
    userLogin,
    userLogOut,
    autoScroll,
    mute,
    setVolume,
    followingUsers,
    setFullscreen,
    setCurrentVideo,
    setVideos,
    setFollow,
    setReactions,
    setReactionsCount,
};
