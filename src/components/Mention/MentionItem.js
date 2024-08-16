import classNames from 'classnames/bind';
import styles from './Mention.module.scss';

const cx = classNames.bind(styles);
function MentionItem({ styles, mention, isNewHashtag = false, onClick }) {
    return (
        <div style={styles} className={cx('mention-item')} key={mention} onClick={onClick}>
            #{mention}
            {isNewHashtag && <span>Thêm</span>}
        </div>
    );
}

export default MentionItem;
