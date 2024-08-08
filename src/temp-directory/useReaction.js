import { useState, useEffect, useContext } from 'react';
import * as apiService from '~/services';
import { useStore } from '~/hooks';
import { actions } from '~/store';

import { VideoContext } from '~/hoc/Provider/VideoProvider';

function useReaction(videoId, initial, count) {
    const [state, dispatch] = useStore();
    const { reactions, setReactions, reactionsCount, setReactionsCount } = useContext(VideoContext);
    const { isLogin, showModal } = state;

    useEffect(() => {
        if (isLogin && videoId) {
            setReactions((prev) => {
                return { ...prev, [videoId]: initial };
            });
        }
    }, []);

    useEffect(() => {
        if (Object.keys(count).length !== 0 && videoId) {
            setReactionsCount((prev) => {
                return { ...prev, [videoId]: count };
            });
        }
    }, []);

    const handleReactions = async (type) => {
        if (isLogin) {
            if (reactions[videoId][type]) {
                await apiService.retrieveReaction({
                    reactableType: 'Video',
                    reactableId: videoId,
                    reactionType: type,
                });
                setReactions((prev) => {
                    return { ...prev, [videoId]: { ...prev[videoId], [type]: false } };
                });
                setReactionsCount((prev) => {
                    return { ...prev, [videoId]: { ...prev[videoId], [type]: prev[videoId][type] - 1 } };
                });
            } else {
                await apiService.postReaction({
                    reactableType: 'Video',
                    reactableId: videoId,
                    reactionType: type,
                });
                setReactions((prev) => {
                    return { ...prev, [videoId]: { ...prev[videoId], [type]: true } };
                });
                setReactionsCount((prev) => {
                    return { ...prev, [videoId]: { ...prev[videoId], [type]: prev[videoId][type] + 1 } };
                });
            }
            return;
        }
        dispatch(actions.showModal(showModal));
    };

    return [reactions[videoId], reactionsCount[videoId], handleReactions];
}

export default useReaction;
