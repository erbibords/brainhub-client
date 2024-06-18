import React from "react";
import { Select } from "antd";
 
const CustomSelect = ({ type = "text", ...others }) => {
  
  return <Select className="px-[10px] py-[12px] w-full" {...others} size="large"></Select>;
};


export default CustomSelect;
