import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SignatureCanvas from "@/components/SignatureCanvas";
import ReviewSection, { ReviewItem } from "@/components/ReviewSection";
import StepProgress from "@/components/StepProgress";
import { CheckCircle2, ArrowLeft, ArrowRight, FileText, Phone, Loader2 } from "lucide-react";
import type { Application } from "@/lib/api";
import { useAssignApplication, useVerifyApplication, useAgentApplicationDetails, useAvailableNumbers, useAssignNumber, apiRequest } from "@/lib/api";
import logoImage from '@assets/generated_images/Smartify_company_logo_b23637a9.png';

interface AgentReviewFlowProps {
  application: Application;
  agentId: string;
  agentName: string;
  storeId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const steps = [
  'Store Assignment',
  'Review Application',
  'Privacy & Signature'
];

export default function AgentReviewFlow({
  application,
  agentId,
  agentName,
  storeId,
  onComplete,
  onCancel
}: AgentReviewFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [signature, setSignature] = useState<string>('');
  const [selectedMsisdn, setSelectedMsisdn] = useState<string>('');
  const signatureRef = useRef<any>(null);

  // Fetch full application details with order items
  const { data: fullApplication, isLoading: loadingDetails } = useAgentApplicationDetails(application.id);
  const { data: availableNumbers, isLoading: loadingNumbers } = useAvailableNumbers(100);
  const assignNumberMutation = useAssignNumber();

  // Privacy preferences state
  const [productOffers, setProductOffers] = useState(false);
  const [trustedPartners, setTrustedPartners] = useState(false);
  const [customization, setCustomization] = useState(false);
  const [sisterCompanies, setSisterCompanies] = useState(false);
  const [businessPartners, setBusinessPartners] = useState(false);
  const [tapasilogSolutions, setTapasilogSolutions] = useState(false);

  // Terms acceptance state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyNoticeAccepted, setPrivacyNoticeAccepted] = useState(false);
  const [subscriberDeclarationAccepted, setSubscriberDeclarationAccepted] = useState(false);

  const assignMutation = useAssignApplication();
  const verifyMutation = useVerifyApplication();

  // Initialize selected MSISDN if already assigned
  useEffect(() => {
    if (application.assignedNumber) {
      // Find the MSISDN ID from the assigned number
      const assigned = availableNumbers?.find(n => n.msisdn === application.assignedNumber);
      if (assigned) {
        setSelectedMsisdn(assigned.id);
      }
    }
  }, [application.assignedNumber, availableNumbers]);

  const handleNext = async () => {
    if (currentStep === 1) {
      // Step 1: Assign application to agent
      // Only assign if not already assigned to this agent
      if (!application.assignedAgentId || application.assignedAgentId !== agentId) {
        try {
          const updatedApp = await assignMutation.mutateAsync({
            applicationId: application.id,
            agentId,
            storeId
          });
          console.log('Application assigned successfully:', updatedApp);
          // Force refetch of application details
          await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure DB is updated
          setCurrentStep(2);
        } catch (error) {
          console.error('Failed to assign application:', error);
          alert('Failed to assign application. Please try again.');
        }
      } else {
        // Already assigned to this agent, just move forward
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Step 3: Submit privacy preferences and signature
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate signature
    if (!signature) {
      alert('Please provide a signature before submitting.');
      return;
    }

    // Validate terms acceptance
    if (!termsAccepted || !privacyNoticeAccepted || !subscriberDeclarationAccepted) {
      alert('Please accept all required terms and declarations.');
      return;
    }

    try {
      console.log('Starting application submission...', {
        applicationId: application.id,
        agentId,
        storeId,
        status: application.status,
        assignedAgentId: application.assignedAgentId
      });

      // 1. Save privacy preferences
      console.log('Saving privacy preferences...');
      await apiRequest("POST", `/api/applications/${application.id}/privacy-preferences`, {
        productOffers,
        trustedPartners,
        customization,
        sisterCompanies,
        businessPartners,
        tapasilogSolutions,
        termsAccepted,
        privacyNoticeAccepted,
        subscriberDeclarationAccepted
      });
      console.log('Privacy preferences saved successfully');

      // 2. Upload signature
      console.log('Uploading signature...');
      await apiRequest("POST", `/api/applications/${application.id}/signature`, {
        signatureDataUrl: signature
      });
      console.log('Signature uploaded successfully');

      // 3. Verify application
      console.log('Verifying application...', { applicationId: application.id, agentId });
      await verifyMutation.mutateAsync({
        applicationId: application.id,
        agentId
      });
      console.log('Application verified successfully');

      onComplete();
    } catch (error) {
      console.error('Failed to submit application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to submit application: ${errorMessage}\n\nPlease check the console for more details.`);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) {
      // Must have assigned number before proceeding
      return !!application.assignedNumber || !!selectedMsisdn;
    }
    if (currentStep === 3) {
      return signature && termsAccepted && privacyNoticeAccepted && subscriberDeclarationAccepted;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logoImage} alt="Smartify" className="h-8" />
              <h1 className="text-lg font-semibold text-foreground">Complete Application Review</h1>
            </div>
            <Badge variant="outline">Agent: {agentName}</Badge>
          </div>
        </div>
      </header>

      <StepProgress currentStep={currentStep} totalSteps={3} steps={steps} />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Step 1: Store Assignment */}
        {currentStep === 1 && (
          <Card className="p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Step 8: Store Assignment</h2>
                <p className="text-muted-foreground">
                  This application will be automatically assigned to your store and agent profile.
                </p>
              </div>

              <ReviewSection title="Application Information" defaultOpen>
                <ReviewItem label="Cart ID" value={application.cartId} />
                <ReviewItem label="Email" value={application.email} />
                <ReviewItem label="Customer ID" value={application.customerIdNumber || 'Not provided'} />
                <ReviewItem label="SIM Type" value={application.simType || 'N/A'} />
                <ReviewItem label="Current Status" value={application.status} />
              </ReviewSection>

              <ReviewSection title="Assignment Details" defaultOpen>
                <ReviewItem label="Assigned Store" value={storeId} />
                <ReviewItem label="Assigned Agent" value={agentName} />
                <ReviewItem label="Agent ID" value={agentId} />
              </ReviewSection>

              {application.status === 'pending' && (
                <div className="bg-blue-500/10 text-blue-700 border border-blue-300 rounded-md p-4">
                  <p className="text-sm">
                    <strong>Note:</strong> Clicking "Continue" will assign this application to you and change the status to "submitted".
                  </p>
                </div>
              )}

              {application.status === 'submitted' && application.assignedAgentId === agentId && (
                <div className="bg-green-500/10 text-green-700 border border-green-300 rounded-md p-4">
                  <p className="text-sm">
                    <strong>Already Assigned:</strong> This application is already assigned to you.
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Step 2: Review Application */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Step 9: Review Application</h2>
                  <p className="text-muted-foreground">
                    Please review all customer information and assign a phone number.
                  </p>
                </div>

                {loadingDetails ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-3 text-muted-foreground">Loading application details...</span>
                  </div>
                ) : (
                  <>
                    {/* Order Details - Plan & Device */}
                    <ReviewSection title="📦 Order Summary" defaultOpen>
                      {fullApplication?.orderItems && fullApplication.orderItems.length > 0 ? (
                        fullApplication.orderItems.map((item) => (
                          <div key={item.id} className="space-y-4">
                            {/* Plan Details */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Mobile Plan
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <ReviewItem
                                  label="Plan"
                                  value={item.plan?.name || 'Plan not found'}
                                />
                                <ReviewItem
                                  label="Monthly Fee"
                                  value={`₱${parseFloat(item.planPrice).toFixed(2)}/month`}
                                />
                                {item.plan?.features && (
                                  <>
                                    {item.plan.features.data && (
                                      <ReviewItem label="Data" value={item.plan.features.data} />
                                    )}
                                    {item.plan.features.calls && (
                                      <ReviewItem label="Calls" value={item.plan.features.calls} />
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Device Details */}
                            <div className="p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-md">
                              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Device
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <ReviewItem
                                  label="Device"
                                  value={item.device?.name || 'Device not found'}
                                />
                                <ReviewItem
                                  label="Full Price"
                                  value={`₱${parseFloat(item.devicePrice).toFixed(2)}`}
                                />
                                {item.device?.brand && (
                                  <ReviewItem label="Brand" value={item.device.brand} />
                                )}
                                {item.device?.model && (
                                  <ReviewItem label="Model" value={item.device.model} />
                                )}
                              </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">💰 Payment Summary</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <ReviewItem
                                  label="One-Time Down Payment"
                                  value={`₱${parseFloat(item.oneTimeCashout).toFixed(2)}`}
                                />
                                <ReviewItem
                                  label="Monthly Installment"
                                  value={`₱${parseFloat(item.monthlyPayment).toFixed(2)}`}
                                />
                                <ReviewItem
                                  label="Total Monthly"
                                  value={`₱${(parseFloat(item.monthlyPayment) + parseFloat(item.planPrice)).toFixed(2)}`}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-yellow-500/10 text-yellow-700 border border-yellow-300 rounded-md p-4">
                          <p className="text-sm">
                            <strong>⚠️ Warning:</strong> No order items found for this application. The customer may not have completed the device and plan selection step.
                          </p>
                        </div>
                      )}
                    </ReviewSection>

                    <ReviewSection title="Assignment Information" defaultOpen>
                      <ReviewItem
                        label="Store ID"
                        value={(fullApplication?.storeId || application.storeId || storeId) || 'Not assigned'}
                      />
                      <ReviewItem
                        label="Agent ID"
                        value={(fullApplication?.assignedAgentId || application.assignedAgentId || agentId) || 'Not assigned'}
                      />
                      <ReviewItem
                        label="Agent Name"
                        value={agentName}
                      />
                    </ReviewSection>

                    <ReviewSection title="Customer Information" defaultOpen>
                      <ReviewItem label="Email" value={application.email} />
                      <ReviewItem label="Email Verified" value={application.emailVerified ? 'Yes' : 'No'} />
                      <ReviewItem label="SIM Type" value={application.simType || 'N/A'} />
                    </ReviewSection>

                    <ReviewSection title="Identification">
                      <ReviewItem label="ID Type" value={application.customerIdType || 'Not provided'} />
                      <ReviewItem label="ID Number" value={application.customerIdNumber || 'Not provided'} />
                    </ReviewSection>

                    <ReviewSection title="Application Details">
                      <ReviewItem label="Cart ID" value={application.cartId} />
                      <ReviewItem label="Application ID" value={application.id} />
                      <ReviewItem label="Status" value={fullApplication?.status || application.status} />
                      <ReviewItem label="Created" value={new Date(application.createdAt).toLocaleString()} />
                      {(fullApplication?.submittedAt || application.submittedAt) && (
                        <ReviewItem label="Submitted" value={new Date(fullApplication?.submittedAt || application.submittedAt).toLocaleString()} />
                      )}
                    </ReviewSection>
                  </>
                )}
              </div>
            </Card>

            {/* MSISDN Selection Card */}
            <Card className="p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Assign Phone Number (MSISDN)</h3>
                    <p className="text-sm text-muted-foreground">
                      Select an available phone number to assign to this customer.
                    </p>
                  </div>
                </div>

                {application.assignedNumber ? (
                  <div className="bg-green-500/10 text-green-700 border border-green-300 rounded-md p-4">
                    <p className="text-sm font-medium">
                      <CheckCircle2 className="inline w-4 h-4 mr-2" />
                      Number Already Assigned: <span className="font-bold">{application.assignedNumber}</span>
                    </p>
                    <p className="text-xs mt-1">
                      You can change this number by selecting a different one below.
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-500/10 text-yellow-700 border border-yellow-300 rounded-md p-3">
                    <p className="text-sm">
                      <strong>Required:</strong> You must assign a phone number before completing the application.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="msisdn-select">Available Phone Numbers</Label>
                  {loadingNumbers ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading available numbers...
                    </div>
                  ) : (
                    <Select value={selectedMsisdn} onValueChange={setSelectedMsisdn}>
                      <SelectTrigger id="msisdn-select">
                        <SelectValue placeholder="Select a phone number" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableNumbers && availableNumbers.length > 0 ? (
                          availableNumbers.map((number) => (
                            <SelectItem key={number.id} value={number.id}>
                              {number.msisdn}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No available numbers
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {selectedMsisdn && selectedMsisdn !== application.assignedNumber && (
                  <Button
                    onClick={async () => {
                      if (!selectedMsisdn) return;

                      try {
                        await assignNumberMutation.mutateAsync({
                          applicationId: application.id,
                          msisdnId: selectedMsisdn,
                          agentId
                        });
                        alert('Phone number assigned successfully!');
                      } catch (error: any) {
                        alert(`Failed to assign number: ${error.message}`);
                      }
                    }}
                    disabled={assignNumberMutation.isPending}
                    className="w-full"
                  >
                    {assignNumberMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Assigning Number...
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        Assign Selected Number
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>

            <div className="bg-blue-500/10 text-blue-700 border border-blue-300 rounded-md p-4">
              <p className="text-sm">
                <FileText className="inline w-4 h-4 mr-2" />
                Please verify all information and assign a phone number before proceeding to the final step.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Privacy & Signature */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Step 10: Privacy Preferences & Signature</h2>
                  <p className="text-muted-foreground">
                    Customer must review privacy preferences and provide their digital signature.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Marketing Communications</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    I would like to receive information about:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="productOffers"
                        checked={productOffers}
                        onCheckedChange={(checked) => setProductOffers(checked as boolean)}
                      />
                      <Label htmlFor="productOffers" className="text-sm cursor-pointer">
                        Product offers and service updates
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="trustedPartners"
                        checked={trustedPartners}
                        onCheckedChange={(checked) => setTrustedPartners(checked as boolean)}
                      />
                      <Label htmlFor="trustedPartners" className="text-sm cursor-pointer">
                        Offers from trusted partners
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="customization"
                        checked={customization}
                        onCheckedChange={(checked) => setCustomization(checked as boolean)}
                      />
                      <Label htmlFor="customization" className="text-sm cursor-pointer">
                        Personalized content and recommendations
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-foreground">Information Sharing</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    I consent to share my information with:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sisterCompanies"
                        checked={sisterCompanies}
                        onCheckedChange={(checked) => setSisterCompanies(checked as boolean)}
                      />
                      <Label htmlFor="sisterCompanies" className="text-sm cursor-pointer">
                        Sister companies for related services
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="businessPartners"
                        checked={businessPartners}
                        onCheckedChange={(checked) => setBusinessPartners(checked as boolean)}
                      />
                      <Label htmlFor="businessPartners" className="text-sm cursor-pointer">
                        Business partners for enhanced services
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tapasilogSolutions"
                        checked={tapasilogSolutions}
                        onCheckedChange={(checked) => setTapasilogSolutions(checked as boolean)}
                      />
                      <Label htmlFor="tapasilogSolutions" className="text-sm cursor-pointer">
                        Tapasilog Solutions for technical support
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Terms and Declarations</h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-muted rounded-md">
                    <Checkbox
                      id="termsAccepted"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="termsAccepted" className="text-sm cursor-pointer leading-relaxed">
                      <strong>Terms and Conditions:</strong> I have read and agree to the Terms and Conditions governing the use of Smartify SIM services.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-muted rounded-md">
                    <Checkbox
                      id="privacyNoticeAccepted"
                      checked={privacyNoticeAccepted}
                      onCheckedChange={(checked) => setPrivacyNoticeAccepted(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="privacyNoticeAccepted" className="text-sm cursor-pointer leading-relaxed">
                      <strong>Privacy Notice:</strong> I acknowledge that I have read and understood the Privacy Notice regarding the collection and use of my personal data.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-muted rounded-md">
                    <Checkbox
                      id="subscriberDeclarationAccepted"
                      checked={subscriberDeclarationAccepted}
                      onCheckedChange={(checked) => setSubscriberDeclarationAccepted(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="subscriberDeclarationAccepted" className="text-sm cursor-pointer leading-relaxed">
                      <strong>Subscriber Declaration:</strong> I declare that all information provided is true and accurate. I understand that providing false information may result in service termination.
                    </Label>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Customer Signature</h3>
                  <p className="text-sm text-muted-foreground">
                    Please ask the customer to sign below using the touch pad or mouse.
                  </p>
                </div>

                <SignatureCanvas
                  ref={signatureRef}
                  onSignatureChange={setSignature}
                />

                {!signature && (
                  <div className="bg-yellow-500/10 text-yellow-700 border border-yellow-300 rounded-md p-3">
                    <p className="text-sm">
                      <strong>Signature Required:</strong> Customer signature is mandatory to complete the application.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={assignMutation.isPending || verifyMutation.isPending}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={assignMutation.isPending || verifyMutation.isPending}
              >
                Cancel
              </Button>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || assignMutation.isPending || verifyMutation.isPending}
              className="sm:min-w-40"
            >
              {assignMutation.isPending || verifyMutation.isPending ? (
                'Processing...'
              ) : currentStep === 3 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete & Verify
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
