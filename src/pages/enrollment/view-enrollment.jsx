import React, { useEffect } from "react";
import { Form, Input, Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Title } = Typography;

const ViewEnrollmentForm = () => {
  return (
    <div>
      <Button
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
          <Input.Group compact>
            <Input
              value="Louie"
              style={{ width: "33%" }}
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
            <Input
              value="Marte"
              style={{ width: "33%" }}
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
            <Input
              value="Doromal"
              style={{ width: "33%" }}
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
          </Input.Group>
        </Form.Item>

        <Form.Item label="REVIEW PROGRAM" className="mb-4">
          <Input
            value="Intensive"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="SCHOOL:" className="mb-4">
          <Input
            value="University of Iloilo"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="Taker Type:" className="mb-4">
          <Input
            value="1st"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="COURSE" className="mb-4">
          <Input
            value="Bachelor of Science in Information Technology"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="Semester:" className="mb-4">
          <Input
            value="1st Semester"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="ENROLLMENT DATE:" className="mb-4">
          <Input
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
