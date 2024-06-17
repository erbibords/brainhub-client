import React, { useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button"
 
import {  Table, Space, Row, Col, Button , Select, Form, DatePicker} from "antd";
 

const Option = {Select}

const AddOfferings = () => {
   
 
  return (
          <div className="w-1/2">
            <h1 className="text-2xl mb-[2vh]">
              Add Offerings
            </h1>
            <Form layout="vertical" >
                <Form.Item
                label="Course"
                name="courseId"
                rules={[{ required: true, message: "Please input the Course!" }]}
                >
                <Select
                            placeholder="Course"
                            defaultValue="Information Technology"
                            onChange={(value) => setSelectedCourse(value)}
                            className="h-[40px] w-full mb-[10px]"
                        >
                            <Option value="Information Technology">Information Technology</Option>
                            <Option value="Computer Science">Computer Science</Option>
                        
                        </Select>
                </Form.Item>
               

                <Form.Item
                label="Program"
                name="program"
                rules={[{ required: true, message: "Please input the Semester!" }]}
                >
                <Select
                        placeholder="Program"
                        defaultValue="Intensive"
                        onChange={(value) => setSelectedSemester(value)}
                        className="h-[40px] w-full mb-[10px]"
                        >
                    <Option value="Intensive">Intensive</Option>
                        <Option value="Enhancement-Intensive">Enhancement-Intensive</Option>
                        </Select>
                </Form.Item>

                <Form.Item
                label="Semester Offered"
                name="semester"
            
                rules={[{ required: true, message: "Please input the Semester!" }]}
                >
                <Select
                        placeholder="Semester"
                        defaultValue="1st"
                        onChange={(value) => setSelectedSemester(value)}
                        className="h-[40px] w-full mb-[10px]"
                        >
                        <Option value="1st">1st</Option>
                        <Option value="2nd">2nd</Option>
                        <Option value="Summer">Summer</Option>
                        </Select>
                </Form.Item>


                <Form.Item
                label="Year Offered"
                name="yearOffered"
                rules={[{ required: true, message: "Please input the Year!" }]}
                >
                <Select
                        placeholder="Year"
                        defaultValue="2024"
                        onChange={(value) => setSelectedYear(value)}
                        className="h-[40px] w-full mb-[10px]"
                    >
                        <Option value="2023">2023</Option>
                        <Option value="2024">2024</Option>
                        <Option value="2025">2025</Option>
                        <Option value="2026">2026</Option>
                        <Option value="2027">2027</Option>
                        <Option value="2028">2028</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                label="Payment Deadline"
                name="paymentDeadline"
                rules={[{ required: true, message: "Please input the Payment Deadline!" }]}
                >
                <DatePicker  className = "w-full"></DatePicker>
                </Form.Item>

                <Form.Item
                label="Capacity"
                name="enrollmentCapacity"
                rules={[{ required: true, message: "Please input the Capacity!" }]}
                >
                <CustomInput type = "number" className = "w-full"></CustomInput>
                </Form.Item>

                <Form.Item
                label="Review Cost"
              
                name="reviewCost"
                rules={[{ required: true, message: "Please input the Capacity!" }]}
                >
                <CustomInput type = "text" className = "w-full h-[40px]"></CustomInput>
                </Form.Item>

                <div className="text-right mb-5">
                    <Form.Item>
                        <CustomButton type="primary" htmlType="submit" size="large">
                        Submit
                        </CustomButton>
                    </Form.Item>
                    </div>
            </Form>


         

          </div>

          
      
  );
};

export default AddOfferings;
