import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment, useEffect } from 'react';

import { AuthGuard } from './hoc/Guard';
import { privateRoutes, publicRoutes } from './routes';
import { DefaultLayout } from './layouts';

function App() {
    function renderRoute(route, index, isPrivate = false) {
        let Layout = route.layout ?? (route.layout === null ? Fragment : DefaultLayout);
        let Page = route.component;
        return (
            <Route
                key={index}
                path={route.path}
                element={
                    <Layout>
                        {isPrivate ? (
                            <AuthGuard>
                                <Page />
                            </AuthGuard>
                        ) : (
                            <Page />
                        )}
                    </Layout>
                }
            />
        );
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => renderRoute(route, index))}
                    {privateRoutes.map((route, index) => renderRoute(route, index, true))}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
