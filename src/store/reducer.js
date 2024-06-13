import { SHOW_MODAL, INITIALIZE, USER_LOGIN, USER_LOGOUT } from './constants';

const initial = {
    initialize: true,
    showModal: false,
    isLogin: localStorage.getItem('isLogin') === 'true',
    currentUser: {},
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
        default:
            throw new Error('Invalid!');
    }
};

export { initial };
export default reducer;
