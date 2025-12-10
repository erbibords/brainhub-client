import { useMemo, useRef } from "react";
import { Table, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import usePayment from "../../hooks/usePayment";
import logo from "../../assets/images/brainhub-logo-new.png";
import { formatDate, formatAmount } from "../../utils/formatting";
import { useReactToPrint } from "react-to-print";

const Receipt = () => {
  const navigate = useNavigate();
  const params = useParams();

  if (!params?.paymentId) {
    navigate("/payments/list");
  }

  const {
    data: paymentDetails,
    error: getPaymentsError,
    isLoading: getPaymentsLoading,
  } = usePayment(params?.paymentId);

  const contentToPrint = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: "Invoice Receipt",
  });

  const dataSource = useMemo(() => {
    // const particulars =
    //   `${paymentDetails?.enrollment?.courseOffering?.reviewProgram?.name}-${paymentDetails?.enrollment?.courseOffering?.yearOffered}` ??
    //   "";
    const particulars = (
      <span className="text-[11px]">
        {paymentDetails?.enrollment?.courseOffering?.reviewProgram?.name} -{" "}
        {paymentDetails?.enrollment?.courseOffering?.yearOffered}
        <br />
        <span className="text-[10px]">
          {paymentDetails?.enrollment?.courseOffering?.course?.name}
        </span>
      </span>
    );

    return [
      {
        key: "1",
        particulars,
        qty: "1",
        amount: formatAmount(paymentDetails?.amountPaid) ?? 0,
      },
    ];
  }, [paymentDetails]);

  const columns = [
    {
      title: "Particulars",
      dataIndex: "particulars",
      key: "particulars",
      render: (value) => <span className="">{value}</span>,
    },
    {
      title: "Qty.",
      dataIndex: "qty",
      key: "qty",
      render: (value) => <span className="">{value}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value) => <span className="">{value}</span>,
    },
  ];

  if (getPaymentsError) {
    return (
      <div className="w-full flex flex-col h-full items-center justify-center">
        <p className="mb-6 text-lg text-red-600">
          Error loading payment details.
        </p>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded"
          onClick={() => navigate("/payments/list")}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (getPaymentsLoading) {
    return (
      <div className="w-full flex flex-col h-full items-center justify-center">
        <p className="mb-6 text-lg">Generating Receipt...</p>
        <Spin size="large" />
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="w-full flex flex-col h-full items-center justify-center">
        <p className="mb-6 text-lg">Payment not found.</p>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded"
          onClick={() => navigate("/payments/list")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xs mx-auto font-mono text-[12px]">
      {/* Content to Print */}
      <div
        ref={contentToPrint}
        className="border border-gray-300 print:border-none"
        style={{
          fontFamily: "Courier New, monospace",
          lineHeight: "1.2",
          paddingLeft: "2px",
          paddingRight: "25px",
          paddingTop: "2px",
        }}
      >
        <div className="text-center">
          <img src={logo} alt="Brain Hub Logo" className="mx-auto mb-2" />
          <p className="text-sm">Iloilo Doctor&apos;s College</p>
          <p className="text-sm">West Timawa Molo 5000 Iloilo City</p>
          <p className="text-[14px] py-2">
            Non-Vat Reg. TIN: 310-118-125-00000
          </p>

          <h2 className="font-bold mt-2">INVOICE RECEIPT</h2>
          <p className="text-sm">No: {paymentDetails?.referenceNo || "N/A"}</p>
        </div>

        <hr className="my-2" />

        <div>
          <p>
            Date:{" "}
            {paymentDetails?.paidAt ? formatDate(paymentDetails.paidAt) : ""}
          </p>
          <p>
            Received From:{" "}
            <span className="font-bold">
              {paymentDetails?.enrollment?.student?.fullName?.toUpperCase() ||
                "N/A"}
            </span>
          </p>
          <p>
            Mode of Payment:{" "}
            <span className="font-bold">
              {paymentDetails?.paymentMethod || "N/A"}
            </span>
          </p>
        </div>

        <hr className="my-2" />

        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          size="small"
          className="text-[9px] font-mono"
          rowClassName={() => "font-bold"} // <- Add this line
        />

        <hr className="my-2" />

        <div className="text-right">
          <div className="flex justify-between">
            <span className="text-sm">Total Amount:</span>
            <span className="font-bold text-sm">
              {formatAmount(paymentDetails?.amountPaid ?? 0)}
            </span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p>{paymentDetails?.processedBy || ""}</p>
          <hr className="border-dashed" />
          <p className="text-xs">Authorized Signature</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-center gap-2 print:hidden">
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded"
          onClick={() => navigate("/payments/list")}
        >
          Close
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default Receipt;
