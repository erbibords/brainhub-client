import React from "react";
import { Input, InputNumber } from "antd";

const CustomInput = ({ type = "text", ...others }) => {
  if (type === "number") {
<<<<<<< HEAD
    return <InputNumber size="large" {...others} />;
  }
  if (type === "password") {
    return <Input.Password size="large" {...others} />;
=======
    return (
      <InputNumber className="px-[10px] py-[12px]" size="large" {...others} />
    );
  }
  if (type === "password") {
    return (
      <Input.Password
        className="px-[10px] py-[12px]"
        size="large"
        {...others}
      />
    );
>>>>>>> master
  }
  return <Input className="px-[10px] py-[12px]" {...others} size="large" />;
};

export default CustomInput;
