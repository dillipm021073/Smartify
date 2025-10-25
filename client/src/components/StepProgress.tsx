import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
}

export default function StepProgress({ currentStep, totalSteps, steps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-foreground">
            Step {currentStep} of {totalSteps}
          </h2>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {steps && steps.length > 0 && (
          <div className="hidden md:flex items-center justify-between mt-4 gap-2">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              
              return (
                <div key={index} className="flex items-center flex-1">
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                        isCompleted 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : isCurrent
                          ? 'border-primary bg-background text-primary'
                          : 'border-muted bg-background text-muted-foreground'
                      }`}
                      data-testid={`step-indicator-${stepNumber}`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{stepNumber}</span>
                      )}
                    </div>
                    <span 
                      className={`text-sm transition-colors ${
                        isCurrent 
                          ? 'text-foreground font-medium' 
                          : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="h-px flex-1 mx-2 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
