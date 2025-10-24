import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import StepProgress from "@/components/StepProgress";
import OTPModal from "@/components/OTPModal";
import DocumentUpload from "@/components/DocumentUpload";
import SignatureCanvas from "@/components/SignatureCanvas";
import ProductCard from "@/components/ProductCard";
import PaymentSummary from "@/components/PaymentSummary";
import ReviewSection, { ReviewItem } from "@/components/ReviewSection";
import { MapPin, Building2, CheckCircle2 } from "lucide-react";
import logoImage from '@assets/generated_images/Smartify_company_logo_b23637a9.png';
import flagshipImage from '@assets/generated_images/Flagship_smartphone_product_image_3ad87b79.png';
import midrangeImage from '@assets/generated_images/Mid-range_smartphone_product_image_241ea1c6.png';
import budgetImage from '@assets/generated_images/Budget_smartphone_product_image_eac18301.png';

const steps = [
  'Select Plan',
  'Select Device',
  'Choose SIM',
  'Verify Identity',
  'Upload Documents',
  'Address',
  'Employment',
  'Store',
  'Review',
  'Sign'
];

// todo: remove mock functionality
const mockProducts = [
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
    features: ['6.5" FHD+ Display', '128GB Storage', '64MP Camera', '5G Capable']
  },
  {
    id: 3,
    image: budgetImage,
    name: 'Budget Smart',
    price: 12999,
    monthlyPayment: 542,
    features: ['6.2" HD+ Display', '64GB Storage', '48MP Camera', '4G LTE']
  }
];

// todo: remove mock functionality
const mockPlans = [
  { id: 1, name: 'Unlimited Data Plan', price: 999, data: 'Unlimited', calls: 'Unlimited' },
  { id: 2, name: 'Premium Plan', price: 1499, data: 'Unlimited', calls: 'Unlimited', perks: '50GB Mobile Hotspot' },
  { id: 3, name: 'Basic Plan', price: 599, data: '20GB', calls: 'Unlimited' }
];

export default function CustomerPortal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [selectedSIM, setSelectedSIM] = useState<number | null>(null);
  const [idType, setIdType] = useState('');
  const [frontDoc, setFrontDoc] = useState<string>();
  const [backDoc, setBackDoc] = useState<string>();
  const [employmentType, setEmploymentType] = useState('full-time');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [privacyChecks, setPrivacyChecks] = useState({
    offers: false,
    partners: false,
    customization: false,
    analytics: false,
    marketing: false,
    thirdParty: false
  });
  const [termsChecks, setTermsChecks] = useState({
    terms: false,
    privacy: false,
    contract: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [cartId, setCartId] = useState('');

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFileUpload = (file: File, type: 'front' | 'back') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'front') {
        setFrontDoc(e.target?.result as string);
      } else {
        setBackDoc(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const newCartId = `CART-${timestamp}${random}`;
    setCartId(newCartId);
    setSubmitted(true);
    console.log('Application submitted with Cart ID:', newCartId);
  };

  const selectedProductData = mockProducts.find(p => p.id === selectedProduct);
  const selectedPlanData = mockPlans.find(p => p.id === selectedPlan);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground">
              Your application has been successfully submitted and is now under review.
            </p>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground mb-1">Your Cart ID</p>
            <p className="text-2xl font-bold text-primary" data-testid="text-cart-id">{cartId}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Please save this Cart ID for tracking your application. You will also receive a confirmation email shortly.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full" data-testid="button-new-application">
            Start New Application
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <img src={logoImage} alt="Smartify" className="h-8" />
          <h1 className="text-lg font-semibold text-foreground">SIM with Device</h1>
        </div>
      </header>

      <StepProgress currentStep={currentStep} totalSteps={10} steps={steps} />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Step 1: Select Plan */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Select a Plan</h2>
              <p className="text-muted-foreground mb-6">Choose the plan that best fits your needs</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`p-6 cursor-pointer transition-all ${
                      selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <h3 className="font-semibold text-foreground mb-2">{plan.name}</h3>
                    <div className="text-2xl font-bold text-primary mb-4">₱{plan.price}/mo</div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {plan.data} Data
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {plan.calls} Calls & SMS
                      </li>
                      {plan.perks && (
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          {plan.perks}
                        </li>
                      )}
                    </ul>
                    <Button
                      className="w-full mt-4"
                      variant={selectedPlan === plan.id ? 'default' : 'outline'}
                      data-testid={`button-select-plan-${plan.id}`}
                    >
                      {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Select Device */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Select Your Device</h2>
              <p className="text-muted-foreground mb-6">Choose from our latest smartphones</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    selected={selectedProduct === product.id}
                    onSelect={() => setSelectedProduct(product.id)}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Choose SIM */}
        {currentStep === 3 && (
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your SIM</h2>
              <p className="text-muted-foreground">Select your preferred SIM card type</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 1, name: 'Nano SIM', description: 'Standard SIM card for most devices' },
                { id: 2, name: 'eSIM', description: 'Digital SIM, no physical card needed' },
                { id: 3, name: 'Dual SIM', description: 'Two SIM cards for one device' }
              ].map((sim) => (
                <Card
                  key={sim.id}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedSIM === sim.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedSIM(sim.id)}
                >
                  <h3 className="font-semibold text-foreground mb-2">{sim.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{sim.description}</p>
                  <Button
                    className="w-full"
                    variant={selectedSIM === sim.id ? 'default' : 'outline'}
                    data-testid={`button-select-sim-${sim.id}`}
                  >
                    {selectedSIM === sim.id ? 'Selected' : 'Select'}
                  </Button>
                </Card>
              ))}
            </div>

            {selectedProduct && selectedPlan && selectedSIM && (
              <Card className="p-6 bg-muted">
                <h3 className="font-semibold text-foreground mb-4">Your Cart Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Device:</span>
                    <span className="text-foreground font-medium">
                      {mockProducts.find(p => p.id === selectedProduct)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="text-foreground font-medium">
                      {mockPlans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SIM Type:</span>
                    <span className="text-foreground font-medium">
                      {['Nano SIM', 'eSIM', 'Dual SIM'][selectedSIM - 1]}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </Card>
        )}

        {/* Step 4: Identity Verification */}
        {currentStep === 4 && (
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Identity Verification</h2>
              <p className="text-muted-foreground">Enter your email to receive a verification code</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-email"
                />
              </div>

              <Button 
                onClick={() => setShowOTP(true)} 
                className="w-full"
                disabled={!email}
                data-testid="button-send-otp"
              >
                Send Verification Code
              </Button>
            </div>
          </Card>
        )}

        {/* Step 5: Document Upload */}
        {currentStep === 5 && (
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Upload ID Document</h2>
              <p className="text-muted-foreground">Please upload a valid government-issued ID</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ID Type</Label>
                <Select value={idType} onValueChange={setIdType}>
                  <SelectTrigger data-testid="select-id-type">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Philippine Passport</SelectItem>
                    <SelectItem value="national-id">National ID</SelectItem>
                    <SelectItem value="drivers-license">Driver's License</SelectItem>
                    <SelectItem value="umid">UMID</SelectItem>
                    <SelectItem value="sss">SSS ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DocumentUpload
                label="ID Front"
                onUpload={(file) => handleFileUpload(file, 'front')}
                preview={frontDoc}
                onRemove={() => setFrontDoc(undefined)}
              />

              <DocumentUpload
                label="ID Back"
                onUpload={(file) => handleFileUpload(file, 'back')}
                preview={backDoc}
                onRemove={() => setBackDoc(undefined)}
              />
            </div>
          </Card>
        )}

        {/* Step 6: Address Information */}
        {currentStep === 6 && (
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Address Information</h2>
              <p className="text-muted-foreground">Provide your residential address</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Address Type</Label>
                <RadioGroup defaultValue="house">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="house" id="house" data-testid="radio-house" />
                    <Label htmlFor="house" className="font-normal">House</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="condo" id="condo" data-testid="radio-condo" />
                    <Label htmlFor="condo" className="font-normal">Condominium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="building" id="building" data-testid="radio-building" />
                    <Label htmlFor="building" className="font-normal">Building</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="house-number">House/Lot Number</Label>
                  <Input id="house-number" placeholder="123" data-testid="input-house-number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street Name</Label>
                  <Input id="street" placeholder="Main Street" data-testid="input-street" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Province</Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger data-testid="select-province">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metro-manila">Metro Manila</SelectItem>
                    <SelectItem value="cavite">Cavite</SelectItem>
                    <SelectItem value="bulacan">Bulacan</SelectItem>
                    <SelectItem value="cebu">Cebu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={city} onValueChange={setCity} disabled={!province}>
                    <SelectTrigger data-testid="select-city">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {province === 'metro-manila' && (
                        <>
                          <SelectItem value="makati">Makati City</SelectItem>
                          <SelectItem value="manila">Manila City</SelectItem>
                          <SelectItem value="quezon">Quezon City</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Barangay</Label>
                  <Select disabled={!city}>
                    <SelectTrigger data-testid="select-barangay">
                      <SelectValue placeholder="Select barangay" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centro">Barangay Centro</SelectItem>
                      <SelectItem value="poblacion">Barangay Poblacion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">Zip Code</Label>
                <Input id="zip" value="1200" disabled data-testid="input-zip" />
                <p className="text-xs text-muted-foreground">Auto-populated based on selected location</p>
              </div>
            </div>
          </Card>
        )}

        {/* Step 7: Employment Information */}
        {currentStep === 7 && (
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Employment Information</h2>
              <p className="text-muted-foreground">Tell us about your employment status</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <RadioGroup value={employmentType} onValueChange={setEmploymentType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full-time" id="full-time" data-testid="radio-full-time" />
                    <Label htmlFor="full-time" className="font-normal">Full-time Employee</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self-employed" id="self-employed" data-testid="radio-self-employed" />
                    <Label htmlFor="self-employed" className="font-normal">Self-employed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unemployed" id="unemployed" data-testid="radio-unemployed" />
                    <Label htmlFor="unemployed" className="font-normal">Unemployed</Label>
                  </div>
                </RadioGroup>
              </div>

              {employmentType !== 'unemployed' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="employer">Employer Name</Label>
                    <Input id="employer" placeholder="ABC Corporation" data-testid="input-employer" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input id="job-title" placeholder="Software Engineer" data-testid="input-job-title" />
                    </div>
                    <div className="space-y-2">
                      <Label>Position Level</Label>
                      <Select>
                        <SelectTrigger data-testid="select-position-level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Monthly Income Range</Label>
                    <Select>
                      <SelectTrigger data-testid="select-income">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-25k">Below ₱25,000</SelectItem>
                        <SelectItem value="25-50k">₱25,000 - ₱50,000</SelectItem>
                        <SelectItem value="50-75k">₱50,000 - ₱75,000</SelectItem>
                        <SelectItem value="75-100k">₱75,000 - ₱100,000</SelectItem>
                        <SelectItem value="100k+">Above ₱100,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start-date">Employment Start Date</Label>
                    <Input id="start-date" type="date" data-testid="input-start-date" />
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Step 8: Store Assignment */}
        {currentStep === 8 && (
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Collection Store</h2>
              <p className="text-muted-foreground">Your device will be available for pickup at this location</p>
            </div>

            <Card className="p-6 bg-muted">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Smartify Store - Makati</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Ground Floor, Ayala Center, Makati City, Metro Manila</span>
                    </p>
                    <p className="ml-6">Operating Hours: Mon-Sun, 10:00 AM - 9:00 PM</p>
                    <p className="ml-6">Contact: (02) 8123-4567</p>
                  </div>
                </div>
              </div>
            </Card>

            <p className="text-sm text-muted-foreground">
              You will receive an SMS notification when your device is ready for pickup. Please bring a valid ID when collecting your device.
            </p>
          </Card>
        )}

        {/* Step 9: Review Application */}
        {currentStep === 9 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Review Your Application</h2>
                <p className="text-muted-foreground mb-6">
                  Please review all information before submitting
                </p>

                <div className="space-y-4">
                  <ReviewSection title="Product Details" defaultOpen>
                    <ReviewItem label="Device" value={selectedProductData?.name || 'Premium Flagship - 256GB'} />
                    <ReviewItem label="Plan" value={selectedPlanData?.name || 'Unlimited Data Plan'} />
                    <ReviewItem label="Contract" value="24 months" />
                  </ReviewSection>

                  <ReviewSection title="Customer Information">
                    <ReviewItem label="Email" value={email || 'user@example.com'} />
                    <ReviewItem label="ID Type" value={idType || 'Philippine Passport'} />
                    <ReviewItem label="Address" value="123 Main St, Makati City" />
                  </ReviewSection>

                  <ReviewSection title="Employment Information">
                    <ReviewItem label="Type" value={employmentType === 'full-time' ? 'Full-time Employee' : employmentType} />
                    <ReviewItem label="Employer" value="ABC Corporation" />
                    <ReviewItem label="Monthly Income" value="₱50,000 - ₱75,000" />
                  </ReviewSection>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-foreground">Privacy Preferences</h3>
                <div className="space-y-3">
                  {[
                    { id: 'offers', label: 'Receive product offers and promotions' },
                    { id: 'partners', label: 'Share information with trusted partners' },
                    { id: 'customization', label: 'Personalize my experience' },
                    { id: 'analytics', label: 'Analytics and performance tracking' },
                    { id: 'marketing', label: 'Marketing communications' },
                    { id: 'thirdParty', label: 'Third-party integrations' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={item.id}
                        checked={privacyChecks[item.id as keyof typeof privacyChecks]}
                        onCheckedChange={(checked) => 
                          setPrivacyChecks(prev => ({ ...prev, [item.id]: checked as boolean }))
                        }
                        data-testid={`checkbox-${item.id}`}
                      />
                      <Label htmlFor={item.id} className="font-normal text-sm cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-semibold text-foreground">Terms & Conditions</h3>
                <div className="space-y-3">
                  {[
                    { id: 'terms', label: 'I agree to the Terms and Conditions', required: true },
                    { id: 'privacy', label: 'I agree to the Privacy Policy', required: true },
                    { id: 'contract', label: 'I agree to the 24-month service contract', required: true }
                  ].map((item) => (
                    <div key={item.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={item.id}
                        checked={termsChecks[item.id as keyof typeof termsChecks]}
                        onCheckedChange={(checked) => 
                          setTermsChecks(prev => ({ ...prev, [item.id]: checked as boolean }))
                        }
                        data-testid={`checkbox-${item.id}`}
                      />
                      <Label htmlFor={item.id} className="font-normal text-sm cursor-pointer">
                        {item.label}
                        {item.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <PaymentSummary
                items={[
                  { label: selectedProductData?.name || 'Premium Flagship', amount: selectedProductData?.price || 45999 },
                  { label: selectedPlanData?.name || 'Unlimited Data Plan', amount: selectedPlanData?.price || 999, description: '24 months contract' },
                  { label: 'SIM Activation', amount: 100 }
                ]}
                oneTimeCashout={5999}
                monthlyPayment={selectedProductData?.monthlyPayment || 1917}
              />
            </div>
          </div>
        )}

        {/* Step 10: Sign & Submit */}
        {currentStep === 10 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Sign Your Application</h2>
              <p className="text-muted-foreground mb-6">
                Please provide your digital signature to complete the application
              </p>

              <SignatureCanvas
                onSave={(signature) => {
                  console.log('Signature saved');
                  handleSubmit();
                }}
              />
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 10 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              data-testid="button-back"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              data-testid="button-next"
            >
              {currentStep === 9 ? 'Proceed to Sign' : 'Continue'}
            </Button>
          </div>
        )}
      </main>

      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onVerify={(code) => {
          console.log('OTP verified:', code);
          setShowOTP(false);
          handleNext();
        }}
        email={email}
        onResend={() => console.log('Resend OTP')}
      />
    </div>
  );
}
