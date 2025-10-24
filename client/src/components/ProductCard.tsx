import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  monthlyPayment?: number;
  features: string[];
  popular?: boolean;
  selected?: boolean;
  onSelect: () => void;
}

export default function ProductCard({
  image,
  name,
  price,
  monthlyPayment,
  features,
  popular,
  selected,
  onSelect
}: ProductCardProps) {
  return (
    <Card 
      className={`relative overflow-hidden transition-all ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
    >
      {popular && (
        <Badge className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground">
          Popular
        </Badge>
      )}

      <div className="aspect-[3/2] bg-muted relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-contain p-4"
        />
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">₱{price.toLocaleString()}</span>
            {monthlyPayment && (
              <span className="text-sm text-muted-foreground">
                or ₱{monthlyPayment}/month
              </span>
            )}
          </div>
        </div>

        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={onSelect} 
          className="w-full"
          variant={selected ? "default" : "outline"}
          data-testid={`button-select-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {selected ? 'Selected' : 'Select'}
        </Button>
      </div>
    </Card>
  );
}
