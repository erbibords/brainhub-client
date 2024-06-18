import React from "react";
import clsx from "clsx";
import { Alert } from "antd";

const ErrorDisplay = (className) => {
  return (
    <div className={clsx("flex justify-center items-center", className)}>
      <Alert
        message="Error"
        description="There's something wrong loading the page. Please try again later."
        type="error"
        showIcon
        className="max-w-md"
      />
    </div>
  );
};

export default ErrorDisplay;
