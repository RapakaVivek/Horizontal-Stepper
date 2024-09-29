import { useEffect, useRef, useState } from "react";

const CheckoutStepper = ({ stepsConfig = [], onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [margins, setMargins] = useState({ marginLeft: 0, marginRight: 0 });
  const stepRef = useRef([]);

  useEffect(() => {
    const calculateMargins = () => {
      if (stepRef.current.length > 0) {
        setMargins({
          marginLeft: stepRef.current[0].offsetWidth / 2,
          marginRight: stepRef.current[stepsConfig.length - 1]?.offsetWidth / 2,
        });
      }
    };
    calculateMargins();
  }, [stepsConfig.length]);

  if (!stepsConfig.length) {
    return null; 
  }

  const handleNext = () => {
    setCurrentStep((prevStep) => {
      if (prevStep === stepsConfig.length) {
        setIsComplete(true);
        if (onComplete) onComplete(); 
        return prevStep;
      } else {
        return prevStep + 1;
      }
    });
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1)); 
    setIsComplete(false); 
  };

  const handleSkip = () => {
    setCurrentStep((prevStep) => {
      if (prevStep + 1 < stepsConfig.length) {
        return prevStep + 2; // Skip one step
      }
      return prevStep; // Stay on the last step
    });
  };

  const calculateProgressBarWidth = () => {
    return ((currentStep - 1) / (stepsConfig.length - 1)) * 100;
  };

  const ActiveComponent = stepsConfig[currentStep - 1]?.Component;

  const getStepClassName = (index) => {
    if (currentStep > index + 1) {
      return 'step complete'; // Completed step
    } else if (currentStep === index + 1) {
      return 'step active'; // Active step
    } else {
      return 'step'; // Inactive step
    }
  };

  return (
    <>
      <div className="stepper">
        {stepsConfig.map((step, index) => (
          <div
            key={step.name}
            ref={(el) => (stepRef.current[index] = el)}
            className={getStepClassName(index)}
          >
            <div className="step-number">
              {currentStep > index + 1 ? (
                <span>&#10003;</span> // Completed step marker
              ) : (
                index + 1 // Current step number
              )}
            </div>
            <div className="step-name">{step.name}</div>
          </div>
        ))}
        <div
          className="progress-bar"
          style={{
            width: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
            marginLeft: margins.marginLeft,
            marginRight: margins.marginRight,
          }}
        >
          <div
            className="progress"
            style={{ width: `${calculateProgressBarWidth()}%` }}
          ></div>
        </div>
      </div>
      {ActiveComponent && <ActiveComponent />}
      <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button className="btn" onClick={handleBack} disabled={currentStep === 1}>
          Back
        </button>
        <button className="btn" onClick={handleNext} disabled={isComplete}>
          {currentStep === stepsConfig.length ? 'Complete' : 'Next'}
        </button>
        <button className={`btn ${isComplete || currentStep >= stepsConfig.length ? 'disabled' : ''}`} onClick={handleSkip} disabled={isComplete || currentStep >= stepsConfig.length}>
          Skip
        </button>
      </div>
    </>
  );
};

export default CheckoutStepper;
