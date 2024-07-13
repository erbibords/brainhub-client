import React, { useMemo, useRef } from "react";
import { Typography, Row, Col, Table, Form, Divider } from "antd";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { useParams, useNavigate } from "react-router-dom";
import { getPaymentById } from "../../utils/mappings";
import { usePaymentsContext } from "../../contexts/payments";
import logo from "../../assets/images/brainhub-logo-new.png";
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
            <label>
              {`${paymentDetails?.enrollment?.courseOffering?.reviewProgram?.name}-${paymentDetails?.enrollment?.courseOffering?.yearOffered}` ??
                ""}
            </label>
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
    <div className="max-w-md mx-auto font-sans text-xs">
      <div ref={contentToPrint} className="scale-100">
        <Form name="printReciept" layout="vertical" className="space-y-2">
          <div className="text-center mb-1">
            <div className="flex items-center justify-center">
              <img
                src={logo}
                alt="Brain Hub Logo"
                className="h-15 w-full mr-1"
              />
            </div>
            <Text className="text-center d-block text-xs">
              <p className="!mb-0">ALVIN D. ANDRADE - Prop</p>
              <p className="!mb-0">
                Iloilo Doctor's College West Timawa Molo 5000 Iloilo City
              </p>
              <p>Non-Vat Reg. TIN: 310-118-125-00000</p>
            </Text>
            <Row className="mb-1">
              <Col span={16} className="flex items-center">
                <Text className="mr-1 whitespace-nowrap text-xs">
                  INVOICE OFFICIAL RECEIPT
                </Text>
              </Col>
              <Col span={8} className="text-right">
                <Text className="mr-1 whitespace-nowrap text-xs">
                  No: {paymentDetails?.referenceNo}
                </Text>
              </Col>
            </Row>
          </div>

          <Row className="mb-1">
            <Col span={24} className="flex items-center">
              <Text className="mr-1 whitespace-nowrap text-xs">ORIGINAL:</Text>
              <CustomInput className="border-0 flex-grow text-xs" />
            </Col>
            <Col span={24}>
              <Text className="text-xs">
                Date: {formatDate(paymentDetails?.paidAt) ?? ""}
              </Text>
            </Col>
            <Col span={24} className="flex items-center mt-1">
              <Text className="mr-1 whitespace-nowrap text-xs">
                Received From:
              </Text>
              <Text className="mr-1 whitespace-nowrap text-xs font-bold max-w-[100px]">
                {paymentDetails?.enrollment?.student?.fullName
                  ?.toString()
                  .toUpperCase()}
              </Text>
            </Col>

            <Col span={24} className="flex items-center mt-1">
              <Text className="mr-1 whitespace-nowrap text-xs">
                Mode of payment:
              </Text>
              <Text className="mr-1 whitespace-nowrap text-xs font-bold max-w-[100px]">
                {paymentDetails?.paymentMethod}
              </Text>
            </Col>
          </Row>

          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
            size="small"
          />
          <Form.Item className="mt-1 flex justify-end">
            <Row className="mb-1">
              <Col span={12}>
                <Text className="float-right mt-1 mr-1 text-xs w-[100px]">
                  Total Amount:
                </Text>
              </Col>
              <Col span={12}>
                <Text className="float-right mt-1 mr-1 text-xs font-bold max-w-[100px] text-sm">
                  {formatAmount(paymentDetails?.amountPaid ?? 0)}
                </Text>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item className="mt-1 flex justify-end">
            <p> {paymentDetails?.processedBy} </p>
            <hr />
            <p className="text-center text-xs">Authorized Signature</p>
          </Form.Item>
        </Form>
      </div>

      <div className="flex gap-2 justify-center mt-2">
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
