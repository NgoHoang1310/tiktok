import { useCallback } from 'react';
import { useStore } from '~/hooks';
import { actions } from '~/store';

function useFullScreen() {
    const [state, dispatch] = useStore();
    const { currentVideo } = state;
    const openFullscreen = useCallback((index = 0, currentTime = 0) => {
        dispatch(actions.setCurrentVideo({ ...currentVideo, index: index, currentTime: currentTime }));
        dispatch(actions.setFullscreen(true));
    }, []);

    return openFullscreen;
}

export default useFullScreen;
