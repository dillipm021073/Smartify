import { useState } from 'react';
import ProductCard from '../ProductCard';
import flagshipImage from '@assets/generated_images/Flagship_smartphone_product_image_3ad87b79.png';
import midrangeImage from '@assets/generated_images/Mid-range_smartphone_product_image_241ea1c6.png';
import budgetImage from '@assets/generated_images/Budget_smartphone_product_image_eac18301.png';

export default function ProductCardExample() {
  const [selected, setSelected] = useState<number | null>(null);

  const products = [
    {
      id: 1,
      image: flagshipImage,
      name: 'Premium Flagship',
      price: 45999,
      monthlyPayment: 1917,
      features: ['6.7" AMOLED Display', '256GB Storage', '108MP Camera', '5G Capable'],
      popular: true
    },
    {
      id: 2,
      image: midrangeImage,
      name: 'Mid-Range Pro',
      price: 24999,
      monthlyPayment: 1042,
      features: ['6.5" FHD+ Display', '128GB Storage', '64MP Camera', '5G Capable'],
      popular: false
    },
    {
      id: 3,
      image: budgetImage,
      name: 'Budget Smart',
      price: 12999,
      monthlyPayment: 542,
      features: ['6.2" HD+ Display', '64GB Storage', '48MP Camera', '4G LTE'],
      popular: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            selected={selected === product.id}
            onSelect={() => setSelected(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
