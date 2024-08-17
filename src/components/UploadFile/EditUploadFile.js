import { Fragment, useCallback, useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './UploadFile.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faMusic, faCircleNotch, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator';
import { Transforms, Range, createEditor, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, Editable, withReact } from 'slate-react';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import { SelectFile } from './SelectFile';
import Button, { ToggleButton } from '~/components/Button';
import Video from '~/components/PlayVideo/Video';
import MobilePreview from './MobilePreview';
import Mention from '../Mention';
import MentionItem from '../Mention/MentionItem';
import MentionInput from '../Mention/MentionElement/MentionInput';
import { detectMention, withMentions, insertMention, slateToText } from '~/utils/mention';

import { useStore, useDebounce } from '~/hooks';
import * as apiService from '~/services';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
const MAX_THUMBNAIL = 8;

const VIEWABLE_LIST = [
    {
        title: 'Công khai',
        value: 'public',
    },
    {
        title: 'Riêng tư',
        value: 'private',
    },
    {
        title: 'Bạn bè',
        value: 'friend',
    },
];

const ALLOWS = [
    {
        title: 'Comment',
        value: 'comment',
    },
    {
        title: 'Duet',
        value: 'duet',
    },
];

const CHARACTERS = [
    'Aayla Secura',
    'Adi Gallia',
    'Admiral Dodd Rancit',
    'Admiral Firmus Piett',
    'Admiral Gial Ackbar',
    'Admiral Ozzel',
    'Admiral Raddus',
    'Admiral Terrinald Screed',
    'Admiral Trench',
    'Admiral U.O. Statura',
    'Agen Kolar',
    'Agent Kallus',
    'Aiolin and Morit Astarte',
    'Aks Moe',
    'Almec',
    'Alton Kastle',
    'Amee',
    'AP-5',
    'Armitage Hux',
    'Artoo',
    'Arvel Crynyd',
    'Asajj Ventress',
    'Aurra Sing',
    'AZI-3',
    'Bala-Tik',
    'Barada',
    'Bargwill Tomder',
    'Baron Papanoida',
    'Barriss Offee',
    'Baze Malbus',
    'Bazine Netal',
    'BB-8',
    'BB-9E',
    'Ben Quadinaros',
    'Berch Teller',
    'Beru Lars',
    'Bib Fortuna',
    'Biggs Darklighter',
    'Black Krrsantan',
    'Bo-Katan Kryze',
    'Boba Fett',
    'Bobbajo',
    'Bodhi Rook',
    'Borvo the Hutt',
    'Boss Nass',
    'Bossk',
    'Breha Antilles-Organa',
    'Bren Derlin',
    'Brendol Hux',
    'BT-1',
    'C-3PO',
    'C1-10P',
    'Cad Bane',
    'Caluan Ematt',
    'Captain Gregor',
    'Captain Phasma',
    'Captain Quarsh Panaka',
    'Captain Rex',
    'Carlist Rieekan',
    'Casca Panzoro',
    'Cassian Andor',
    'Cassio Tagge',
    'Cham Syndulla',
    'Che Amanwe Papanoida',
    'Chewbacca',
    'Chi Eekway Papanoida',
    'Chief Chirpa',
    'Chirrut Îmwe',
    'Ciena Ree',
    'Cin Drallig',
    'Clegg Holdfast',
    'Cliegg Lars',
    'Coleman Kcaj',
    'Coleman Trebor',
    'Colonel Kaplan',
    'Commander Bly',
    'Commander Cody (CC-2224)',
    'Commander Fil (CC-3714)',
    'Commander Fox',
    'Commander Gree',
    'Commander Jet',
    'Commander Wolffe',
    'Conan Antonio Motti',
    'Conder Kyl',
    'Constable Zuvio',
    'Cordé',
    'Cpatain Typho',
    'Crix Madine',
    'Cut Lawquane',
    'Dak Ralter',
    'Dapp',
    'Darth Bane',
    'Darth Maul',
    'Darth Tyranus',
    'Daultay Dofine',
    'Del Meeko',
    'Delian Mors',
    'Dengar',
    'Depa Billaba',
    'Derek Klivian',
    'Dexter Jettster',
    'Dineé Ellberger',
    'DJ',
    'Doctor Aphra',
    'Doctor Evazan',
    'Dogma',
    'Dormé',
    'Dr. Cylo',
    'Droidbait',
    'Droopy McCool',
    'Dryden Vos',
    'Dud Bolt',
    'Ebe E. Endocott',
    'Echuu Shen-Jon',
    'Eeth Koth',
    'Eighth Brother',
    'Eirtaé',
    'Eli Vanto',
    'Ellé',
    'Ello Asty',
    'Embo',
    'Eneb Ray',
    'Enfys Nest',
    'EV-9D9',
    'Evaan Verlaine',
    'Even Piell',
    'Ezra Bridger',
    'Faro Argyus',
    'Feral',
    'Fifth Brother',
    'Finis Valorum',
    'Finn',
    'Fives',
    'FN-1824',
    'FN-2003',
    'Fodesinbeed Annodue',
    'Fulcrum',
    'FX-7',
    'GA-97',
    'Galen Erso',
    'Gallius Rax',
    'Garazeb "Zeb" Orrelios',
    'Gardulla the Hutt',
    'Garrick Versio',
    'Garven Dreis',
    'Gavyn Sykes',
    'Gideon Hask',
    'Gizor Dellso',
    'Gonk droid',
    'Grand Inquisitor',
    'Greeata Jendowanian',
    'Greedo',
    'Greer Sonnel',
    'Grievous',
    'Grummgar',
    'Gungi',
    'Hammerhead',
    'Han Solo',
    'Harter Kalonia',
    'Has Obbit',
    'Hera Syndulla',
    'Hevy',
    'Hondo Ohnaka',
    'Huyang',
    'Iden Versio',
    'IG-88',
    'Ima-Gun Di',
    'Inquisitors',
    'Inspector Thanoth',
    'Jabba',
    'Jacen Syndulla',
    'Jan Dodonna',
    'Jango Fett',
    'Janus Greejatus',
    'Jar Jar Binks',
    'Jas Emari',
    'Jaxxon',
    'Jek Tono Porkins',
    'Jeremoch Colton',
    'Jira',
    'Jobal Naberrie',
    'Jocasta Nu',
    'Joclad Danva',
    'Joh Yowza',
    'Jom Barell',
    'Joph Seastriker',
    'Jova Tarkin',
    'Jubnuk',
    'Jyn Erso',
    'K-2SO',
    'Kanan Jarrus',
    'Karbin',
    'Karina the Great',
    'Kes Dameron',
    'Ketsu Onyo',
    'Ki-Adi-Mundi',
    'King Katuunko',
    'Kit Fisto',
    'Kitster Banai',
    'Klaatu',
    'Klik-Klak',
    'Korr Sella',
    'Kylo Ren',
    'L3-37',
    'Lama Su',
    'Lando Calrissian',
    'Lanever Villecham',
    'Leia Organa',
    'Letta Turmond',
    'Lieutenant Kaydel Ko Connix',
    'Lieutenant Thire',
    'Lobot',
    'Logray',
    'Lok Durd',
    'Longo Two-Guns',
    'Lor San Tekka',
    'Lorth Needa',
    'Lott Dod',
    'Luke Skywalker',
    'Lumat',
    'Luminara Unduli',
    'Lux Bonteri',
    'Lyn Me',
    'Lyra Erso',
    'Mace Windu',
    'Malakili',
    'Mama the Hutt',
    'Mars Guo',
    'Mas Amedda',
    'Mawhonic',
    'Max Rebo',
    'Maximilian Veers',
    'Maz Kanata',
    'ME-8D9',
    'Meena Tills',
    'Mercurial Swift',
    'Mina Bonteri',
    'Miraj Scintel',
    'Mister Bones',
    'Mod Terrik',
    'Moden Canady',
    'Mon Mothma',
    'Moradmin Bast',
    'Moralo Eval',
    'Morley',
    'Mother Talzin',
    'Nahdar Vebb',
    'Nahdonnis Praji',
    'Nien Nunb',
    'Niima the Hutt',
    'Nines',
    'Norra Wexley',
    'Nute Gunray',
    'Nuvo Vindi',
    'Obi-Wan Kenobi',
    'Odd Ball',
    'Ody Mandrell',
    'Omi',
    'Onaconda Farr',
    'Oola',
    'OOM-9',
    'Oppo Rancisis',
    'Orn Free Taa',
    'Oro Dassyne',
    'Orrimarko',
    'Osi Sobeck',
    'Owen Lars',
    'Pablo-Jill',
    'Padmé Amidala',
    'Pagetti Rook',
    'Paige Tico',
    'Paploo',
    'Petty Officer Thanisson',
    'Pharl McQuarrie',
    'Plo Koon',
    'Po Nudo',
    'Poe Dameron',
    'Poggle the Lesser',
    'Pong Krell',
    'Pooja Naberrie',
    'PZ-4CO',
    'Quarrie',
    'Quay Tolsite',
    'Queen Apailana',
    'Queen Jamillia',
    'Queen Neeyutnee',
    'Qui-Gon Jinn',
    'Quiggold',
    'Quinlan Vos',
    'R2-D2',
    'R2-KT',
    'R3-S6',
    'R4-P17',
    'R5-D4',
    'RA-7',
    'Rabé',
    'Rako Hardeen',
    'Ransolm Casterfo',
    'Rappertunie',
    'Ratts Tyerell',
    'Raymus Antilles',
    'Ree-Yees',
    'Reeve Panzoro',
    'Rey',
    'Ric Olié',
    'Riff Tamson',
    'Riley',
    'Rinnriyin Di',
    'Rio Durant',
    'Rogue Squadron',
    'Romba',
    'Roos Tarpals',
    'Rose Tico',
    'Rotta the Hutt',
    'Rukh',
    'Rune Haako',
    'Rush Clovis',
    'Ruwee Naberrie',
    'Ryoo Naberrie',
    'Sabé',
    'Sabine Wren',
    'Saché',
    'Saelt-Marae',
    'Saesee Tiin',
    'Salacious B. Crumb',
    'San Hill',
    'Sana Starros',
    'Sarco Plank',
    'Sarkli',
    'Satine Kryze',
    'Savage Opress',
    'Sebulba',
    'Senator Organa',
    'Sergeant Kreel',
    'Seventh Sister',
    'Shaak Ti',
    'Shara Bey',
    'Shmi Skywalker',
    'Shu Mai',
    'Sidon Ithano',
    'Sifo-Dyas',
    'Sim Aloo',
    'Siniir Rath Velus',
    'Sio Bibble',
    'Sixth Brother',
    'Slowen Lo',
    'Sly Moore',
    'Snaggletooth',
    'Snap Wexley',
    'Snoke',
    'Sola Naberrie',
    'Sora Bulq',
    'Strono Tuggs',
    'Sy Snootles',
    'Tallissan Lintra',
    'Tarfful',
    'Tasu Leech',
    'Taun We',
    'TC-14',
    'Tee Watt Kaa',
    'Teebo',
    'Teedo',
    'Teemto Pagalies',
    'Temiri Blagg',
    'Tessek',
    'Tey How',
    'Thane Kyrell',
    'The Bendu',
    'The Smuggler',
    'Thrawn',
    'Tiaan Jerjerrod',
    'Tion Medon',
    'Tobias Beckett',
    'Tulon Voidgazer',
    'Tup',
    'U9-C4',
    'Unkar Plutt',
    'Val Beckett',
    'Vanden Willard',
    'Vice Admiral Amilyn Holdo',
    'Vober Dand',
    'WAC-47',
    'Wag Too',
    'Wald',
    'Walrus Man',
    'Warok',
    'Wat Tambor',
    'Watto',
    'Wedge Antilles',
    'Wes Janson',
    'Wicket W. Warrick',
    'Wilhuff Tarkin',
    'Wollivan',
    'Wuher',
    'Wullf Yularen',
    'Xamuel Lennox',
    'Yaddle',
    'Yarael Poof',
    'Yoda',
    'Zam Wesell',
    'Zev Senesca',
    'Ziro the Hutt',
    'Zuckuss',
];

function EditUploadFile({ data, onFile }) {
    const [state] = useStore();
    const { currentUser } = state;
    const ref = useRef(null);
    const inputRef = useRef(null);
    const frameChooseRef = useRef();
    const frameVideoRef = useRef();

    const [target, setTarget] = useState(Range || undefined);
    const [index, setIndex] = useState(0);
    const [search, setSearch] = useState(null);
    const debounce = useDebounce(search, 800);
    const [loading, setLoading] = useState(false);
    const [showViewable, setShowViewable] = useState(false);
    const [viewable, setViewable] = useState(VIEWABLE_LIST[0]);
    const [allows, setAllows] = useState(['comment']);
    const [videoNote, setVideoNote] = useState(data?.name);
    const [frames, setFrames] = useState([]);
    const [videoThumb, setVideoThumb] = useState();
    const [hashtags, setHashtags] = useState([]);

    const editor = useMemo(() => withMentions(withReact(withHistory(createEditor()))), []);
    const renderElement = useCallback((props) => <MentionInput {...props} />, []);

    useEffect(() => {
        generateVideoThumbnails(data, MAX_THUMBNAIL).then((frames) => {
            setFrames(frames);
            setVideoThumb(frames[0]);
        });
    }, []);

    useEffect(() => {
        const minPos = 0;
        const maxPos = 599;
        let pos1 = 0;
        let pos2 = 0;
        let videoProgress = 0;

        const dragMouseDown = (e) => {
            e.preventDefault();
            pos2 = e.clientX;
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        };

        const elementDrag = (e) => {
            e.preventDefault();
            pos1 = pos2 - e.clientX;
            pos2 = e.clientX;
            videoProgress = ((frameChooseRef.current.offsetLeft - pos1) / 600) * frameVideoRef.current.duration;

            if (
                frameChooseRef.current.offsetLeft - pos1 <= minPos ||
                frameChooseRef.current.offsetLeft - pos1 > maxPos
            ) {
                return;
            }

            frameChooseRef.current.style.left = frameChooseRef.current.offsetLeft - pos1 + 'px';
            frameVideoRef.current.currentTime = videoProgress;
        };

        const closeDragElement = () => {
            let thumbIndex = Math.floor((videoProgress * 8) / frameVideoRef.current.duration);
            setVideoThumb(frames[thumbIndex]);
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
        };

        frameChooseRef.current.addEventListener('mousedown', dragMouseDown);
        return () => {
            frameChooseRef.current?.removeEventListener('mousedown', dragMouseDown);
        };
    }, [frames]);

    useEffect(() => {
        if (target && debounce?.length > 0) {
            const el = ref.current;
            const input = inputRef.current;

            el.style.top = `${input.offsetTop + 52}px`;
            el.style.left = `${input.offsetLeft}px`;
            el.style.width = `${input.offsetWidth}px`;
        }
    }, [debounce?.length, target]);

    useLayoutEffect(() => {
        const fetchApi = async () => {
            let res = await apiService.getHashtags({ q: debounce });
            setHashtags(res?.data);
        };
        debounce && fetchApi();
    }, [debounce]);

    useEffect(() => {});

    const handleCancel = () => {
        onFile('');
    };

    const handleCheck = (value) => {
        setAllows((prev) => {
            const isChecked = allows.includes(value);
            if (isChecked) {
                return allows.filter((item) => item !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const res = await apiService.uploadVideo({
            userId: currentUser._id,
            description: videoNote,
            viewable: viewable.value,
            allows,
            hashtags: slateToText(editor).hashtags,
            filePath: data,
            thumbPath: videoThumb?.split(',')[1],
            music: 'Âm thanh gốc',
        });
        if (res) {
            setLoading(false);
            toast('Đăng video thành công !');
            setTimeout(() => {
                onFile('');
            }, 800);
        }
    };

    const handleInsertMention = async (mention, isNewMention = false) => {
        Transforms.select(editor, target);
        if (isNewMention) {
            let res = await apiService.createHashtag({ hashtag: mention });
            if (res.status !== 201) {
                setTarget(null);
                return;
            }
            mention = res.data.hashtag;
        }
        insertMention(editor, mention, 'hashtags');
        setTarget(null);
    };

    const handleAddIconToEditor = () => {
        const { slate } = slateToText(editor);

        Transforms.delete(editor, {
            at: {
                anchor: Editor.start(editor, []),
                focus: Editor.end(editor, []),
            },
        });

        // Removes empty node
        Transforms.removeNodes(editor, {
            at: [0],
        });

        // Insert array of children nodes
        Transforms.insertNodes(editor, [
            {
                type: 'paragraph',
                children: [...slate.children, { text: '#' }],
            },
        ]);
    };

    return (
        <Fragment>
            <div className={cx('header')}>
                <h3>Tải video lên</h3>
                <p>Đăng video vào tài khoản của bạn</p>
            </div>
            <div className={cx('content')}>
                <div className={cx('select-file')}>
                    {data ? (
                        <div className={cx('mobile-preview')}>
                            <MobilePreview data={data} currentUser={currentUser} />
                            <div className={cx('mobile-video-info')}>
                                <span>@{currentUser?.nickName}</span>
                                <p dangerouslySetInnerHTML={{ __html: videoNote }}></p>
                                <div>
                                    <FontAwesomeIcon icon={faMusic} />
                                    <p>{currentUser?.fullName}-Âm thanh gốc</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <SelectFile />
                    )}
                </div>
                <div className={cx('edit-info')}>
                    <label className={cx('title')}>Tiêu đề</label>
                    <div ref={inputRef} className={cx('video-info')}>
                        <Slate
                            editor={editor}
                            initialValue={[
                                {
                                    type: 'paragraph',
                                    children: [{ text: data?.name }],
                                },
                            ]}
                            onChange={() => {
                                let mention = detectMention(editor, 'hashtags');
                                if (mention !== null) {
                                    setTarget(mention.target);
                                    setSearch(mention.search);
                                    setIndex(mention.index);
                                    return;
                                }
                                setVideoNote(slateToText(editor).text);
                                setTarget(null);
                            }}
                        >
                            <Editable
                                className={cx('title-input')}
                                style={{ outline: 'none' }}
                                renderElement={renderElement}
                                value={videoNote}
                            />
                            {target && debounce?.length > 0 && (
                                <Mention ref={ref} data-cy="mentions-portal">
                                    {hashtags.length > 0 ? (
                                        hashtags.map((_hashtag, _index) => (
                                            <MentionItem
                                                key={_index}
                                                mention={_hashtag.hashtag}
                                                onClick={() => handleInsertMention(_hashtag.hashtag)}
                                                styles={{
                                                    backgroundColor: _index === index ? '#f2f2f2' : 'transparent',
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <MentionItem
                                            mention={debounce}
                                            isNewHashtag
                                            onClick={() => handleInsertMention(debounce, true)}
                                        />
                                    )}
                                </Mention>
                            )}
                        </Slate>
                        <div className={cx('mention-icon')}>
                            <span onClick={handleAddIconToEditor}># Hashtag</span>
                        </div>
                    </div>
                    <div className={cx('video-info')}>
                        <div className={cx('video-thumb')}>
                            <label className={cx('title')}>Ảnh bìa</label>
                            <div className={cx('thumb-timeline')}>
                                {frames &&
                                    frames.map((frame, index) => (
                                        <div
                                            key={index}
                                            className={cx('frame-image')}
                                            style={{ backgroundImage: `url(${frame})` }}
                                        ></div>
                                    ))}
                                <div ref={frameChooseRef} className={cx('frame-chose')}>
                                    <Video
                                        preload="none"
                                        loading={false}
                                        customControl={false}
                                        ref={frameVideoRef}
                                        video={data}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('video-info')}>
                        <div className={cx('video-rule')}>
                            <label className={cx('title')}>Ai có thể xem video này</label>
                            <HeadlessTippy
                                interactive
                                visible={showViewable}
                                placement="bottom-start"
                                render={(attrs) => (
                                    <div className={cx('viewable-options')} tabIndex={-1} {...attrs}>
                                        <PopperWrapper>
                                            {VIEWABLE_LIST?.map((option, index) => (
                                                <div
                                                    key={index}
                                                    className={cx('item', {
                                                        selected: viewable.value === option.value,
                                                    })}
                                                    onClick={() => {
                                                        setViewable(option);
                                                        setShowViewable(false);
                                                    }}
                                                >
                                                    {option.title}
                                                </div>
                                            ))}
                                        </PopperWrapper>
                                    </div>
                                )}
                                onClickOutside={() => setShowViewable(false)}
                            >
                                <div className={cx('video-viewable')} onClick={() => setShowViewable(!showViewable)}>
                                    <span>{viewable.title}</span>
                                    <span className={cx('drop-icon', { rotate: showViewable })}>
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </span>
                                </div>
                            </HeadlessTippy>
                        </div>
                    </div>
                    <div className={cx('video-info')}>
                        <div className={cx('video-allow')}>
                            <label className={cx('title')}>Cho phép người dùng</label>
                            <div className={cx('checkbox-options')}>
                                {ALLOWS.map((allow, index) => (
                                    <div key={index} className={cx('checkbox-btn')}>
                                        <input
                                            checked={allows.includes(allow.value)}
                                            onChange={() => handleCheck(allow.value)}
                                            type="checkbox"
                                        />
                                        <span>{allow.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={cx('video-info')}>
                        <div className={cx('video-other-setting')}>
                            <label className={cx('title')}>Lên lịch cho video</label>
                            <div className={cx('toggle-btn')}>
                                <ToggleButton />
                            </div>
                        </div>
                    </div>
                    <div className="action-btn">
                        <Button simple onClick={handleCancel}>
                            Hủy bỏ
                        </Button>
                        <Button primary onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <FontAwesomeIcon className={cx('fetch-loading')} icon={faCircleNotch} />
                            ) : (
                                'Đăng'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export { EditUploadFile };
