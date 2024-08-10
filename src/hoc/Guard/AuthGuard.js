import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useStore } from '~/hooks';
import { actions } from '~/store';

import config from '~/configs';

function AuthGuard({ children }) {
    const navigate = useNavigate();
    const [state, dispatch] = useStore();
    const { showModal, isLogin } = state;
    useEffect(() => {
        if (!isLogin) {
            dispatch(actions.showModal(showModal));
            return navigate(config.routes.home);
        }
    }, [isLogin]);
    return children;
}
export default AuthGuard;
