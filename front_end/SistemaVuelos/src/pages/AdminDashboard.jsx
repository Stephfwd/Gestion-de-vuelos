import { useState, useEffect } from 'react';
import axiosClient from '../services/axiosClient';
import ManageFlights from '../components/admin/ManageFlights';
import ManageAirports from '../components/admin/ManageAirports';
import ViewBookings from '../components/admin/ViewBookings';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [stats, setStats] = useState({ flights: 0, airports: 0, bookings: 0 });

  useEffect(() => {
    // Simulación de carga de estadísticas
    setStats({ flights: 12, airports: 5, bookings: 45 });
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'vuelos': return <ManageFlights />;
      case 'aeropuertos': return <ManageAirports />;
      case 'reservas': return <ViewBookings />;
      case 'resumen':
      default:
        return (
          <>
            <header className="content-header">
              <h1>Panel de Administración</h1>
              <p>Bienvenido al centro de control de AirGestion.</p>
            </header>

            <div className="stats-grid">
              <div className="stat-card blue">
                <h3>Vuelos Totales</h3>
                <p className="stat-number">{stats.flights}</p>
              </div>
              <div className="stat-card pink">
                <h3>Reservas Activas</h3>
                <p className="stat-number">{stats.bookings}</p>
              </div>
              <div className="stat-card blue">
                <h3>Aeropuertos</h3>
                <p className="stat-number">{stats.airports}</p>
              </div>
            </div>

            <section className="recent-activity">
              <h2>Actividad Reciente</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Vuelo</th>
                      <th>Usuario</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>CR-101</td>
                      <td>juan@test.com</td>
                      <td><span className="badge success">Pagado</span></td>
                      <td><button className="btn-action">Ver</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h3>Panel Admin</h3>
        <ul>
          <li className={activeTab === 'resumen' ? 'active' : ''} onClick={() => setActiveTab('resumen')}>📊 Resumen</li>
          <li className={activeTab === 'vuelos' ? 'active' : ''} onClick={() => setActiveTab('vuelos')}>✈️ Gestionar Vuelos</li>
          <li className={activeTab === 'aeropuertos' ? 'active' : ''} onClick={() => setActiveTab('aeropuertos')}>🏢 Aeropuertos</li>
          <li className={activeTab === 'reservas' ? 'active' : ''} onClick={() => setActiveTab('reservas')}>🎫 Ver Reservas</li>
        </ul>
      </aside>
      
      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
