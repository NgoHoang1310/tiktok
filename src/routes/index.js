import config from '~/configs';
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Upload from '~/pages/Upload';
import Discover from '~/pages/Discover';
import Post from '~/pages/Post';
import { HeaderOnly } from '~/layouts';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.discover, component: Discover },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.post, component: Post, layout: null },
];

const privateRoutes = [
    { path: config.routes.upload, component: Upload, layout: HeaderOnly },
    { path: config.routes.following, component: Following },
];

export { publicRoutes, privateRoutes };
