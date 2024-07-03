import React, { useEffect } from "react";
import { Typography, Row, Col, Table, Form, Input } from "antd";
import CustomInput from "../../components/Input/Input";

const { Title, Text } = Typography;

const columns = [
  { title: "Particulars", dataIndex: "particulars", key: "particulars" },
  { title: "Qty.", dataIndex: "qty", key: "qty" },

  { title: "Amount", dataIndex: "amount", key: "amount" },
];

const dataSource = [
  {
    key: "1",
    particulars: "Test Parts",
    qty: "1",

    amount: "3000",
  },
];

const Receipt = () => {
  // useEffect(() => {
  //   window.print();
  // }, []);

  return (
    <div className="max-w-xl mx-auto p-5 font-sans">
      <Form name="printReciept" layout="vertical" className="space-y-4">
        <div className="text-center mb-5">
          <Title level={4} className="text-center">
            INTEGRATED EDUCATIONAL CORPORATION (ILOILO)
          </Title>
          <Text className="text-center d-block">NV-TIN 000-995-152-00000</Text>

          <Text className="text-center d-block">OFFICIAL RECEIPT</Text>
        </div>
        <Row className="mb-[10px]">
          <Col span={12}>
            <Text>ORIGINAL: 090322</Text>
          </Col>
        </Row>
        <Row className="mb-[10px]">
          <Col span={12}>
            <Text>Received from: REVIEW CENTER</Text>
          </Col>
          <Col span={12} className="text-right">
            <Text>Date: 7/02/2024</Text>
          </Col>
        </Row>
        <Row className="mb-[10px]">
          <Col span={12}>
            <Text>Business Name/Style:</Text>
          </Col>
        </Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
        />
        <Form.Item className="mt-2 flex justify-end">
          <Row className="mb-[10px]">
            <Col span={12}>
              <Text className="float-right mt-[10px] mr-[10px]">
                Total Amount
              </Text>
            </Col>
            <Col span={12}>
              <CustomInput
                className="border-t-0 border-x-0 border-b-0float-right bg-transparent"
                value="20000"
                readOnly
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item className="mt-2 flex justify-end">
          <CustomInput
            className="border-t-0 border-x-0 border-b-2 float-right bg-transparent"
            readOnly
          />
          <p className="text-center">Authorized Signature</p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Receipt;
