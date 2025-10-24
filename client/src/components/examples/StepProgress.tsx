import StepProgress from '../StepProgress';

export default function StepProgressExample() {
  const steps = [
    'Verify Identity',
    'Upload Documents',
    'Address Info',
    'Employment',
    'Store',
    'Review',
    'Sign'
  ];

  return (
    <div className="space-y-8">
      <StepProgress currentStep={1} totalSteps={7} steps={steps} />
      <StepProgress currentStep={3} totalSteps={7} steps={steps} />
      <StepProgress currentStep={7} totalSteps={7} steps={steps} />
    </div>
  );
}
