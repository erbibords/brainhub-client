import React from "react";
import { Button } from "antd";
import clsx from "clsx";

const CustomButton = ({ children, type = "primary", ...others }) => {
  return (
    <Button
      className={clsx("text-white", {
        "bg-primary": type === "primary",
        "bg-secondary": type === "secondary",
        "bg-tertiary": type === "tertiary",
        "bg-success": type === "edit",
        "bg-secondary": type === "delete",
      })}
      size="large"
      {...others}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
