import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import StartPage from './pages/startpage/Startpage';
import RegistrationPage from './pages/registerpage/Registerpage';
import LoginPage from './pages/loginpage/Loginpage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardNavbar from './components/DashboardNavbar'; // Import the DashboardNavbar component
import PostPage from './pages/post/Postpage';
import AdminDashboard from './pages/adminpage/Admindashboard';
import AdminRoutes from './protected_routes/AdminRoutes';
import UserRoutes from './protected_routes/UserRoutes';
import ProfilePage from './pages/profilepage/ProfilePage';
import ForgotPassword from './pages/forgot_password/ForgotPassword';
import ProductDetailPage from './pages/productDetail/ProductDetailPage';
import FavoritePage from './pages/favouritePage/FavouritePage';
import CartPage from './pages/addToCart/AddToCart';

const App = () => {
  const location = useLocation();

  const renderNavbar = () => {
    const path = location.pathname;
    if (
      path === '/dashboard' ||
      path === '/profile' ||
      path === '/post' ||
      path.startsWith('/product/') ||
      path === '/favorites' ||
      path === '/cart'
    ) {
      return <DashboardNavbar />;
    }
    return <Navbar />;
  };

  return (
    <>
      {renderNavbar()}
      <div style={{ marginTop: '70px' }}></div>
      <Routes>
        <Route path='/' element={<StartPage />} />
        <Route path='/register' element={<RegistrationPage />} />
        <Route path='/login' element={<LoginPage />} />


        {/* Forgot password */}
        <Route path='/forgot_password' element={<ForgotPassword />} />

        {/* Redirect based on user role after login */}
        <Route path='/redirect' element={<RedirectBasedOnRole />} />


        {/* User Routes */}

        <Route element={<UserRoutes />}>
          <Route path='/post' element={<PostPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/product/:id' element={<ProductDetailPage />} />
          <Route path='/favorites' element={<FavoritePage />} />
          <Route path='/cart' element={<CartPage />} />
        </Route>



        {/* Admin Routes */}

        <Route element={<AdminRoutes />}>
          {/* <Route path='/admin/update/:id' element={<AdminUpdate />} /> */}
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>

  );
};

// const RedirectBasedOnRole = () => {
//   const user = JSON.parse(localStorage.getItem('user'));

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   return user.isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />;
// };

const RedirectBasedOnRole = () => {
  // Safely retrieve and parse the user data
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
    console.error('RedirectBasedOnRole: No user data found in localStorage.');
    return <Navigate to="/login" />;
  }

  // Check user role and redirect accordingly
  return user.isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />;
};


const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;