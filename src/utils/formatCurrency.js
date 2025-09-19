function formatearPesosCLP(total) {
  // Asegurarse que sea número
  const numero = Number(total);
  if (isNaN(numero)) return total;

  // Usar Intl.NumberFormat para Chile
  return numero.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0, // sin centavos
  });
}

module.exports = formatearPesosCLP;