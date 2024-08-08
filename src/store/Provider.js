import { useReducer, useEffect, useState } from 'react';

import Context from './Context';
import { initial } from './reducer';
import { initialize, userLogin, userLogOut } from './actions';
import reducer from './reducer';
import { toast } from 'react-toastify';
import * as apiServices from '~/services';
function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, initial);
    useEffect(() => {
        (async () => {
            try {
                let token = JSON.parse(localStorage.getItem('token'));
                if (!token?.accessToken) {
                    dispatch(initialize(false));
                    dispatch(userLogOut());
                    return;
                }
                const user = await apiServices.getMe();
                if (user) {
                    dispatch(userLogin(user));
                    dispatch(initialize(false));
                }
            } catch (error) {
                if (error?.response?.status === 403) {
                    dispatch(initialize(false));
                    dispatch(userLogOut());
                    toast('Phiên đăng nhập hết hạn !');
                }
            }
        })();
    }, []);
    return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>;
}

export default Provider;
