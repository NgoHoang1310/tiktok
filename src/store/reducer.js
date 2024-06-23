import { followingUsers } from './actions';
import {
    SHOW_MODAL,
    INITIALIZE,
    USER_LOGIN,
    USER_LOGOUT,
    AUTO_SCROLL,
    MUTE,
    SET_VOLUME,
    FOLLOWING_USERS,
} from './constants';

const initial = {
    initialize: true,
    showModal: false,
    isLogin: localStorage.getItem('isLogin') === 'true',
    currentUser: {},
    isAutoScroll: false,
    isMute: false,
    volume: 50,
    followingUsers: [],
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
        default:
            throw new Error('Invalid!');
    }
};

export { initial };
export default reducer;
