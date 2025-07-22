import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProviderProfile from './pages/ProviderProfile'; 
import EditProfile from './pages/EditProfile';
import SearchProviders from './pages/SearchProviders';
import { AuthProvider } from './contexts/AuthContext';
import ViewAppointments from './pages/ViewAppointments';
import SetAvailability from './pages/SetAvailability';
import ProviderIncome from './pages/ProviderIncome';
import Home from './pages/Home';
import CustomerLogin from './pages/CustomerLogin';
import ProviderLogin from './pages/ProviderLogin';
import CustomerHome from './pages/CustomerHome';
import CustomerOrderPage from './pages/CustomerOrderPage'; 
import PaymentPage from './pages/PaymentPage';
import ProviderHome from './pages/ProviderHome';
import CustomerBookings from './pages/CustomerBookings';
import ProviderBookings from './pages/ProviderBookings';
import CustomerBookingDetail from './pages/CustomerBookingDetail';
import ProviderBookingDetail from './pages/ProviderBookingDetail';
import Register from './pages/Register';
import Login from './pages/Login';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-customer" element={<CustomerLogin />} />
          <Route path="/login-provider" element={<ProviderLogin />} />
          <Route path="/customer-home" element={<CustomerHome />} />
          <Route path="/provider-home" element={<ProviderHome />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer-order" element={<CustomerOrderPage />} />
          <Route path="/provider-profile" element={<ProviderProfile />} />
          <Route path="/provider-appointments" element={<ViewAppointments />} />
          <Route path="/provider-availability" element={<SetAvailability />} />
          <Route path="/search-providers" element={<SearchProviders />} />
          <Route path="/provider-income" element={<ProviderIncome />} />
          <Route path="/customer-orderpage" element={<CustomerOrderPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          <Route path="/customer-bookings" element={<CustomerBookings />} />
          <Route path="/provider-bookings" element={<ProviderBookings />} />
          <Route path="/customer-bookings/:id" element={<CustomerBookingDetail />} />
          <Route path="/provider-bookings/:id" element={<ProviderBookingDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
