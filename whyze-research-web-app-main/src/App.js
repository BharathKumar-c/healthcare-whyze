import React, { Suspense } from 'react';
import routes from './routes';
import './App.css';
import 'antd/dist/antd.min.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import Header from './Header';
import PrivateRoutes from './PrivateRoutes';
import { useSelector } from 'react-redux';
import PublicRoutes from './PublicRoutes';
import PasswordRoutes from './passwordRoutes';

function App() {
  const { publicRoutes, privateRoutes, passwordRoutes } = routes();
  const { isLoggedIn, isDisableForgot } = useSelector(
    (state) => state.authReducer,
  );

  return (
    <div className="App">
      <Suspense fallback={<Spin />}>
        <Outlet />
        <Routes>
          <Route element={<PublicRoutes isLoggedIn={isLoggedIn} />}>
            {publicRoutes.map(({ path, Component }, index) => (
              <Route exact path={path} element={Component} key={index} />
            ))}
          </Route>

          {/* when user isAuth will true then user will redirect to dashboard */}
          <Route element={<PrivateRoutes isLoggedIn={isLoggedIn} />}>
            {privateRoutes.map(({ path, Component }, index) => (
              <Route
                key={index}
                element={path !== '*' ? <Header path={path} /> : null}
              >
                <Route exact path={path} element={Component} />
              </Route>
            ))}
          </Route>
          <Route element={<PasswordRoutes isDisableForgot={isDisableForgot} />}>
            {passwordRoutes.map(({ path, Component }, index) => (
              <Route exact path={path} element={Component} key={index} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
