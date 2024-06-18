import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';

import * as request from '~/utils';
import { getAdditionalUserInfo } from 'firebase/auth';
import { auth } from '~/firebase/firebaseConfig';

const loginWithFb = async () => {
    try {
        const provider = new FacebookAuthProvider();
        const response = await signInWithPopup(auth, provider);
        const isNewUser = getAdditionalUserInfo(response).isNewUser;
        const idToken = await auth.currentUser.getIdToken();
        console.log(idToken);
        localStorage.setItem('accessToken', idToken);
        return await request.post('/authentication', {
            uid: response.user.uid,
            fullName: response.user.displayName,
            email: response.user.email,
            nickName: response.user.reloadUserInfo.screenName,
            avatar: response.user.photoURL,
            isNewUser: isNewUser,
        });
    } catch (error) {
        console.log(error);
    }
};

const register = async (payload) => {
    try {
        const res = await request.post('/auth/register', payload);
        return res;
    } catch (error) {
        return error?.response;
    }
};

const login = async (payload) => {
    try {
        const res = await request.post('/auth/login', payload);
        return res;
    } catch (error) {
        return error?.response;
    }
};

const logout = async (refreshToken) => {
    try {
        const res = await request.destroy('/auth/logout', {
            params: { refreshToken },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

const getMe = async () => {
    try {
        const res = await request.get('/auth/me');
        return res.data;
    } catch (error) {
        throw error;
    }
};

const refreshToken = async (payload) => {
    try {
        const res = await request.post('/auth/refresh-token', payload);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export { loginWithFb, register, login, logout, getMe, refreshToken };
