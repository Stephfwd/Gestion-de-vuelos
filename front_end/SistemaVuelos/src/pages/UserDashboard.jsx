import { useState, useEffect } from 'react';
import flightService from '../services/flightService';
import BookingModal from '../components/BookingModal';
import '../styles/Dashboard.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('buscar');
  const [flights, setFlights] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [search, setSearch] = useState({ origen_id: '', destino_id: '', fecha: '' });
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    if (activeTab === 'buscar') loadFlights();
    if (activeTab === 'reservas') loadMyBookings();
  }, [activeTab]);

  const loadFlights = async (filters = {}) => {
    try {
      const data = await flightService.getAll(filters);
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights', error);
    }
  };

  const loadMyBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setMyBookings(data);
    } catch (error) {
      console.error('Error fetching bookings', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadFlights(search);
  };

  const renderContent = () => {
    if (activeTab === 'reservas') {
      return (
        <section className="my-bookings mt-2">
          <h2>Mis Reservas</h2>
          <div className="table-container mt-2">
            <table>
              <thead>
                <tr>
                  <th>Vuelo</th>
                  <th>Asientos</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.vuelo?.numero_vuelo}</td>
                    <td>{b.cantidad_asientos}</td>
                    <td><span className="badge success">{b.estado}</span></td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    return (
      <>
        <section className="flight-search">
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Origen (ID)" 
              onChange={e => setSearch({...search, origen_id: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Destino (ID)" 
              onChange={e => setSearch({...search, destino_id: e.target.value})}
            />
            <input 
              type="date" 
              onChange={e => setSearch({...search, fecha: e.target.value})}
            />
            <button type="submit" className="btn-search">Buscar Vuelos</button>
          </form>
        </section>

        <section className="available-flights">
          <h2>Vuelos Disponibles</h2>
          <div className="flights-grid">
            {flights.map(flight => (
              <div key={flight.id} className="flight-card">
                <div className="flight-header">
                  <span className="flight-number">{flight.numero_vuelo}</span>
                  <span className="flight-price">${flight.precio}</span>
                </div>
                <div className="flight-route">
                  <div className="route-point">
                    <span className="city">{flight.origen?.ciudad || 'Origen'}</span>
                    <span className="code">{flight.origen?.codigo}</span>
                  </div>
                  <div className="route-arrow">✈️</div>
                  <div className="route-point">
                    <span className="city">{flight.destino?.ciudad || 'Destino'}</span>
                    <span className="code">{flight.destino?.codigo}</span>
                  </div>
                </div>
                <div className="flight-footer">
                  <span className="seats">{flight.asientos_disponibles} asientos libres</span>
                  <button 
                    className="btn-book"
                    onClick={() => setSelectedFlight(flight)}
                  >
                    Reservar Ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h3>Mi Cuenta</h3>
        <ul>
          <li className={activeTab === 'buscar' ? 'active' : ''} onClick={() => setActiveTab('buscar')}>✈️ Buscar Vuelos</li>
          <li className={activeTab === 'reservas' ? 'active' : ''} onClick={() => setActiveTab('reservas')}>🎫 Mis Reservas</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <header className="content-header">
          <h1>¡Hola! ¿A dónde volamos hoy?</h1>
          <p>Gestiona tus viajes y descubre nuevos destinos.</p>
        </header>

        {renderContent()}

        {selectedFlight && (
          <BookingModal 
            flight={selectedFlight} 
            onClose={() => setSelectedFlight(null)}
            onSuccess={loadFlights}
          />
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
