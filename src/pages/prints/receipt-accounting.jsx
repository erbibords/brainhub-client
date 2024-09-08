import React, { useMemo, useRef } from "react";
import { Typography, Row, Col, Table, Form } from "antd";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { useParams, useNavigate } from "react-router-dom";
import { getPaymentById } from "../../utils/mappings";
import { usePaymentsContext } from "../../contexts/payments";
import logo from "../../assets/images/brainhub-logo-new.png";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { formatDate, formatAmount } from "../../utils/formatting";
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

  const shortenParticulars = (particulars) => {
    if (!particulars) return "";

    // Handle INTENSIVE and ENHANCEMENT cases
    let shortenedProgram = particulars;

    if (
      shortenedProgram.includes("INTENSIVE") &&
      shortenedProgram.includes("ENHANCEMENT")
    ) {
      shortenedProgram = shortenedProgram
        .replace("INTENSIVE", "INT")
        .replace("ENHANCEMENT", "ENH");
    } else if (shortenedProgram.includes("INTENSIVE")) {
      shortenedProgram = shortenedProgram.replace("INTENSIVE", "INT");
    } else if (shortenedProgram.includes("ENHANCEMENT")) {
      shortenedProgram = shortenedProgram.replace("ENHANCEMENT", "ENH");
    }

    // Split the string by "-"
    const parts = shortenedProgram.split("-");

    // Handle the year part: if there are two years (e.g., 2024-2025), shorten them to 24-25
    const yearParts = parts.slice(-2).map((year) => {
      return year.length === 4 ? year.slice(2) : year; // Shorten 2024 -> 24
    });

    // Combine the shortened program part and the year part
    const shortened = [...parts.slice(0, -2), ...yearParts].join("-");

    return shortened;
  };

  const dataSource = useMemo(() => {
    const originalParticulars =
      `${paymentDetails?.enrollment?.courseOffering?.reviewProgram?.name}-${paymentDetails?.enrollment?.courseOffering?.yearOffered}` ??
      "";

    return [
      {
        key: "1",
        particulars: shortenParticulars(originalParticulars), // Apply the updated shortening logic here
        qty: "1",
        amount: formatAmount(paymentDetails?.amountPaid) ?? 0,
      },
    ];
  }, [paymentDetails, formatAmount]);

  const columns = useMemo(() => {
    return [
      {
        title: "Particulars",
        dataIndex: "particulars",
        key: "particulars",
        render: (_, record) => <label>{record.particulars}</label>, // Now it renders the shortened value
      },
      { title: "Qty.", dataIndex: "qty", key: "qty" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
    ];
  }, [dataSource]);

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: "Receipt",
  });

  return (
    <div className="max-w-md mx-auto font-sans text-xs">
      <div ref={contentToPrint} className="scale-100 space-y-2 px-1">
        <Form name="printReciept">
          <div className="text-center mb-1">
            <div className="flex items-center justify-center">
              <img src={logo} alt="Brain Hub Logo" className="h-15 w-full" />
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
                  INVOICE RECEIPT
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
              <div className="w-[100%]">
                <Text className="mr-1 whitespace-nowrap text-xs">
                  Received From:
                </Text>
                <Text className="mr-1 text-xs font-bold overflow-hidden text-ellipsis break-words">
                  {paymentDetails?.enrollment?.student?.fullName
                    ?.toString()
                    .toUpperCase()}
                </Text>
              </div>
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
                <Text className="float-right mt-1 mr-1 text-xs font-bold max-w-[100px] text-xs">
                  {formatAmount(paymentDetails?.amountPaid ?? 0)}
                </Text>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item className="mt-1 flex justify-end">
            <p className="mt-5"> {paymentDetails?.processedBy} </p>
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
