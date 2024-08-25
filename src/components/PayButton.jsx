function PayButton() {
  const handlePayment = async () => {
    try {
      const response = await fetch('/api/webpay/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000, // Monto de la transacción
          sessionId: 'session123', // ID de la sesión del usuario
          buyOrder: `order-${Date.now()}`, // Número de orden único
          returnUrl: 'https://astro-webpay.netlify.app/thank-you', // URL de confirmación
        }),
      });

      const data = await response.json();
      
      console.log(data)

      if (data.token && data.url) {
        const form = document.createElement('form');
        form.method = 'post';
        form.action = data.url;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = data.token;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      } else {
        alert('error al iniciar el pago');
      }
    } catch (error) {
      console.error('error al procesar el pago:', error);
      alert('ocurrio un error al procesar el pago');
    }
  };
  return (
    <button onClick={handlePayment}>
    Pagar con WEBPAY
    </button>
  );
}
export default PayButton;
