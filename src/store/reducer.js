import {
    SHOW_MODAL,
    INITIALIZE,
    USER_LOGIN,
    VIDEOS,
    USER_LOGOUT,
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

const initial = {
    initialize: true,
    showModal: false,
    isLogin: localStorage.getItem('isLogin') === 'true',
    currentUser: {},
    currentVideo: { index: 0, currentTime: 0 },
    videos: [],
    isAutoScroll: false,
    isMute: false,
    volume: 50,
    followingUsers: [],
    reactions: {},
    reactionsCount: {},
    follow: {},
    isFullScreen: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case SHOW_MODAL: {
            return {
                ...state,
                showModal: !action.payload,
            };
        }

        case INITIALIZE: {
            return {
                ...state,
                initialize: action.payload,
            };
        }

        case USER_LOGIN: {
            return {
                ...state,
                isLogin: true,
                currentUser: action.payload,
            };
        }

        case USER_LOGOUT: {
            return {
                ...state,
                isLogin: false,
                currentUser: null,
            };
        }
        case AUTO_SCROLL: {
            return {
                ...state,
                isAutoScroll: action.payload,
            };
        }

        case MUTE: {
            return {
                ...state,
                isMute: action.payload,
            };
        }

        case SET_VOLUME: {
            return {
                ...state,
                volume: action.payload,
            };
        }
        case FOLLOWING_USERS: {
            return {
                ...state,
                followingUsers: action.payload,
            };
        }

        case SET_FULLSCREEN: {
            return {
                ...state,
                isFullScreen: action.payload,
            };
        }

        case SET_CURRENT_VIDEO: {
            return {
                ...state,
                currentVideo: action.payload,
            };
        }

        case VIDEOS: {
            return {
                ...state,
                videos: action.payload,
            };
        }
        case SET_FOLLOW: {
            return {
                ...state,
                follow: action.payload,
            };
        }
        case SET_REACTIONS: {
            return {
                ...state,
                reactions: action.payload,
            };
        }
        case SET_REACTIONS_COUNT: {
            return {
                ...state,
                reactionsCount: action.payload,
            };
        }
        default:
            throw new Error('Invalid!');
    }
};

export { initial };
export default reducer;
