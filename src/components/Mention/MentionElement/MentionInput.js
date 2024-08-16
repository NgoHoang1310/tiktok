import MentionElement from './MentionElement';
const MentionInput = (props) => {
    const { attributes, children, element } = props;
    switch (element.type) {
        case 'users':
            return <MentionElement type={'users'} {...props} />;
        case 'hashtags':
            return <MentionElement type={'hashtags'} {...props} />;
        default:
            return <div {...attributes}>{children}</div>;
    }
};

export default MentionInput;
