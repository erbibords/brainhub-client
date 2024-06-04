import React from "react";
import { Input, InputNumber } from "antd";

const CustomInput = ({ type = "text", ...others }) => {
  if (type === "number") {
    return <InputNumber size="large" {...others} />;
  }
  if (type === "password") {
    return <Input.Password size="large" {...others} />;
  }
  return <Input {...others} size="large" />;
};

export default CustomInput;
