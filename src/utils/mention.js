import { Editor, Transforms, Range, createEditor, Descendant } from 'slate';

const insertMention = (editor, character, type) => {
    const mention = {
        type: type,
        character,
        children: [{ text: '' }],
    };
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
};

const withMentions = (editor) => {
    const { isInline, isVoid, markableVoid } = editor;

    editor.isInline = (element) => {
        return element.type === 'users' || element.type === 'hashtags' ? true : isInline(element);
    };

    editor.isVoid = (element) => {
        return element.type === 'users' || element.type === 'hashtags' ? true : isVoid(element);
    };

    editor.markableVoid = (element) => {
        return element.type === 'users' || element.type === 'hashtags' || markableVoid(element);
    };

    return editor;
};

const detectMention = (editor, type) => {
    const { selection } = editor;
    let regrex = type === 'users' ? /^@(\w+)$/ : /^#(\w+)$/;
    if (selection && Range.isCollapsed(selection)) {
        const [start] = Range.edges(selection);
        const wordBefore = Editor.before(editor, start, { unit: 'word' });
        const before = wordBefore && Editor.before(editor, wordBefore);
        const beforeRange = before && Editor.range(editor, before, start);
        const beforeText = beforeRange && Editor.string(editor, beforeRange);
        const beforeMatch = beforeText && beforeText.match(regrex);
        const after = Editor.after(editor, start);
        const afterRange = Editor.range(editor, start, after);
        const afterText = Editor.string(editor, afterRange);
        const afterMatch = afterText.match(/^(\s|$)/);

        if (beforeMatch && afterMatch) {
            return {
                target: beforeRange,
                search: beforeMatch[1],
                index: 0,
            };
        }
    }
    return null;
};

const slateToText = (editor) => {
    let hashtags = [];
    let text = editor.children[0].children
        .map((child) => {
            if (child.type && child.type === 'hashtags') {
                hashtags.push(child.character);
                return `<a href="/tag/${child.character}" class="hashtags">#${child.character}</a>`;
            }
            return child.text;
        })
        .join('');
    return { text, hashtags };
};

export { insertMention, withMentions, detectMention, slateToText };
