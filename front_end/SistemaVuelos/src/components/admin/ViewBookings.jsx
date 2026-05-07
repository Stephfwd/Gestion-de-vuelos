import { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        // Nota: Necesitaríamos un endpoint de admin para ver TODAS las reservas. 
        // Por ahora simulamos o usamos el de usuario si el rol permite verlas.
        const response = await axiosClient.get('/bookings/my-bookings'); 
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      }
    };
    fetchAllBookings();
  }, []);

  return (
    <div className="view-bookings">
      <div className="section-header">
        <h2>Listado de Reservas</h2>
      </div>

      <div className="table-container mt-2">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vuelo</th>
              <th>Asientos</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>#{booking.id}</td>
                <td>{booking.vuelo?.numero_vuelo}</td>
                <td>{booking.cantidad_asientos}</td>
                <td>
                  <span className={`badge ${booking.estado === 'Confirmada' ? 'success' : 'warning'}`}>
                    {booking.estado}
                  </span>
                </td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewBookings;
