import React, { useEffect } from "react";
import { Form, Input, Radio, Typography } from "antd";

const { TextArea } = Input;
const { Title, Text } = Typography;

const PrintEnrollmentForm = () => {
  //   useEffect(() => {
  //     window.print();
  //   }, []);

  return (
    <div className="bg-white max-w-xl mx-auto">
      <div className="text-center  mb-5">
        <div className="text-2xl font-bold">BRAIN HUB REVIEW SPECIALIST</div>
      </div>

      <Title level={4} className="text-center">
        ENROLLMENT FORM
      </Title>
      <Form name="printEnrollmentForm" layout="vertical" className="space-y-4">
        <Text className="block text-center mb-4">
          (Intensive Review Program)
        </Text>

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

        <Form.Item label="COURSE" className="mb-4">
          <Input
            value="Bachelor of Science in Information Technology"
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

        <Form.Item label="Address:" className="mb-4">
          <Input
            value="Unhan Patyo"
            className="border-t-0 border-x-0 border-b-2 bg-transparent"
            readOnly
          />
        </Form.Item>

        <Form.Item label="CONTACT NUMBER:" className="mb-4">
          <Input
            value="0909032131232"
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

        <div className="mt-6">
          <Text className="block font-semibold mb-2">
            Person to be notified in case of emergency:
          </Text>
          <Form.Item label="NAME:" className="mb-4">
            <Input
              value="Lourds D Marte"
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
          </Form.Item>
          <Form.Item label="RELATIONSHIP:" className="mb-4">
            <Input
              value="Mother"
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
          </Form.Item>
          <Form.Item label="ADDRESS:" className="mb-4">
            <Input
              value="Unhan Plaza"
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
          </Form.Item>
          <Form.Item label="CONTACT NO:" className="mb-4">
            <Input
              value="090932132132"
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
          </Form.Item>
        </div>

        <div className="mt-4 text-xs">
          <p>FEES ARE NON-REFUNDABLE AND NON-TRANSFERABLE.</p>
          <p>
            THOUGH BRAINHUB'S PAYMENT SCHEMES ARE STAGGERED, THE REVIEWEE IS
            ENTITLED TO PAY THE ENTIRE AMOUNT OF THE REVIEW FEE ONCE ENROLLED IN
            THE PROGRAM.
          </p>
          <p>
            REVIEWERS ARE ALREADY CONSIDERED OFFICIALLY ENROLLED BY SIGNING THIS
            REGISTRATION FORM.
          </p>
        </div>

        <Form.Item className="mt-4">
          <Text className="block font-bold mb-2">
            REVIEW FEES SHOULD BE PAID IN FULL ON OR BEFORE:
          </Text>
        </Form.Item>

        <div className="mt-2 text-xs">
          <p>
            By signing below, I accept and agree to all of its terms and
            conditions. I enter into this agreement voluntarily, with full
            knowledge of its effect.
          </p>
        </div>

        <Form.Item className="mt-2 flex justify-end">
          <Input
            className="border-t-0 border-x-0 border-b-2 float-right bg-transparent"
            readOnly
          />
          <p>Signature over Printed Name</p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PrintEnrollmentForm;
