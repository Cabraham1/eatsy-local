interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              currentStep >= step
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={`mx-2 h-1 w-16 md:w-24 ${
                currentStep > step ? "bg-orange-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

