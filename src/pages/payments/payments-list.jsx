import React, { useState, useCallback, useEffect } from 'react';
import CustomInput from '../../components/Input/Input';
import CustomButton from '../../components/Button/Button';
import useSchools from '../../hooks/useSchools';
import { useCourse } from '../../contexts/courses';
import {
  Table,
  Row,
  Col,
  Space,
  Select,
  DatePicker,
  Image,
  Form,
  Button,
  Divider,
  Modal,
  Input,
} from 'antd';
import {
  SEMESTER,
  MEDIA_BASE_URL,
  YEAR,
  PAYMENT_METHODS,
  PAYMENTS_BASE_URL,
} from '../../constants';
import { usePaymentsContext } from '../../contexts/payments';
import GenericErrorDisplay from '../../components/GenericErrorDisplay/GenericErrorDisplay';
import { getCourseOfferingName } from '../../utils/mappings';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import useMutation from '../../hooks/useMutation';
import { cleanParams, formatAmount, formatDate } from '../../utils/formatting';
import Swal from 'sweetalert2';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PaymentsList = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedPaymentid, setSelectedPaymentId] = useState(undefined);
  const { payments, getPaymentsLoading, getPaymentsError, setParams } =
    usePaymentsContext();
  const { mutate: undoPaymentMutate, loading: undoPaymentLoading } =
    useMutation(
      `${PAYMENTS_BASE_URL}/${selectedPaymentid}`,
      'DELETE',
      'payments'
    );

  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();

  const [searchParams, setSearchParams] = useState({
    referenceNo: undefined,
    startDate: undefined,
    endDate: undefined,
    studentName: undefined,
    courseId: undefined,
    schoolId: undefined,
    semester: undefined,
    yearOffered: undefined,
    offeringType: undefined,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    setParams({});
  }, []);

  const handleFilter = useCallback(() => {
    setParams(cleanParams(searchParams));
  }, [setParams, searchParams]);

  const handleDateRangeChange = (dates) => {
    if (dates) {
      const [startDate, endDate] = dates;
      const formatedStartDate = DateTime.fromJSDate(startDate.toDate()).toISO({
        includeOffset: false,
      });
      const formattedEndDate = DateTime.fromJSDate(endDate.toDate()).toISO({
        includeOffset: false,
      });

      setSearchParams({
        ...searchParams,
        startDate: formatedStartDate,
        endDate: formattedEndDate,
      });
    } else {
      setDateRange({ start: null, end: null });
    }
  };

  const undoPayment = useCallback(async () => {
    if (!selectedPaymentid) return;

    try {
      const res = await undoPaymentMutate();
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Payment Removed!',
          timer: 2000,
        });
        setSelectedPaymentId(undefined);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error removing payment. Please try again!',
      });
    }
  }, [selectedPaymentid]);

  const columns = [
    {
      title: 'Name',
      render: (_, record) => record.enrollment.student.fullName,
    },
    {
      title: 'Reference',
      dataIndex: 'referenceNo',
      render: (data) => {
        if (data === 'undefined' || undefined || null) return '';
        return data;
      },
    },

    {
      title: 'Payment Amount',
      dataIndex: 'amountPaid',
      render: (data) => formatAmount(data ?? 0),
    },
    {
      title: 'Balance after payments',
      dataIndex: 'balance',
      key: 'balance',
      render: (data) => (
        <p className="text-red-600 font-bold">{formatAmount(data ?? 0)}</p>
      ),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Payment Date',
      dataIndex: 'paidAt',
      render: (data) => formatDate(data) ?? data,
    },
    {
      title: 'Attachment',
      dataIndex: 'attachment',
      render: (_, record) => {
        return record?.attachments?.length >= 1 &&
          record?.attachments[0] !== '' ? (
          <Image
            width={100}
            height={100}
            src={`${MEDIA_BASE_URL}/${record?.attachments[0]}`}
            alt={record?.attachments[0]}
            preview={{
              className: 'custom-image-preview',
              mask: <div>Click to preview</div>,
              maskClassName: 'custom-mask',
            }}
          />
        ) : (
          ''
        );
      },
    },
    {
      title: 'Offering',
      dataIndex: 'offering',
      render: (_, record) =>
        getCourseOfferingName(record.enrollment.courseOffering),
    },
    { title: 'Processed by', dataIndex: 'processedBy' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <CustomButton
            onClick={() => navigate(`/prints/receipt/${record?.id}`)}
          >
            Print
          </CustomButton>
          <Divider />
          <CustomButton
            type="delete"
            onClick={() => {
              setCurrentRecord(record);
              setIsModalVisible(true);
              setSelectedPaymentId(record.id);
            }}
          >
            Undo
          </CustomButton>
        </Space>
      ),
    },
  ];

  const handleOk = useCallback(() => {
    if (!selectedPaymentid) return;
    if (password === 'brainhubph2024') {
      undoPayment();
      setIsModalVisible(false);
      setPassword(null);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Password not matched!',
        timer: 2000,
      });
    }
  }, [selectedPaymentid, password]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Payment Lists</h1>
      <Form form={form}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Form.Item name="dateRange">
                  <p>Date From - Date To:</p>
                  <RangePicker
                    placeholder={['Date From', 'Date To']}
                    className="h-[50px] w-full"
                    onChange={handleDateRangeChange}
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item name="paymentMethod">
                  <p> Payment Method</p>
                  <Select
                    className="w-full"
                    size="large"
                    onChange={(val) =>
                      setSearchParams({
                        ...searchParams,
                        paymentMethod: val,
                      })
                    }
                    name="paymentMethod"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <Option value={pm.value} key={pm.value}>
                        {pm.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item name="referenceNo">
                  <p>Reference:</p>
                  <CustomInput
                    placeholder="Reference"
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        referenceNo: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item name="studentName">
                  <p>Student Name:</p>
                  <CustomInput
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        studentName: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="courseId">
                  <p>Course:</p>
                  <Select
                    className="w-full"
                    loading={getCoursesLoading}
                    disabled={getCoursesLoading || getCoursesError}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        courseId: e,
                      })
                    }
                  >
                    {courses &&
                      courses?.data?.map((course) => (
                        <Option value={course.id}> {course.name}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="schoolId">
                  <p>School:</p>
                  <Select
                    className="w-full"
                    oading={schoolsLoading}
                    disabled={schoolsLoading || schoolsError}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        schoolId: e,
                      })
                    }
                  >
                    {schools &&
                      schools?.data?.map((school) => (
                        <Option value={school.id}> {school.name}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="semester">
                  <p>Semester:</p>
                  <Select
                    className="h-[50px] w-full mb-[10px]"
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        semester: e,
                      })
                    }
                  >
                    {SEMESTER.map((sem) => (
                      <Option value={sem.value} key={sem.value}>
                        {sem.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item name="yearOffered">
                  <p>Year</p>
                  <Select
                    className="w-full"
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        yearOffered: e,
                      })
                    }
                  >
                    {YEAR?.map((year) => (
                      <Option value={year} key={year}>
                        {year}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="offeringType">
                  <p>Enrollee Type: </p>
                  <Select
                    loading={schoolsLoading}
                    disabled={schoolsLoading}
                    size="large"
                    className="custom-select"
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        offeringType: e,
                      })
                    }
                    placeholder="Select Enrollee Type" // Optional placeholder
                  >
                    <Option value="all" key="all">
                      All
                    </Option>
                    <Option value="COMBI" key="combi">
                      Combi Enrollee
                    </Option>
                    <Option value="REGULAR" key="regular">
                      Regular Enrollee
                    </Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3} className="flex items-center items-end mb-1">
                <CustomButton
                  type="primary"
                  size="large"
                  className="bg-primary text-white"
                  onClick={handleFilter}
                >
                  Filter
                </CustomButton>
                <Button
                  className="w-auto text-primary ms-2"
                  size="large"
                  htmlType="button"
                  onClick={() => {
                    form.resetFields();
                    setParams({
                      pageNo: 1,
                      pageSize: 25,
                    });
                    setSearchParams({
                      referenceNo: undefined,
                      startDate: undefined,
                      endDate: undefined,
                      studentName: undefined,
                      courseId: undefined,
                      schoolId: undefined,
                      semester: undefined,
                      yearOffered: undefined,
                    });
                  }}
                >
                  Clear
                </Button>
              </Col>

              <Col span={24}>
                <CustomButton
                  type="primary"
                  className="w-auto bg-success text-white mt-[25px] float-right"
                  size="large"
                  onClick={() => navigate(`/prints/payments`)}
                >
                  Print List
                </CustomButton>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            {getPaymentsError ? (
              <GenericErrorDisplay />
            ) : (
              <Table
                dataSource={payments && payments?.data}
                columns={columns}
                loading={getPaymentsLoading}
              />
            )}
          </Col>
        </Row>
      </Form>

      <Modal
        title="Are you sure you want to remove this?"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Input.Password
          placeholder="Enter password to remove"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default PaymentsList;
