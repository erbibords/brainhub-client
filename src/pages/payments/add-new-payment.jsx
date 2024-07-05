import React, { useState, useCallback, useEffect } from 'react';
import CustomInput from '../../components/Input/Input';
import { useParams } from 'react-router-dom';
import { Layout, Select, Form, Image, DatePicker, Upload } from 'antd';
import useProfile from '../../hooks/useStudentProfile';
import CustomButton from '../../components/Button/Button';
import { DateTime } from 'luxon';
import useMutation from '../../hooks/useMutation';
import { getCourseOfferingName } from '../../utils/mappings';
import { ENROLLMENT_BASE_URL } from '../../constants';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const { Content } = Layout;
const { Option } = Select;

const AddNewPayment = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  if (!params?.studentId) {
    navigate('/students');
  }

  const { mutate: updatedPayment, loading: updateStudentLoading } = useMutation(
    '',
    'POST',
    'payments',
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  console.log('selectedFile', selectedFile);

  const { data: student } = useProfile(params?.studentId);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      processedBy,
      reference,
      paidAt,
    } = values;

    const isoPaidAt = DateTime.fromJSDate(paidAt.toDate()).toISO({
      includeOffset: false,
    });

    const paymentFormData = new FormData();
    paymentFormData.append('amountPaid', amountPaid);
    paymentFormData.append('paymentMethod', paymentMethod.toUpperCase());
    paymentFormData.append('processedBy', processedBy);
    paymentFormData.append('referenceNo', reference);
    paymentFormData.append('paidAt', isoPaidAt);

    if (selectedFile) {
      paymentFormData.append('file', selectedFile);
    }

    try {
      const res = await updatedPayment(
        paymentFormData,
        `${ENROLLMENT_BASE_URL}/${enrollmentId}/payments`
      );
      if (res) {
        navigate('/payments/list');
        Swal.fire({
          icon: 'success',
          title: 'Payments successfully added!',
          timer: 2000,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title:
          'Something went wrong on adding payments, Please try again later!',
        timer: 2000,
      });
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

  return (
    <Content style={{ paddingRight: screenWidth <= 1024 ? 0 : '45%' }}>
      <Form name="payments" onFinish={onFinish} layout="vertical">
        <div>
          <h1 className="text-2xl mb-[2vh]">Add Payments</h1>
          <p>Student Name: </p>
          <h1 className="text-2xl mb-7">
            {student?.firstName} {student?.middleName} {student?.lastName}
          </h1>

          <Form.Item
            className="mb-[32px]"
            label="Offering:"
            name="enrollmentId"
            rules={[{ required: true, message: 'Please select offering' }]}
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
            rules={[{ required: true, message: 'Please input payment amount' }]}
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
              { required: true, message: 'Please select a payment method.' },
            ]}
          >
            <Select className="w-full" size="large">
              <Option value="BANK_TRANSFER">Bank Transfer</Option>
              <Option value="CASH">Cash</Option>
              <Option value="GCASH">Gcash</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-[32px]" label="Reference:" name="reference">
            <CustomInput size="large" type="text" className="" />
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
              <div style={{ marginTop: '10px' }}>
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
              { required: true, message: 'Please select a payment date.' },
            ]}
          >
            <DatePicker className="w-full" size="large" />
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Processed By:"
            name="processedBy"
          >
            <CustomInput size="large" type="text" className="" />
          </Form.Item>

          <div className="text-center mb-[20px]">
            <Form.Item>
              <CustomButton
                type="primary"
                htmlType="submit"
                size="large"
                className="w-auto bg-primary text-white"
              >
                Submit
              </CustomButton>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Content>
  );
};

export default AddNewPayment;
