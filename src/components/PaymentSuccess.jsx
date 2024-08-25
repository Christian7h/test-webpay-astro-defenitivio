import React, { useEffect, useState } from 'react';

const PaymentSuccess = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenWs = params.get('token_ws');

    if (tokenWs) {
      const fetchTransactionDetails = async () => {
        try {
          const response = await fetch(`/api/webpay/confirm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: tokenWs }),
          });

          if (response.ok) {
            const data = await response.json();
            setDetails(data.details);
            setLoading(false);
          } else {
            const errorData = await response.json();
            setError(errorData.error);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error al obtener los detalles de la transacción:', err);
          setError('Error al obtener los detalles de la transacción.');
          setLoading(false);
        }
      };

      fetchTransactionDetails();
    } else {
      setError('Token no encontrado en la URL.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p>Cargando detalles...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>¡Pago Exitoso!</h1>
      {details ? (
        <div>
          <p>Gracias por tu compra. Aquí están los detalles de tu transacción:</p>
          <p><strong>Monto:</strong> ${details.amount}</p>
          <p><strong>Número de Orden:</strong> {details.buy_order}</p>
          <p><strong>Fecha de la Transacción:</strong> {new Date(details.transaction_date).toLocaleString()}</p>
          <p><strong>Código de Autorización:</strong> {details.authorization_code}</p>
          <p><strong>Número de Tarjeta:</strong> **** **** **** {details.card_detail.card_number}</p>
        </div>
      ) : (
        <p>No se encontraron detalles de la transacción.</p>
      )}
      <div>
        <a href="/">VOLVER</a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
