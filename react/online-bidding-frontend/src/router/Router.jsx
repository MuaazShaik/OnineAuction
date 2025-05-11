import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/UserDashboard';
import Products from '../pages/Products';
import Bidding from '../pages/Bidding';
import Orders from '../pages/Orders';
import Wallet from '../pages/Wallet';
import Transactions from '../pages/Transactions';
import Analytics from '../pages/Analytics';
import About from '../pages/About';
import AddProduct from '../pages/AddProduct';
import Categories from '../pages/Categories';
import Deliveries from '../pages/Deliveries';
import UserAllProducts from '../pages/UserAllProducts';
import UserOrders from '../pages/UserOrders';
import UserTransactions from '../pages/UserTransactions';
import AdminBids from '../pages/AdminBids';
import UserBids from '../pages/UserBids';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/admin-dashboard',
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user-dashboard',
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/products',
    element: <Products />,
  },
  {
    path: '/bidding/:productId',
    element: (
      <ProtectedRoute>
        <Bidding />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute>
        <Orders />
      </ProtectedRoute>
    ),
  },
  {
    path: '/wallet',
    element: (
      <ProtectedRoute>
        <Wallet />
      </ProtectedRoute>
    ),
  },
  {
    path: '/transactions',
    element: (
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute adminOnly={true}>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/products',
    element: (
      <ProtectedRoute adminOnly={true}>
        <Products />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/add-product',
    element: (
      <ProtectedRoute adminOnly={true}>
        <AddProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/categories',
    element: (
      <ProtectedRoute adminOnly={true}>
        <Categories />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/deliveries',
    element: (
      <ProtectedRoute adminOnly={true}>
        <Deliveries />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/products',
    element: (
      <ProtectedRoute>
        <UserAllProducts />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/orders',
    element: (
      <ProtectedRoute>
        <UserOrders />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/transactions',
    element: (
      <ProtectedRoute>
        <UserTransactions />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/bids',
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminBids />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/bids',
    element: (
      <ProtectedRoute>
        <UserBids />
      </ProtectedRoute>
    ),
  },
]);

export default router; 