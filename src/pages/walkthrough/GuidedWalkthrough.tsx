import React, { useState } from "react";
import Joyride, { CallBackProps, Step, STATUS } from "react-joyride";

const steps: Step[] = [
  {
    target: ".nav-scheduling",
    content: "Schedule and manage your meetings here.",
    disableBeacon: true,
  },
  {
    target: ".nav-documents",
    content: "Upload, review, and e-sign documents here.",
    disableBeacon: true,
  },
  {
    target: ".nav-payments",
    content: "Simulate wallet transactions and funding deals here.",
    disableBeacon: true,
  },
  {
    target: ".nav-video",
    content: "Join or start a video call here.",
    disableBeacon: true,
  },
];

export default function GuidedWalkthrough() {
  const [run, setRun] = useState(true);

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      disableScrolling={false}
      spotlightPadding={8}
      callback={handleCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#2563EB",
          textColor: "#111827",
          overlayColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    />
  );
}