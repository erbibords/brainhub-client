import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import useProfile from "../../hooks/useStudentProfile";
import { SoaPayments } from "./soa-payments";
import { SoaParticulars } from "./soa-particulars";
import { useReactToPrint } from "react-to-print";
import CustomButton from "../../components/Button/Button";
import { formatAmount } from "../../utils/formatting";
import "./soa.css";
import logo from "../../assets/images/brainhub-logo-new.png";
import INTLogo from "../../assets/images/INT-logo.png";
import ENHLogo from "../../assets/images/ENH-logo.jpeg";

const StatementOfAccount = () => {
  const params = useParams();
  const { data, isLoading, error } = useProfile(params?.studentId);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Statement of Account",
    removeAfterPrint: true,
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading student data.
      </div>
    );
  }

  const { firstName, middleName, lastName } = data;

  console.log(data?.payments);

  // Calculate totals
  const totalReviewFee =
    data?.enrollments?.reduce((total, enrollment) => {
      return total + (parseFloat(enrollment?.reviewFee) || 0);
    }, 0) || 0;

  const totalDiscountAmount =
    data?.enrollments?.reduce((total, enrollment) => {
      return total + (parseFloat(enrollment?.discountAmount) || 0);
    }, 0) || 0;

  const totalAmountPaid =
    data?.enrollments?.reduce((total, enrollment) => {
      return total + (parseFloat(enrollment?.totalAmountPaid) || 0);
    }, 0) || 0;

  const totalRemainingBalance =
    totalReviewFee - totalDiscountAmount - totalAmountPaid;

  // Determine which logo to use based on the latest enrollment's review program
  const latestEnrollment = data?.enrollments?.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )?.[0];
  const reviewProgramName =
    latestEnrollment?.courseOffering?.reviewProgram?.name;

  let logoToUse = logo; // default to brainhub logo
  if (reviewProgramName?.toUpperCase().includes("ENHANCEMENT")) {
    logoToUse = ENHLogo;
  } else if (reviewProgramName?.toUpperCase().includes("INT")) {
    logoToUse = INTLogo;
  }

  return (
    <div>
      <CustomButton type="primary" onClick={handlePrint}>
        Print
      </CustomButton>
      <div className="max-w-2xl mx-auto bg-white p-2 rounded shadow mt-4">
        <div ref={printRef} className="p-2">
          <div className="mb-2">
            <div className="text-center mb-2">
              <img
                src={logoToUse}
                alt="Logo"
                className="h-12 mx-auto w-[280px]"
              />
            </div>
            <div className="mb-2">
              <p className="text-xs font-semibold">
                <span className="font-bold">Student Name:</span> {lastName},{" "}
                {firstName} {middleName}
              </p>
              <p className="text-xs font-semibold">
                <span className="font-bold">Course:</span>{" "}
                {data?.enrollments?.[0]?.courseOffering?.course?.name || "N/A"}
              </p>
            </div>
            <div className="text-center mb-2">
              <h3 className="text-sm font-bold">Statement of Account</h3>
            </div>
          </div>
          <div className="mb-1">
            <SoaParticulars enrollments={data?.enrollments ?? []} />
          </div>
          <div className="mb-1">
            <SoaPayments payments={data?.payments ?? []} />
          </div>
          <div className="mt-4 flex justify-end items-end">
            <div className="text-right space-y-1">
              <p className="text-xs">
                <span className="font-semibold">Total:</span>{" "}
                <span className="font-bold">
                  {formatAmount(totalReviewFee)}
                </span>
              </p>
              <p className="text-xs">
                <span className="font-semibold">Total Amount Paid:</span>{" "}
                <span className="font-bold">
                  {formatAmount(totalAmountPaid)}
                </span>
              </p>
              <p className="text-xs">
                <span className="font-semibold">Remaining Balance:</span>{" "}
                <span className="font-bold text-red-600">
                  {formatAmount(totalRemainingBalance)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementOfAccount;
