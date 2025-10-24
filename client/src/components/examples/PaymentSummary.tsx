import PaymentSummary from '../PaymentSummary';

export default function PaymentSummaryExample() {
  const items = [
    { label: 'Premium Flagship Device', amount: 45999, description: '256GB, Midnight Black' },
    { label: 'Unlimited Data Plan', amount: 999, description: '24 months contract' },
    { label: 'SIM Card Activation', amount: 100 }
  ];

  return (
    <div className="max-w-md mx-auto p-6">
      <PaymentSummary 
        items={items}
        oneTimeCashout={5999}
        monthlyPayment={1917}
      />
    </div>
  );
}
