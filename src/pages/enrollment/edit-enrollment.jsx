import React, { useState, useEffect } from 'react';
import CustomInput from '../../components/Input/Input';
import { Select, Input, Form } from 'antd';
import CustomButton from '../../components/Button/Button';
import useMutation from '../../hooks/useMutation';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { DEFAULT_BRANCH_ID, YEAR_LEVELS, PROCESSED_BY } from '../../constants';
import useEnrollment from '../../hooks/useEnrollment';
import { useOfferingsContext } from '../../contexts/offerings';
import { getCourseOfferingName } from '../../utils/mappings';
import Swal from 'sweetalert2';

const { Option } = Select;
const { TextArea } = Input;

const options = [
  {
    label: 'Existing',
    value: 'existing',
  },
  {
    label: 'New',
    value: 'new',
  },
];

const EditEnrollment = () => {
  const navigate = useNavigate();
  const params = useParams();
  if (!params?.enrollmentId) {
    console.log('INSLAHADW');
    navigate('/enrollments');
  }

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const { data, error, isLoading } = useEnrollment(params?.enrollmentId);
  if (error) {
    console.log('ERRROIST', error);
    navigate('/enrollments');
  }

  const { data: offerings } = useOfferingsContext();

  console.log('======DATA=====', data);

  const { mutate: updatedEnrollment, loading: addEnrollmentLoading } =
    useMutation('', 'PUT', 'enrollments');

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data]);

  const onFormSubmission = async (values) => {
    console.log('values', values);

    if (!values.takerType) {
      Swal.fire({
        icon: 'warning',
        title: 'Please add taker type!',
        timer: 2500,
      });
      return;
    }

    if (!values.processedBy) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select processed by.',
        timer: 2500,
      });
      return;
    }

    if (!values.yearLevel) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select year level.',
        timer: 2500,
      });
      return;
    }

    if (!values.reviewFee) {
      Swal.fire({
        icon: 'warning',
        title: 'Please add review fee.',
        timer: 2500,
      });
      return;
    }

    try {
      const enrollmentRes = await updatedEnrollment(
        {
          ...values,
          studentId: data.studentId,
        },
        `/branches/${DEFAULT_BRANCH_ID}/offerings/${values.courseOffering.id}/enrollments`
      );
      if (enrollmentRes) {
        Swal.fire({
          icon: 'success',
          title: 'Enrollment successful!',
          text: 'Redirecting to enrollment form printing...',
          timer: 2500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Enrollment failed!',
        text: 'This may be due to inputs. Please try again later!',
        timer: 2500,
      });
    }
  };

  return (
    <div className="w-full">
      <div>
        <CustomButton
          type="text"
          onClick={() => navigate('/enrollments')}
          icon={<ArrowLeftOutlined />}
          className="mb-6"
        />

        <Form
          onFinish={onFormSubmission}
          form={form}
          layout="vertical"
          className="w-1/2"
        >
          <h1 className="text-2xl mb-[2vh]">Edit Student Enrollment</h1>
          <Form.Item
            label="Student name"
            layout="vertical"
            name={['student', 'fullName']}
            className="w-full mb-[2vh]"
          >
            <CustomInput type="text" name="remarks" disabled />
          </Form.Item>

          <Form.Item
            label="Course Offering:"
            name={['courseOffering', 'id']}
            layout="vertical"
            className="w-1/2 mb-[2vh]"
          >
            <Select size="large" disabled={error}>
              {offerings &&
                offerings?.data?.map((offering) => {
                  return (
                    <Option key={offering?.id} value={offering?.id}>
                      {getCourseOfferingName(offering)}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Year Level"
            name="yearLevel"
            layout="vertical"
            className="w-1/2 mb-[2vh]"
          >
            <Select size="large" name="yearLevel">
              {YEAR_LEVELS?.map((year) => (
                <Option value={year} key={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="takerType"
            label="Taker type"
            layout="vertical"
            className="w-1/2"
          >
            <Select className="w-full mb=[2vh]" size="large">
              <Option value="FIRST_TAKER">1st Taker</Option>
              <Option value="RE_TAKER">Re-taker</Option>
              <Option value="SUMMER">Summer</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Review Fee"
            name="reviewFee"
            layout="vertical"
            className="w-1/2 mb-[2vh]"
          >
            <CustomInput
              className="w-1/2 mb-[2vh] px-[12px] py-[10px]"
              type="text"
            />
          </Form.Item>

          <Form.Item
            label="Discount Amount"
            name="discountAmount"
            layout="vertical"
            className="w-1/2 mb-[2vh]"
          >
            <CustomInput type="text" name="discount" onChange={(e) => {}} />
          </Form.Item>

          <Form.Item
            label="Remarks"
            name="remarks"
            layout="vertical"
            className="w-1/2 mb-[2vh]"
          >
            <CustomInput type="text" name="remarks" onChange={(e) => {}} />
          </Form.Item>

          <Form.Item
            label="Processed by:"
            name="processedBy"
            layout="vertical"
            className="w-1/2 mb-[2vh]"
          >
            <Select
              size="large"
              onChange={(value) => setSelectedProcessedBy(value)}
            >
              {PROCESSED_BY.map((processedby) => (
                <Option value={processedby} key={processedby}>
                  {processedby}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="flex justify-center w-1/2">
            <CustomButton type="primary" htmlType="submit" size="large">
              Update
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditEnrollment;
