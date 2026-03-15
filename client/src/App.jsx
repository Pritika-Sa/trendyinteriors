import React from 'react'; // triggering refresh
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Testimonials from './pages/Testimonials';
import ReachUs from './pages/ReachUs';
import GiveTestimonial from './pages/GiveTestimonial';
import Projects from './pages/Projects';
import BuyOnline from './pages/BuyOnline';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import './App.css';

const Layout = () => {
  const location = useLocation();
  // Hide footer on profile and auth pages
  const showFooter = !['/login', '/forgot-password', '/reset-password'].some(path => location.pathname.startsWith(path));

  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/abouts" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/reachus" element={<ReachUs />} />
          <Route path="/give-testimonial" element={<GiveTestimonial />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/buy-online" element={<BuyOnline />} />

          {/* Auth Routes - Admin Only Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes - Protected */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<Projects />} />
          </Route>
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
