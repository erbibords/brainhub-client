import React, { useMemo, useRef } from "react";
import { Typography, Row, Col, Table, Form } from "antd";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { useParams, useNavigate } from "react-router-dom";
import { getPaymentById } from "../../utils/mappings";
import { usePaymentsContext } from "../../contexts/payments";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import {
  formatDate,
  formatAmount,
  getCourseOfferingName,
} from "../../utils/formatting";
import { useReactToPrint } from "react-to-print";
const { Title, Text } = Typography;

const Receipt = () => {
  const navigate = useNavigate();
  const params = useParams();

  if (!params?.paymentId) {
    navigate("/payments/list");
  }
  const { payments, getPaymentsError } = usePaymentsContext();

  const paymentDetails = useMemo(() => {
    if (!payments?.data) return null;
    return getPaymentById(payments?.data, params?.paymentId);
  }, [params, payments]);

  if (getPaymentsError) {
    return (
      <div>
        <GenericErrorDisplay />
      </div>
    );
  }

  const dataSource = useMemo(() => {
    return [
      {
        key: "1",
        particulars:
          `${paymentDetails?.enrollment?.courseOffering?.reviewProgram?.name}-${paymentDetails?.enrollment?.courseOffering?.yearOffered}` ??
          "",
        qty: "1",
        amount: formatAmount(paymentDetails?.amountPaid) ?? 0,
      },
    ];
  }, [paymentDetails, formatAmount]);

  console.log(paymentDetails);

  const columns = useMemo(() => {
    return [
      {
        title: "Particulars",
        dataIndex: "particulars",
        key: "particulars",
        render: (_) => {
          return (
            <CustomInput
              className="border-0 text-xs"
              value={
                `${paymentDetails?.enrollment?.courseOffering?.reviewProgram?.name}-${paymentDetails?.enrollment?.courseOffering?.yearOffered}` ??
                ""
              }
            />
          );
        },
      },
      { title: "Qty.", dataIndex: "qty", key: "qty" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
    ];
  }, [paymentDetails, dataSource]);

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: "Receipt",
  });

  return (
    <div className="max-w-xl mx-auto p-5 font-sans">
      <div ref={contentToPrint} className="p-4">
        <Form name="printReciept" layout="vertical" className="space-y-4">
          <div className="text-center mb-5">
            <Title level={4} className="text-center">
              INTEGRATED EDUCATIONAL CORPORATION (ILOILO)
            </Title>
            <Text className="text-center d-block">
              NV-TIN 000-995-152-00000
            </Text>
          </div>
          <Row className="mb-[10px]">
            <Col span={24} className="flex items-center">
              <Text className="mr-2 whitespace-nowrap">ORIGINAL:</Text>
              <CustomInput className="border-0 flex-grow" />
            </Col>
          </Row>
          <Row className="mb-[10px]">
            <Col span={16} className="flex items-center">
              <Text className="mr-2 whitespace-nowrap">Received From:</Text>
              <CustomInput
                className="border-0 flex-grow text-sm"
                value={paymentDetails?.enrollment?.student?.fullName}
              />
            </Col>
            <Col span={8} className="text-right">
              <Text>Date: {formatDate(paymentDetails?.paidAt) ?? ""}</Text>
            </Col>
          </Row>
          <Row className="mb-[10px]">
            <Col span={24} className="flex items-center">
              <Text className="mr-2 whitespace-nowrap">
                Business Name/Style:
              </Text>
              <CustomInput className="border-0 flex-grow" />
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
                  Total Amount:
                </Text>
              </Col>
              <Col span={12}>
                <CustomInput
                  className="border-t-0 border-x-0 border-b-0float-right bg-transparent font-bold max-w-[140px] text-right"
                  value={formatAmount(paymentDetails?.amountPaid ?? 0)}
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

      <div className="flex gap-4 justify-center mt-5">
        <CustomButton
          type="delete"
          onClick={() => {
            navigate("/payments/list");
          }}
        >
          Close
        </CustomButton>
        <CustomButton onClick={handlePrint}>Print</CustomButton>
      </div>
    </div>
  );
};

export default Receipt;
