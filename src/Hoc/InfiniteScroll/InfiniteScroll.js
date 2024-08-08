import { useEffect, useRef } from 'react';

function InfiniteScroll({ loadMore, hasMore, endMessage, children }) {
    const endRef = useRef();
    useEffect(() => {
        if (hasMore) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            });
            if (endRef.current) {
                observer.observe(endRef.current);
            }

            return () => {
                if (endRef.current) {
                    observer.unobserve(endRef?.current);
                }
            };
        }
    }, [hasMore]);

    return (
        <>
            {children}
            {hasMore ? <div ref={endRef} id="end-of-page"></div> : endMessage}
        </>
    );
}

export default InfiniteScroll;
