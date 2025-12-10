import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomInput from '../../components/Input/Input';
import { Select, Table, Space, Row, Col, Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useStudentContext } from '../../contexts/students';
import useSchools from '../../hooks/useSchools';
import GenericErrorDisplay from '../../components/GenericErrorDisplay/GenericErrorDisplay';
import CustomButton from '../../components/Button/Button';
import {
  cleanParams,
  formatAmount,
  formatTakerType,
} from '../../utils/formatting';
import {
  getLatestData,
  getStudentRemainingBalance,
} from '../../utils/mappings';
const { Option } = Select;

const StudentsList = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: schools, loading: schoolsLoading } = useSchools();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // Display 25 per page
  const [isFiltered, setIsFiltered] = useState(false); // Track if filters are applied

  const [searchParams, setSearchParams] = useState({
    studentName: undefined,
    schoolId: undefined,
    offeringType: undefined,
  });
  const { students, studentDataLoading, getStudentError, setParams } =
    useStudentContext();

  useEffect(() => {
    // Use server-side pagination: fetch the current page with the display pageSize
    // Always use the pageSize from state for proper server-side pagination
    const apiPageNo = currentPage;

    console.log('Students API call params:', {
      apiPageNo,
      pageSize,
      isFiltered,
      currentPage,
      searchParams,
    });

    setParams({
      ...(isFiltered ? cleanParams(searchParams) : {}),
      pageNo: apiPageNo,
      pageSize: pageSize,
    });
  }, [currentPage, pageSize, isFiltered, setParams, searchParams]);

  const handleFilter = useCallback(() => {
    setCurrentPage(1); // Reset to first page when filtering
    setIsFiltered(true); // Mark as filtered to fetch all records
    // The useEffect will handle the API call with the updated searchParams
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, row) => {
        return `${row?.lastName}, ${row?.firstName} ${row?.middleName}`;
      },
    },
    { title: 'School', dataIndex: 'school', key: 'school' },
    {
      title: 'Taker Type',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return (
          formatTakerType(getLatestData(record?.enrollments)?.takerType) ?? ''
        );
      },
    },
    { title: 'Contact No.', dataIndex: 'contactNumber', key: 'contact' },
    { title: 'Address.', dataIndex: 'address', key: 'address' },
    {
      title: 'Enrollee Type:.',
      dataIndex: 'enrollments',
      key: 'enrolleeType',
      render: (data) => data[0]?.courseOffering?.offeringType,
    },
    {
      title: 'Remaining Balance.',
      dataIndex: 'enrollments',
      key: 'balance',
      render: (data) => {
        return (
          <p className="text-red-600 font-bold">
            {formatAmount(getStudentRemainingBalance(data))}
          </p>
        );
      },
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="small">
            <CustomButton
              type="edit"
              onClick={() => {
                navigate(`/payments/add/${record?.id}`);
              }}
            >
              Add Payment
            </CustomButton>
            <CustomButton
              onClick={() => {
                handleViewStudent(record.id);
              }}
            >
              View
            </CustomButton>
            <CustomButton
              onClick={() => {
                handleGenerateSOA(record.id);
              }}
            >
              Generate SOA
            </CustomButton>
          </Space>
        );
      },
    },
  ];

  const handleViewStudent = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const handleGenerateSOA = (studentId) => {
    navigate(`/students/${studentId}/statement-of-account`);
  };

  const filteredData = useMemo(() => {
    if (studentDataLoading || getStudentError) return [];
    return (
      students?.data?.map((student) => {
        return {
          ...student,
          name: `${student.firstName} ${student.middleName} ${student.lastName}`,
          school: student.school.name,
        };
      }) || []
    );
  }, [students, studentDataLoading, getStudentError]);

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Students List</h1>
      <Form form={form}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item name="studentName">
              <p>Student Name: </p>
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
          <Col span={6}>
            <Form.Item name="school">
              <p>School: </p>
              <Select
                loading={schoolsLoading}
                disabled={schoolsLoading}
                size="large"
                onChange={(value) => {
                  setSearchParams({
                    ...searchParams,
                    schoolId: value,
                  });
                }}
                className="custom-select"
              >
                {schools &&
                  schools?.data?.map((school) => (
                    <Option value={school.id} key={school.id}>
                      {school.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="enrolleeType">
              <p>Enrollee Type: </p>
              <Select
                loading={schoolsLoading}
                disabled={schoolsLoading}
                size="large"
                className="custom-select"
                onChange={(value) => {
                  setSearchParams({
                    ...searchParams,
                    offeringType: value,
                  });
                }}
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
          <Col span={4} className="flex items-center mb-1">
            <Button
              className="w-auto bg-primary text-white mr-2"
              size="large"
              htmlType="button"
              onClick={handleFilter}
            >
              Filter
            </Button>
            <Button
              className="w-auto text-primary"
              size="large"
              htmlType="button"
              onClick={() => {
                form.resetFields();
                setCurrentPage(1);
                setPageSize(25);
                setIsFiltered(false); // Reset filter state
                setSearchParams({
                  studentName: undefined,
                  schoolId: undefined,
                  offeringType: undefined,
                });
                // The useEffect will trigger a new API call with reset params
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Form>
      <p className="text-xl font-bold mb-4">
        Total Students: {` ${students?.meta?.totalResults || 0}`}
      </p>

      <Col span={24}>
        {getStudentError ? (
          <GenericErrorDisplay className="!mt-5" />
        ) : (
          <Table
            dataSource={filteredData}
            columns={columns}
            loading={studentDataLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: students?.meta?.totalResults || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              pageSizeOptions: ['10', '25', '50', '100'],
            }}
            onChange={(pagination) => {
              console.log('Students pagination changed:', {
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: students?.meta?.totalResults || 0,
                isFiltered,
              });
              setCurrentPage(pagination.current);
              setPageSize(pagination.pageSize);
              // The useEffect will trigger a new API call with the updated pageNo/pageSize
            }}
          />
        )}
      </Col>
    </div>
  );
};

export default StudentsList;
