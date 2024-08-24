import React, { useEffect } from 'react';
import CustomInput from '../../components/Input/Input';
import { Select, Form, Checkbox } from 'antd';
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

const EditEnrollment = () => {
  const navigate = useNavigate();
  const params = useParams();
  if (!params?.enrollmentId) {
    navigate('/enrollments');
  }

  const [form] = Form.useForm();

  const { data, error } = useEnrollment(params?.enrollmentId);
  if (error) {
    navigate('/enrollments');
  }

  const { data: offerings } = useOfferingsContext();

  const { mutate: updatedEnrollment } = useMutation('', 'PUT', 'enrollments');

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data]);

  const onFormSubmission = async (values) => {
    const reviewFee =
      parseFloat(data?.discountAmount ?? 0) +
      parseFloat(values?.reviewFee) -
      parseFloat(values?.discountAmount ?? 0);

    const updatedValues = {
      ...values,
      reviewFee: reviewFee.toString(),
    };

    if (!updatedValues.takerType) {
      Swal.fire({
        icon: 'warning',
        title: 'Please add taker type!',
        timer: 2500,
      });
      return;
    }

    if (!updatedValues.processedBy) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select processed by.',
        timer: 2500,
      });
      return;
    }

    if (!updatedValues.yearLevel) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select year level.',
        timer: 2500,
      });
      return;
    }

    if (!updatedValues.reviewFee) {
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
          ...updatedValues,
          studentId: data.studentId,
        },
        `/branches/${DEFAULT_BRANCH_ID()}/offerings/${
          updatedValues.courseOffering.id
        }/enrollments`
      );
      if (enrollmentRes) {
        Swal.fire({
          icon: 'success',
          title: 'Enrollment Updated!',
          timer: 2500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Enrollment update failed!',
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
          className="w-full"
        >
          <h1 className="text-2xl mb-[2vh]">Edit Student Enrollment</h1>
          <Form.Item
            label="Student name"
            layout="vertical"
            name={['student', 'fullName']}
            className="w-1/2 mb-[2vh]"
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
            className="w-full mb-[2vh] w-full"
          >
            <input
              type="number"
              className="ant-input ant-input-lg css-dev-only-do-not-override-3rel02 ant-input-outlined ant-input-status-success w-1/2 mb-[2vh] px-[12px] py-[10px]"
            />
          </Form.Item>

          <Form.Item
            label="Discount Amount"
            name="discountAmount"
            layout="vertical"
            className="w-full mb-[2vh]"
          >
            <input
              type="number"
              className="ant-input ant-input-lg css-dev-only-do-not-override-3rel02 ant-input-outlined ant-input-status-success w-1/2 mb-[2vh] px-[12px] py-[10px]"
            />
          </Form.Item>

          <Form.Item
            name="backedout"
            layout="vertical"
            className="w-1/2 mb-[2vh]"
          >
            <Checkbox
              name="backedout"
              size="large"
              onChange={(e) => {
                form.setFieldsValue({ backedout: e.target.checked });
              }}
            >
              Backout
            </Checkbox>
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
