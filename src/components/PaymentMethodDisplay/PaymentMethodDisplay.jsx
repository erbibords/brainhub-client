const PaymentMethodDisplay = ({ paymentMethod, bankName }) => {
  const normalizedMethod = paymentMethod?.trim() || '';
  const isCheckPayment = normalizedMethod.toUpperCase() === 'CHECK';
  const bankLabel = bankName?.name || bankName?.code || '';

  if (!normalizedMethod) {
    return '';
  }

  return (
    <div className="leading-tight">
      <div>{normalizedMethod}</div>
      {isCheckPayment && bankLabel ? (
        <div className="text-xs text-gray-500 mt-1">{bankLabel}</div>
      ) : null}
    </div>
  );
};

export default PaymentMethodDisplay;
