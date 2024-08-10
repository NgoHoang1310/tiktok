import { useEffect, useContext } from 'react';
import * as apiService from '~/services';
import { useStore } from '~/hooks';
import { actions } from '~/store';
import { VideoContext } from '~/hoc/Provider/VideoProvider';

function useFollow(userId, initial) {
    const [state, dispatch] = useStore();
    const { follow, setFollow } = useContext(VideoContext);
    const { isLogin, showModal } = state;

    useEffect(() => {
        if (isLogin && userId)
            setFollow((prev) => {
                return { ...prev, [userId]: initial };
            });
    }, [isLogin]);

    const handleFollow = async () => {
        if (isLogin) {
            if (follow[userId]) {
                await apiService.unfollowAUser(userId);
                setFollow((prev) => {
                    return { ...prev, [userId]: false };
                });
            } else {
                await apiService.followAUser(userId);
                setFollow((prev) => {
                    return { ...prev, [userId]: true };
                });
            }
            return;
        }
        dispatch(actions.showModal(showModal));
    };

    return [follow[userId], handleFollow];
}

export default useFollow;
