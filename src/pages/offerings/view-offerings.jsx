import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Select,
  Row,
  Col,
  Card,
  Divider,
  Skeleton,
  Form,
  DatePicker,
  Table,
  Statistic,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import useMutation from '../../hooks/useMutation';
import useCourses from '../../hooks/useCourses';
import Swal from 'sweetalert2';
import { OFFERING_BASE_URL } from '../../constants';
import useOffering from '../../hooks/useOffering';
import {
  formatAmount,
  formatDate,
  formatSemester,
} from '../../utils/formatting';
import { SEMESTER, YEAR } from '../../constants';
import CustomInput from '../../components/Input/Input';
import CustomButton from '../../components/Button/Button';
import { getDataById, getSchoolById } from '../../utils/mappings';
import useSchools from '../../hooks/useSchools';
import usePrograms from '../../hooks/usePrograms';
import dayjs from 'dayjs';
import { useBranch } from '../../contexts/branch';
import './view-offerings.css';

const { Option } = Select;

const ViewOffering = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data: schools } = useSchools();

  if (!params?.offeringId) {
    navigate('/offerings');
  }

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [searchAmount, setSearchAmount] = useState({
    min: 0,
    max: 200,
  });
  const [enrollments, setEnrollments] = useState([]);

  const { courses, error: coursesError } = useCourses();
  const {
    data: offering,
    isLoading,
    error: offeringError,
    refetch,
  } = useOffering(params.offeringId);
  const {
    programs,
    isLoading: getProgramsLoading,
    error: getProgramsError,
  } = usePrograms();
  const [offeringType, setOfferingType] = useState(offering?.offeringType);

  // Separate backed out students from active enrollments
  const backedOutStudents = useMemo(() => {
    if (!offering?.enrollments) return [];
    return offering.enrollments.filter((enrollment) => enrollment.backedOut);
  }, [offering?.enrollments]);

  const activeEnrollments = useMemo(() => {
    if (!offering?.enrollments) return [];
    return offering.enrollments.filter((enrollment) => !enrollment.backedOut);
  }, [offering?.enrollments]);

  useEffect(() => {
    if (!offering?.offeringType) return;
    setOfferingType(offering?.offeringType);
  }, [offering?.offeringType]);

  useEffect(() => {
    if (offering && offering?.enrollments?.length) {
      // Initialize with only active (non-backed-out) enrollments
      const active = offering.enrollments.filter(
        (enrollment) => !enrollment.backedOut
      );
      setEnrollments(active);
    }
  }, [offering]);

  if (coursesError || offeringError) {
    Swal.fire({
      icon: 'Error',
      title: 'Error viewing course offering. Please try again later',
      timer: 2000,
    });
    navigate('/offerings');
  }

  const { branchId } = useBranch();
  const offeringBaseUrl = useMemo(() => OFFERING_BASE_URL(), [branchId]);
  const OFFERING_ENTITY_URL = `${offeringBaseUrl}/${params.offeringId}`;
  const { mutate: updateOffering, loading: updateStudentLoading } = useMutation(
    OFFERING_ENTITY_URL,
    'PUT',
    'offerings'
  );

  useEffect(() => {
    if (offering) {
      form.setFieldsValue({
        ...offering,
        startDate: dayjs(offering?.startDate),
        paymentDeadline: dayjs(offering?.paymentDeadline),
      });
    }
  }, [offering]);

  const onFormFailed = (errorInfo) => {
    Swal.fire({
      icon: 'error',
      title: 'Student Information Update Error',
      text: JSON.stringify(errorInfo),
    });
  };

  const onFormSubmission = async (values) => {
    const { course, ...body } = values;
    try {
      const res = await updateOffering({
        ...body,
        courseId: course.id,
        startDate: offering.startDate,
        paymentDeadline: offering.paymentDeadline,
        reviewCost: values?.reviewFee,
        offeringType: values?.offeringType,
        schooId: values?.school ?? undefined,
      });

      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Offering information updated!',
          timer: 2000,
        });
        setIsEditing(false);
        refetch();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Offering Information Update Error',
        text: 'There might be some error in your entries. Please double check and try again!',
      });
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: ['student', 'fullName'],
      key: 'name',
      render: (name, record) => (
        <span
          className={`${record.backedOut ? 'bg-orange-200' : ''}`}
          style={{ textDecoration: record.backedOut ? 'underline' : 'none' }}
        >
          {name}
        </span>
      ),
    },
    {
      title: 'School',
      dataIndex: ['student', 'schoolId'],
      key: 'school',
      render: (data) => {
        const school = getSchoolById(schools?.data, data);
        return school?.name ?? '';
      },
    },
    {
      title: 'Review Fee',
      dataIndex: 'reviewFee',
      key: 'reviewFee',
      render: (data) => formatAmount(data),
    },
    {
      title: 'Discount Amount',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      render: (data) => formatAmount(data),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'reviewFee',
    },
    {
      title: 'Total Amount Paid',
      dataIndex: 'totalAmountPaid',
      key: 'totalAmountPaid',
      render: (data) => formatAmount(data),
    },
    {
      title: 'Remaining Balance',
      dataIndex: 'remainingBalance',
      key: 'remainingBalance',
      render: (data, row) => (
        <p className="text-red-600 font-bold">
          {formatAmount(parseFloat(data - row?.discountAmount ?? 0) ?? 0)}
        </p>
      ),
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (data) => formatDate(data),
    },
    {
      title: 'Enrollee Type',
      dataIndex: 'enrolleeType',
      key: 'enrolleeType',
    },

    {
      title: 'Processed By',
      dataIndex: 'processedBy',
      key: 'processedBy',
    },
  ];

  const filterEnrollment = useCallback(() => {
    if (!searchAmount.min && !searchAmount.max) {
      // Reset to all active enrollments
      setEnrollments(activeEnrollments);
      return;
    }
    if (!activeEnrollments?.length) return [];

    if (searchAmount?.min >= searchAmount?.max) {
      Swal.fire({
        icon: 'error',
        title: 'min amount cannot be greater than or equal to max amount!',
      });
      setEnrollments(activeEnrollments);
      return;
    }

    const data = activeEnrollments.filter(
      (record) =>
        record?.remainingBalance >= searchAmount.min &&
        record?.remainingBalance <= searchAmount.max
    );
    setEnrollments(data);
  }, [searchAmount, activeEnrollments]);

  const reviewProgram = useMemo(() => {
    if (!programs?.data || !offering?.reviewProgramId) return null;
    return getDataById(programs?.data, offering?.reviewProgramId);
  }, [programs, offering?.reviewProgramId]);

  return (
    <div>
      <CustomButton
        type="text"
        onClick={() => navigate('/offerings')}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={36} lg={36}>
          {!offering || isLoading ? (
            <Card>
              <Skeleton />
            </Card>
          ) : (
            <Card>
              <Form
                form={form}
                name="update_student"
                onFinish={onFormSubmission}
                onFinishFailed={onFormFailed}
                className="mb-10"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={16} lg={18}>
                    <h1 className="text-2xl mb-[2vh]">
                      {offering.course.name}:{' '}
                      {formatSemester(offering.semester)}
                      {' semester of '}
                      {offering.yearOffered}
                    </h1>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={6}>
                    <div className="text-right mb-5">
                      {isEditing ? (
                        <div className="flex justify-end">
                          <CustomButton
                            size="large"
                            className="mr-[10px]"
                            loading={updateStudentLoading}
                            disabled={updateStudentLoading}
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </CustomButton>

                          <CustomButton
                            size="large"
                            type="primary"
                            className="w-auto bg-primary text-white"
                            loading={updateStudentLoading}
                            disabled={updateStudentLoading}
                            htmlType="submit"
                          >
                            Save
                          </CustomButton>
                        </div>
                      ) : (
                        <CustomButton
                          type="primary"
                          size="large"
                          className="w-auto bg-primary text-white"
                          disabled={!offering && isLoading}
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </CustomButton>
                      )}
                    </div>
                  </Col>
                </Row>
                <Divider />
                <div layout="vertical" className="w-1/2">
                  <p>
                    <strong>Course:</strong>{' '}
                    {isEditing ? (
                      <Form.Item name={['course', 'id']}>
                        <Select
                          options={courses.data.map((course) => ({
                            value: course.id,
                            label: course.name,
                          }))}
                        />
                      </Form.Item>
                    ) : (
                      offering.course.name
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Review program:</strong>{' '}
                    {isEditing ? (
                      <Form.Item name="reviewProgramId">
                        <Select
                          disabled={getProgramsError || getProgramsLoading}
                          options={
                            programs &&
                            programs?.data.map((program) => ({
                              value: program.id,
                              label: program.name,
                            }))
                          }
                        />
                      </Form.Item>
                    ) : (
                      reviewProgram?.name
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Semester Offered:</strong>{' '}
                    {isEditing ? (
                      <Form.Item name="semester">
                        <Select
                          options={SEMESTER.map((semester) => ({
                            value: semester.value,
                            label: semester.value,
                          }))}
                        />
                      </Form.Item>
                    ) : (
                      formatSemester(offering.semester)
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>School Year:</strong>{' '}
                    {isEditing ? (
                      <Form.Item name="yearOffered">
                        <Select
                          options={YEAR.map((year) => ({
                            value: year,
                            label: year,
                          }))}
                        />
                      </Form.Item>
                    ) : (
                      offering.yearOffered
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Start date:</strong>{' '}
                    {isEditing ? (
                      <Form.Item>
                        <DatePicker
                          className="w-full"
                          size="large"
                          defaultValue={dayjs(offering?.startDate)}
                        />
                      </Form.Item>
                    ) : (
                      formatDate(offering.startDate)
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Payment Deadline:</strong>{' '}
                    {isEditing ? (
                      <Form.Item>
                        <DatePicker
                          className="w-full"
                          size="large"
                          defaultValue={dayjs(offering?.paymentDeadline)}
                        />
                      </Form.Item>
                    ) : (
                      formatDate(offering.paymentDeadline)
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Capacity:</strong> {offering.enrollmentCapacity}
                  </p>
                  <Divider />

                  <p>
                    <strong>Review cost:</strong>{' '}
                    {isEditing ? (
                      <Form.Item name="reviewFee">
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      offering.reviewFee
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Offering Type:</strong>{' '}
                    {isEditing ? (
                      <Form.Item name="offeringType">
                        <Select
                          className="h-[40px] w-full"
                          name="offeringType"
                          defaultValue={offering?.offeringType}
                          onChange={(value) => {
                            setOfferingType(value);
                          }}
                        >
                          <Option value="COMBI">COMBI</Option>
                          <Option value="REGULAR">REGULAR</Option>
                        </Select>
                      </Form.Item>
                    ) : (
                      offering?.offeringType
                    )}
                  </p>
                  {offeringType === 'REGULAR' && (
                    <p>
                      <strong>School:</strong>{' '}
                      {isEditing ? (
                        <Form.Item name="schoolId">
                          <Select
                            className="h-[40px] w-full"
                            name="schoolId"
                            defaultValue={offering?.school?.name}
                          >
                            {schools &&
                              schools?.data?.map((school) => (
                                <Option value={school.id} key={school.id}>
                                  {school.name}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                      ) : (
                        offering?.school?.name
                      )}
                    </p>
                  )}

                  <Divider />
                </div>
              </Form>

              {/* Statistics Cards */}
              <Row gutter={[16, 16]} className="mt-10 mb-6">
                <Col xs={24} sm={8}>
                  <Card className="text-center main-stat-card">
                    <Statistic
                      title="Total Enrolled Students"
                      value={offering?.enrollments?.length || 0}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card className="text-center main-stat-card">
                    <Statistic
                      title="Active Enrollments"
                      value={activeEnrollments?.length || 0}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card className="text-center main-stat-card">
                    <Statistic
                      title="Backed Out Students"
                      value={backedOutStudents?.length || 0}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Backed Out Students Table */}
              {backedOutStudents?.length > 0 && (
                <div className="mt-10 mb-8">
                  <h2 className="text-2xl mb-2">
                    Backed Out Students ({backedOutStudents?.length})
                  </h2>
                  <p className="text-lg mb-4 text-red-600 font-semibold">
                    Total Unpaid Review Fee:{' '}
                    {formatAmount(
                      backedOutStudents.reduce(
                        (total, student) =>
                          total + (student.remainingBalance || 0),
                        0
                      )
                    )}
                  </p>
                  <Table
                    dataSource={backedOutStudents}
                    columns={columns}
                    pagination={false}
                    size="small"
                  />
                </div>
              )}

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="flex flex-col gap-[6px]">
                    <label> Remaining Balance (min - max):</label>
                    <div className="flex gap-[6px]">
                      <CustomInput
                        type="number"
                        placeholder="min amount"
                        className="w-full"
                        value={searchAmount?.min}
                        onChange={(val) => {
                          setSearchAmount({
                            ...searchAmount,
                            min: val,
                          });
                        }}
                      />
                      <CustomInput
                        type="number"
                        value={searchAmount?.max}
                        placeholder="max amount"
                        className="w-full"
                        onChange={(val) => {
                          setSearchAmount({
                            ...searchAmount,
                            max: val,
                          });
                        }}
                      />
                      <CustomButton
                        onClick={() => {
                          filterEnrollment();
                        }}
                      >
                        Search
                      </CustomButton>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <Table
                    dataSource={enrollments && enrollments}
                    columns={columns}
                  />
                </Col>
              </Row>

              <div className="mt-10 mb-8">
                <p className="text-lg mb-4 text-red-600 font-semibold">
                  Total Unpaid Review Fee:{' '}
                  {formatAmount(
                    backedOutStudents.reduce(
                      (total, student) =>
                        total + (student.remainingBalance || 0),
                      0
                    )
                  )}
                </p>
                <Table
                  dataSource={backedOutStudents}
                  columns={columns}
                  pagination={false}
                  size="small"
                />
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ViewOffering;
