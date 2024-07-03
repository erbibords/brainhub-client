import React, { useEffect } from "react";
import { Form, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CustomButton from "../../components/Button/Button";
import CustomInput from "../../components/Input/Input";

const { Title } = Typography;

const ViewEnrollmentForm = () => {
  const navigate = useNavigate();

  return (
    <div>
      <CustomButton
        type="text"
        onClick={() => navigate("/enrollments")}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />

      <Title level={4} className="text-left">
        View Enrollment
      </Title>
      <br />
      <Form name="viewEnrollmentForm" layout="vertical" className="mt-[10px]">
        <Form.Item label="NAME:" className="mb-4">
          <div className="flex space-x-2">
            <CustomInput
              value="Louie"
              className="w-1/3 border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
            <CustomInput
              value="Marte"
              className="w-1/3 border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
            <CustomInput
              value="Doromal"
              className="w-1/3 border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
          </div>
        </Form.Item>

        <Form.Item label="REVIEW PROGRAM" className="mb-4">
          <CustomInput
            value="Intensive"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="SCHOOL:" className="mb-4">
          <CustomInput
            value="University of Iloilo"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="Taker Type:" className="mb-4">
          <CustomInput
            value="1st"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="COURSE" className="mb-4">
          <CustomInput
            value="Bachelor of Science in Information Technology"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="Semester:" className="mb-4">
          <CustomInput
            value="1st Semester"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="ENROLLMENT DATE:" className="mb-4">
          <CustomInput
            value="Jun, 23 2024"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ViewEnrollmentForm;
