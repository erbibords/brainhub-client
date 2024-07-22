import React, { useMemo, useRef } from "react";
import { Form, Input, Typography } from "antd";
import { useParams } from "react-router-dom";
import useProfile from "../../hooks/useStudentProfile";
import { useNavigate } from "react-router-dom";
import { formatTakerType } from "../../utils/formatting";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import CustomButton from "../../components/Button/Button";
import { useReactToPrint } from "react-to-print";
import logo from "../../assets/images/brainhub-logo2.png";
const { Title, Text } = Typography;

const PrintEnrollmentForm = () => {
  const navigate = useNavigate();
  const params = useParams();

  if (!params?.studentId) {
    navigate("/add-enrollment");
  }

  if (!params?.enrollmentId) {
    navigate("/add-enrollment");
  }

  const { data, error } = useProfile(params?.studentId);

  const getEnrollment = useMemo(() => {
    return data?.enrollments?.filter(
      (enrollment) => enrollment?.id === params?.enrollmentId
    )[0];
  }, [data, params]);

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <GenericErrorDisplay />
        <CustomButton>Proceed to Receipt Printing</CustomButton>
      </div>
    );
  }

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    removeAfterPrint: true,
  });

  return (
    <div className="bg-white max-w-xl mx-auto">
      <div ref={contentToPrint} className="p-4">
        <div className="text-center mb-5">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Brain Hub Logo" className="h-15 w-full mr-2" />
            {/* <div className="text-2xl font-bold">REVIEW SPECIALIST</div> */}
          </div>
        </div>
        <Title level={4} className="text-center">
          REGISTRATION FORM
        </Title>
        <Form
          name="printEnrollmentForm"
          layout="vertical"
          className="space-y-4"
        >
          <Text className="block text-center mb-4">
            ({getEnrollment?.courseOffering?.reviewProgram?.name})
          </Text>

          <Form.Item label="NAME:" className="mb-4">
            <Input.Group compact>
              <Input
                value={data?.firstName}
                style={{ width: "33%" }}
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
              <Input
                value={data?.middleName}
                style={{ width: "33%" }}
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
              <Input
                value={data?.lastName}
                style={{ width: "33%" }}
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Input.Group>
          </Form.Item>

          <Form.Item label="COURSE" className="mb-4">
            <Input
              value={getEnrollment?.courseOffering?.course?.name}
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
          </Form.Item>

          <Form.Item label="SCHOOL:" className="mb-4">
            <Input
              value={data?.school?.name}
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
          </Form.Item>

          <Form.Item label="Address:" className="mb-4">
            <Input
              value={data?.address}
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
          </Form.Item>

          <Form.Item label="CONTACT NUMBER:" className="mb-4">
            <Input
              value={data?.contactNumber}
              className="border-t-0 border-x-0 border-b-2 bg-transparent"
              readOnly
            />
          </Form.Item>

          <Form.Item label="Taker Type:" className="mb-4">
            <Input
              value={formatTakerType(getEnrollment?.takerType)}
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
                value={data?.emergencyContact?.name}
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
            <Form.Item label="RELATIONSHIP:" className="mb-4">
              <Input
                value={data?.emergencyContact?.relationship}
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
            <Form.Item label="ADDRESS:" className="mb-4">
              <Input
                value={data?.emergencyContact?.address}
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
            <Form.Item label="CONTACT NO:" className="mb-4">
              <Input
                value={data?.emergencyContact?.contactNumber}
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
          </div>

          <div className="mt-4 text-xs">
            <p>FEES ARE NON-REFUNDABLE AND NON-TRANSFERABLE.</p>
            <p>
              THOUGH BRAINHUB'S PAYMENT SCHEMES ARE STAGGERED, THE REVIEWEE IS
              ENTITLED TO PAY THE ENTIRE AMOUNT OF THE REVIEW FEE ONCE ENROLLED
              IN THE PROGRAM.
            </p>
            <p>
              REVIEWERS ARE ALREADY CONSIDERED OFFICIALLY ENROLLED BY SIGNING
              THIS REGISTRATION FORM.
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

          <Form.Item className="mt-2 flex justify-end ">
            <div className="w-[250px]">
              <Input
                value={data?.fullName}
                className="border-t-0 border-x-0 border-b-2 bg-transparent text-center text-xs"
                readOnly
              />
              <p className="text-center">Signature over Printed Name</p>
            </div>
          </Form.Item>
        </Form>
      </div>
      <div className="mb-5 mt-5 w-full flex gap-2 justify-end">
        <CustomButton
          type="primary"
          size="large"
          onClick={() => {
            handlePrint(null, () => contentToPrint.current);
          }}
        >
          Print RF
        </CustomButton>

        <CustomButton
          type="edit"
          size="large"
          onClick={() => {
            navigate(`/payments/add/${params?.studentId}`);
          }}
        >
          Proceed to Payment
        </CustomButton>
      </div>
    </div>
  );
};

export default PrintEnrollmentForm;
