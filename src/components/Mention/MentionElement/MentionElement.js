import { useSelected, useFocused } from 'slate-react';

const MentionElement = ({ attributes, children, element, type }) => {
    const selected = useSelected();
    const focused = useFocused();
    // See if our empty text child has any styling marks applied and apply those
    // if (element.children[0].bold) {
    //     style.fontWeight = 'bold';
    // }
    // if (element.children[0].italic) {
    //     style.fontStyle = 'italic';
    // }
    return (
        <span
            {...attributes}
            contentEditable={false}
            data-cy={`mention-${element.character.replace(' ', '-')}`}
            className={type}
        >
            <>
                {type === 'users' ? '@' : '#'}
                {element.character}
                {children}
            </>
        </span>
    );
};

export default MentionElement;
