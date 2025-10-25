import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LineItem {
  label: string;
  amount: number;
  description?: string;
}

interface PaymentSummaryProps {
  items: LineItem[];
  oneTimeCashout?: number;
  monthlyPayment?: number;
}

export default function PaymentSummary({ items, oneTimeCashout, monthlyPayment }: PaymentSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="p-6 space-y-4 sticky top-4">
      <h3 className="text-lg font-semibold text-foreground">Payment Summary</h3>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                )}
              </div>
              <p className="text-sm font-medium text-foreground">
                ₱{item.amount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-foreground">Total</p>
        <p className="text-xl font-bold text-primary">₱{total.toLocaleString()}</p>
      </div>

      {oneTimeCashout !== undefined && (
        <>
          <Separator />
          <div className="space-y-2 bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-foreground">One-Time Cashout</p>
              <p className="text-lg font-bold text-foreground">
                ₱{oneTimeCashout.toLocaleString()}
              </p>
            </div>
            {monthlyPayment !== undefined && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Monthly Payment (24 months)</p>
                <p className="text-sm font-medium text-foreground">
                  ₱{monthlyPayment.toLocaleString()}/mo
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <p className="text-xs text-muted-foreground text-center">
        All prices are inclusive of applicable taxes
      </p>
    </Card>
  );
}
