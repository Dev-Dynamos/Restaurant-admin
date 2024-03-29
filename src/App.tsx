import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import { ToastContainer, toast } from 'react-toastify';

import { getUserInfo } from './pages/Authentication/services';
import { Official } from './pages/official';
import { Category } from './pages/Category';
import { Pedidos } from './pages/pedidos';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import { Menu } from './pages/menu';
import { Produtos } from './pages/produtos';
import { Position } from './pages/Position';
import { Stock } from './pages/stock';
function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [ search, setSearch ] = useState("")
  const preloader = document.getElementById('preloader');

  if (preloader) {
    setTimeout(() => {
      preloader.style.display = 'none';
      setLoading(false);
    }, 2000);
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <p className=" text-center text-danger">Failed to lead app</p>
  ) : (
    <>
      <Routes>
        <Route path="/" element={<PrivateRoute><ECommerce /></PrivateRoute>} />
        <Route path="/Menus" element={<PrivateRoute><Menu  /></PrivateRoute>} />
        <Route path="/official" element={<PrivateRoute><Official /></PrivateRoute>} />
        <Route path="/Category" element={<PrivateRoute><Category /></PrivateRoute>} />
        <Route path="/position" element={<PrivateRoute><Position/></PrivateRoute>} />
        <Route path="/pedidos" element={<PrivateRoute><Pedidos /></PrivateRoute>} />
        <Route path="/usuarios" element={<PrivateRoute><Pedidos /></PrivateRoute>} />
        <Route path="/produtos" element={<PrivateRoute><Produtos /></PrivateRoute>} />
        <Route path="/stock" element={<PrivateRoute><Stock /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/forms/form-elements" element={<FormElements />} />
        <Route path="/forms/form-layout" element={<FormLayout />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/ui/alerts" element={<Alerts />} />
        <Route path="/ui/buttons" element={<Buttons />} />
        <Route path="/auth/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route
          path="*"
          element={
            <div className="flex h-screen w-full items-center justify-center text-5xl text-black-2">
              Error 404 | NOT FOUND
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
