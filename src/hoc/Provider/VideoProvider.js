import { createContext, useState } from 'react';
export const VideoContext = createContext();

function VideoProvider({ children }) {
    const [currentVideo, setCurrentVideo] = useState({ index: 0, currentTime: 0 });
    const [follow, setFollow] = useState({});
    const [reactions, setReactions] = useState({});
    const [reactionsCount, setReactionsCount] = useState({});

    const value = {
        follow,
        setFollow,
        reactions,
        setReactions,
        reactionsCount,
        setReactionsCount,
        currentVideo,
        setCurrentVideo,
    };
    return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}

export default VideoProvider;
