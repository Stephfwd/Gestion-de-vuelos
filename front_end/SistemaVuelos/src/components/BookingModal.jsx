import { useState } from 'react';
import bookingService from '../services/bookingService';

const BookingModal = ({ flight, onClose, onSuccess }) => {
  const [asientos, setAsientos] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    setLoading(true);
    try {
      await bookingService.create({
        vuelo_id: flight.id,
        cantidad_asientos: asientos
      });
      alert('¡Reserva creada con éxito!');
      onSuccess();
      onClose();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Reserva</h2>
        <div className="booking-details mt-2">
          <p><strong>Vuelo:</strong> {flight.numero_vuelo}</p>
          <p><strong>Ruta:</strong> {flight.origen?.ciudad} ➔ {flight.destino?.ciudad}</p>
          <p><strong>Precio unitario:</strong> ${flight.precio}</p>
          
          <div className="form-group mt-2">
            <label>Cantidad de Asientos:</label>
            <input 
              type="number" 
              min="1" 
              max={flight.asientos_disponibles} 
              value={asientos}
              onChange={(e) => setAsientos(parseInt(e.target.value))}
              style={{ padding: '0.5rem', width: '100%', marginTop: '0.5rem' }}
            />
          </div>

          <div className="total-price mt-2">
            <h3>Total: ${(flight.precio * asientos).toFixed(2)}</h3>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>Cancelar</button>
          <button 
            className="btn-save" 
            onClick={handleBooking}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Confirmar y Reservar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
