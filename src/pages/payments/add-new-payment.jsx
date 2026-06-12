import { useState, useEffect, useMemo, useCallback } from "react";
import CustomInput from "../../components/Input/Input";
import { useParams } from "react-router-dom";
import {
  Layout,
  Select,
  Form,
  Image,
  DatePicker,
  Upload,
  Divider,
} from "antd";
import useProfile from "../../hooks/useStudentProfile";
import CustomButton from "../../components/Button/Button";
import { DateTime } from "luxon";
import useMutation from "../../hooks/useMutation";
import { getCourseOfferingName } from "../../utils/mappings";
import {
  BANK_NAMES_BASE_URL,
  ENROLLMENT_BASE_URL,
  PAYMENT_METHODS,
  PROCESSED_BY,
} from "../../constants";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useCashReference from "../../hooks/useCashReference";
import dayjs from "dayjs";
import axiosInstance from "../../utils/axiosInstance";
import BankNameModal from "../../components/BankNameModal/BankNameModal";
const { Content } = Layout;
const { Option } = Select;

const AddNewPayment = () => {
  const [form] = Form.useForm();
  const [bankForm] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [bankOptions, setBankOptions] = useState([]);
  const [isBankLoading, setIsBankLoading] = useState(false);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: cashReference} = useCashReference();
  const enrollmentBaseUrl = useMemo(() => ENROLLMENT_BASE_URL(), []);
  const bankNamesBaseUrl = useMemo(() => BANK_NAMES_BASE_URL(), []);

  if (!params?.studentId) {
    navigate("/students");
  }

  const { mutate: updatedPayment } = useMutation(
    enrollmentBaseUrl,
    "POST",
    ["payments-", "enrollments-", "students-"],
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const { mutate: createBankName, loading: createBankLoading } = useMutation(
    bankNamesBaseUrl,
    "POST"
  );

  const { data: student } = useProfile(params?.studentId);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (selectedPaymentMethod && selectedPaymentMethod === "CASH") {
      form.setFieldsValue({ reference: cashReference?.referenceNo ?? null });
    } else {
      form.setFieldsValue({ reference: null });
    }
  }, [selectedPaymentMethod, cashReference?.referenceNo, form]);

  const loadBankOptions = useCallback(async () => {
    setIsBankLoading(true);
    try {
      const response = await axiosInstance.get(bankNamesBaseUrl, {
        params: {
          isActive: true,
          pageNo: 1,
          pageSize: 200,
        },
      });
      setBankOptions(response.data?.data ?? []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to load banks",
        text: "Please try again later.",
      });
    } finally {
      setIsBankLoading(false);
    }
  }, [bankNamesBaseUrl]);

  useEffect(() => {
    if (selectedPaymentMethod === "CHECK") {
      loadBankOptions();
      return;
    }

    form.setFieldsValue({ bankNameId: undefined });
  }, [form, loadBankOptions, selectedPaymentMethod]);

  const courseOfferings = student?.enrollments
    ? student?.enrollments.map((enrollment) => ({
        key: enrollment.id,
        name: getCourseOfferingName(enrollment.courseOffering),
      }))
    : [];

  const onFinish = async (values) => {
    const {
      enrollmentId,
      amountPaid,
      paymentMethod,
      bankNameId,
      processedBy,
      reference,
      paidAt,
    } = values;
    setIsSubmitting(true);
    if ((selectedPaymentMethod !== "CASH" && !reference) || reference === "") {
      Swal.fire({
        icon: "warning",
        title: "Please add reference no.",
        timer: 2000,
      });
      setIsSubmitting(false);
      return;
    }

    const isoPaidAt = DateTime.fromJSDate(paidAt.toDate()).toISO({
      includeOffset: false,
    });

    const paymentFormData = new FormData();
    paymentFormData.append("amountPaid", amountPaid);
    paymentFormData.append("paymentMethod", paymentMethod.toUpperCase());
    paymentFormData.append("processedBy", processedBy);
    paymentFormData.append("referenceNo", reference);
    paymentFormData.append("paidAt", isoPaidAt);

    if (paymentMethod?.toUpperCase() === "CHECK" && bankNameId) {
      paymentFormData.append("bankNameId", bankNameId);
    }

    if (selectedFile) {
      paymentFormData.append("file", selectedFile);
    }

    try {
      const res = await updatedPayment(
        paymentFormData,
        `${enrollmentBaseUrl}/${enrollmentId}/payments`
      );
      if (res) {
        setTimeout(() => {
          navigate(`/prints/receipt/${res.id}`);
          Swal.fire({
            icon: "success",
            title: "Payments successfully added!",
            timer: 2000,
          });
          setIsSubmitting(false);
        }, 2500);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title:
          "Something went wrong on adding payments, Please try again later!",
        timer: 2000,
      });
      setIsSubmitting(false);
    }
  };

  const handlePreview = async (file) => {
    const preview = await getBase64(file);
    setImagePreview(preview);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = (info) => {
    const file = info.file.originFileObj || info.fileList[0].originFileObj;
    setSelectedFile(file);
    handlePreview(file);
  };

  const today = dayjs();

  const handlePaymentMethodChange = (value) => {
    setSelectedPaymentMethod(value);
    if (value !== "CHECK") {
      form.setFieldsValue({ bankNameId: undefined });
    }
  };

  const handleOpenBankModal = () => {
    bankForm.resetFields();
    bankForm.setFieldsValue({
      code: "",
      name: "",
    });
    setIsBankModalVisible(true);
  };

  const handleCloseBankModal = () => {
    setIsBankModalVisible(false);
    bankForm.resetFields();
  };

  const handleCreateBankName = async (values) => {
    try {
      const res = await createBankName({
        code: values.code || null,
        name: values.name,
        isActive: true,
      });

      if (res) {
        await loadBankOptions();
        form.setFieldsValue({ bankNameId: res.id });
        handleCloseBankModal();
        Swal.fire({
          icon: "success",
          title: "Bank Added!",
          timer: 2000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to add bank",
        text:
          error?.response?.data?.message ??
          "Please check the input and try again.",
      });
    }
  };

  const shouldShowBankSelector = selectedPaymentMethod === "CHECK";

  return (
    <Content style={{ paddingRight: screenWidth <= 1024 ? 0 : "45%" }}>
      <Form
        name="payments"
        onFinish={onFinish}
        layout="vertical"
        form={form}
        initialValues={{
          paidAt: today,
        }}
      >
        <div>
          <CustomButton
            type="text"
            onClick={() => navigate("/students")}
            icon={<ArrowLeftOutlined />}
            className="mb-6"
          />
          <h1 className="text-2xl mb-[2vh]">Add Payments</h1>
          <p>Student Name: </p>
          <h1 className="text-2xl mb-7">
            {student?.firstName} {student?.middleName} {student?.lastName}
          </h1>

          <Form.Item
            className="mb-[32px]"
            label="Offering:"
            name="enrollmentId"
            rules={[{ required: true, message: "Please select offering" }]}
          >
            <Select
              className="w-full"
              size="large"
              placeholder="Course Offering"
            >
              {courseOfferings.map((course) => (
                <Option key={course.key} value={course.key}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Amount:"
            name="amountPaid"
            rules={[{ required: true, message: "Please input payment amount" }]}
          >
            <CustomInput
              type="number"
              placeholder="Payment"
              className=" w-full"
            />
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Payment Method:"
            name="paymentMethod"
            rules={[
              { required: true, message: "Please select a payment method." },
            ]}
          >
            <Select
              className="w-full"
              size="large"
              onChange={handlePaymentMethodChange}
              name="paymentMethod"
            >
              {PAYMENT_METHODS.map((pm) => (
                <Option value={pm.value} key={pm.value}>
                  {pm.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {shouldShowBankSelector ? (
            <Form.Item
              className="mb-[32px]"
              label="Bank:"
              name="bankNameId"
              rules={[
                {
                  required: true,
                  message: "Please select a bank for check payments.",
                },
              ]}
            >
              <Select
                className="w-full"
                size="large"
                placeholder="Select bank"
                loading={isBankLoading}
                optionFilterProp="children"
                showSearch
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <div
                      className="px-2 pb-2"
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      <CustomButton
                        type="primary"
                        icon={<PlusOutlined />}
                        className="w-auto bg-primary text-white"
                        onClick={handleOpenBankModal}
                      >
                        Add Bank
                      </CustomButton>
                    </div>
                  </>
                )}
              >
                {bankOptions.map((bank) => (
                  <Option key={bank.id} value={bank.id}>
                    {bank.code ? `${bank.code} - ${bank.name}` : bank.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : null}

          <Form.Item className="mb-[32px]" label="Reference:" name="reference">
            <CustomInput
              size="large"
              type="text"
              className=""
              disabled={selectedPaymentMethod === "CASH"}
            />
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Attachment:"
            valuePropName="file"
            extra="Select a file to upload"
          >
            <Upload
              accept="image/png, image/jpeg"
              maxCount={1}
              listType="picture-card"
              beforeUpload={() => false}
              onChange={handleFileChange}
              showUploadList={false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>

            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <Image
                  src={imagePreview}
                  alt="Selected"
                  className="max-h-[300px] w-[200px] object-contain"
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Payment Date:"
            name="paidAt"
            rules={[
              { required: true, message: "Please select a payment date." },
            ]}
          >
            <DatePicker
              className="w-full"
              size="large"
              defaultValue={today}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Processed By:"
            name="processedBy"
            rules={[
              { required: true, message: "Please select a payment method." },
            ]}
          >
            <Select className="w-full" size="large" name="processedBy">
              {PROCESSED_BY?.map((processedBy) => (
                <Option value={processedBy} key={processedBy}>
                  {processedBy}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="text-center mb-[20px]">
            <Form.Item>
              <CustomButton
                type="primary"
                htmlType="submit"
                size="large"
                className="w-auto bg-primary text-white"
                loading={isSubmitting}
              >
                Submit
              </CustomButton>
            </Form.Item>
          </div>
        </div>
      </Form>

      <BankNameModal
        open={isBankModalVisible}
        title="Add Bank"
        form={bankForm}
        onCancel={handleCloseBankModal}
        onSave={handleCreateBankName}
        confirmLoading={createBankLoading}
        showIsActive={false}
      />
    </Content>
  );
};

export default AddNewPayment;
