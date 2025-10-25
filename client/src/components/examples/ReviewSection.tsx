import ReviewSection, { ReviewItem } from '../ReviewSection';
import { Card } from '@/components/ui/card';

export default function ReviewSectionExample() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Card className="p-6">
        <ReviewSection title="Product Details" defaultOpen>
          <ReviewItem label="Device" value="Premium Flagship - 256GB, Midnight Black" />
          <ReviewItem label="Plan" value="Unlimited Data Plan (24 months)" />
          <ReviewItem label="Device Price" value="₱45,999" />
          <ReviewItem label="Monthly Payment" value="₱1,917 for 24 months" />
        </ReviewSection>
      </Card>

      <Card className="p-6">
        <ReviewSection title="Customer Information">
          <ReviewItem label="Email" value="user@example.com" />
          <ReviewItem label="ID Type" value="Philippine Passport" />
          <ReviewItem label="Address" value="123 Main St, Barangay Centro, Makati City, Metro Manila" />
        </ReviewSection>
      </Card>

      <Card className="p-6">
        <ReviewSection title="Employment Information">
          <ReviewItem label="Employment Type" value="Full-time Employee" />
          <ReviewItem label="Employer" value="ABC Corporation" />
          <ReviewItem label="Job Title" value="Software Engineer" />
          <ReviewItem label="Monthly Income" value="₱50,000 - ₱75,000" />
        </ReviewSection>
      </Card>
    </div>
  );
}
