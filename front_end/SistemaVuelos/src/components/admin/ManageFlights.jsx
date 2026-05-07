import { useState, useEffect } from 'react';
import flightService from '../../services/flightService';
import airportService from '../../services/airportService';

const ManageFlights = () => {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newFlight, setNewFlight] = useState({
    numero_vuelo: '',
    origen_id: '',
    destino_id: '',
    fecha_salida: '',
    fecha_llegada: '',
    capacidad: 150,
    precio: 0,
    asientos_disponibles: 150
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [flightsData, airportsData] = await Promise.all([
      flightService.getAll(),
      airportService.getAll()
    ]);
    setFlights(flightsData);
    setAirports(airportsData);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await flightService.create({
        ...newFlight,
        asientos_disponibles: newFlight.capacidad
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      alert('Error al crear vuelo: ' + error.message);
    }
  };

  return (
    <div className="manage-flights">
      <div className="section-header">
        <h2>Gestión de Vuelos</h2>
        <button className="btn-add" onClick={() => setShowForm(true)}>+ Nuevo Vuelo</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Crear Nuevo Vuelo</h3>
            <form onSubmit={handleCreate}>
              <div className="form-grid">
                <input type="text" placeholder="Número de Vuelo (ej: AA-123)" required 
                  onChange={e => setNewFlight({...newFlight, numero_vuelo: e.target.value})} />
                
                <select required onChange={e => setNewFlight({...newFlight, origen_id: e.target.value})}>
                  <option value="">Origen</option>
                  {airports.map(a => <option key={a.id} value={a.id}>{a.nombre} ({a.codigo})</option>)}
                </select>

                <select required onChange={e => setNewFlight({...newFlight, destino_id: e.target.value})}>
                  <option value="">Destino</option>
                  {airports.map(a => <option key={a.id} value={a.id}>{a.nombre} ({a.codigo})</option>)}
                </select>

                <input type="datetime-local" placeholder="Fecha Salida" required 
                  onChange={e => setNewFlight({...newFlight, fecha_salida: e.target.value})} />
                
                <input type="datetime-local" placeholder="Fecha Llegada" required 
                  onChange={e => setNewFlight({...newFlight, fecha_llegada: e.target.value})} />

                <input type="number" placeholder="Capacidad" required 
                  onChange={e => setNewFlight({...newFlight, capacidad: e.target.value})} />

                <input type="number" placeholder="Precio ($)" required 
                  onChange={e => setNewFlight({...newFlight, precio: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar Vuelo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container mt-2">
        <table>
          <thead>
            <tr>
              <th>Vuelo</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Salida</th>
              <th>Asientos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {flights.map(flight => (
              <tr key={flight.id}>
                <td>{flight.numero_vuelo}</td>
                <td>{flight.origen?.codigo}</td>
                <td>{flight.destino?.codigo}</td>
                <td>{new Date(flight.fecha_salida).toLocaleString()}</td>
                <td>{flight.asientos_disponibles}/{flight.capacidad}</td>
                <td><span className="badge info">{flight.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFlights;
