import { useState, useEffect } from 'react';
import airportService from '../../services/airportService';

const ManageAirports = () => {
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    loadAirports();
  }, []);

  const loadAirports = async () => {
    try {
      const data = await airportService.getAll();
      setAirports(data);
    } catch (error) {
      console.error('Error loading airports', error);
    }
  };

  return (
    <div className="manage-airports">
      <div className="section-header">
        <h2>Gestión de Aeropuertos</h2>
        <button className="btn-add">+ Añadir Aeropuerto</button>
      </div>

      <div className="table-container mt-2">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Código</th>
              <th>Ciudad</th>
              <th>País</th>
            </tr>
          </thead>
          <tbody>
            {airports.map(airport => (
              <tr key={airport.id}>
                <td>{airport.nombre}</td>
                <td><span className="badge info">{airport.codigo}</span></td>
                <td>{airport.ciudad}</td>
                <td>{airport.pais}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAirports;
