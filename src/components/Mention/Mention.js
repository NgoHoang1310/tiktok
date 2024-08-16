import classNames from 'classnames/bind';
import styles from './Mention.module.scss';
import { forwardRef } from 'react';
import { Wrapper } from '../Popper';
import Portal from '../Portal';

const cx = classNames.bind(styles);
function Mention({ children, ...props }, ref) {
    return (
        <Portal>
            <Wrapper ref={ref} className={cx('mention-wrapper')} {...props}>
                {children}
            </Wrapper>
        </Portal>
    );
}

export default forwardRef(Mention);
