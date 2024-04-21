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

export { loginWithFb };
