import { useReducer, useEffect } from 'react';
import Context from './Context';
import { initial } from './reducer';
import { userLogOut, initialize, userLogin } from './actions';
import reducer from './reducer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '~/firebase/firebaseConfig';
function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, initial);
    useEffect(() => {
        const unsubcribed = onAuthStateChanged(auth, async (user) => {
            try {
                const localUser = JSON.parse(localStorage.getItem('persist:auth'));
                if (user && localUser) {
                    console.log('đã đăng nhập');
                    dispatch(userLogin(localUser.currentUser));
                } else {
                    console.log('đã đăng xuất');
                    dispatch(userLogOut());
                    localStorage.clear();
                }
            } catch (error) {
                console.log(error);
                dispatch(userLogOut());
            }
        });

        const timerId = setTimeout(() => {
            dispatch(initialize(false));
        }, 3000);

        return () => {
            clearTimeout(timerId);
            unsubcribed();
        };
    }, []);
    return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>;
}

export default Provider;
