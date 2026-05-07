import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      {user?.rol === 'Admin' ? <AdminDashboard /> : <UserDashboard />}
    </>
  );
};

export default Dashboard;
