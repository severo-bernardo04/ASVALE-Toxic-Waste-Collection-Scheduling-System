import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

import Home from '../pages/Home';
import Login from '../pages/Login/index';
import Register from '../pages/Register/index';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import DeliveryList from '../pages/DeliveryList';
import DeliveryDetails from '../pages/DeliveryDetails';
import CreateDelivery from '../pages/CreateDelivery';
import EditDelivery from '../pages/EditDelivery';
import UsersAdmin from '../pages/Admin/Users';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/deliveries" element={<PrivateRoute><DeliveryList /></PrivateRoute>} />
    <Route path="/deliveries/new" element={<PrivateRoute><CreateDelivery /></PrivateRoute>} />
    <Route path="/deliveries/:id" element={<PrivateRoute><DeliveryDetails /></PrivateRoute>} />
    <Route path="/deliveries/edit/:id" element={<PrivateRoute><EditDelivery /></PrivateRoute>} />

    <Route path="/admin/dashboard" element={<PrivateRoute requireAdmin><AdminDashboard /></PrivateRoute>} />
    <Route path="/admin/users" element={<UsersAdmin />} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes; 