import { useMemo, useEffect } from "react";
import { Row, Col, Card, Table, Space, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import { useEnrollmentsContext } from "../../contexts/enrollments";
import CustomButton from "../../components/Button/Button";
import { formatAmount } from "../../utils/formatting";

const StudentsTable = ({ programId, programName, programData }) => {
  const navigate = useNavigate();
  const { enrollments, getEnrollmentsLoading, getEnrollmentsError, setParams } =
    useEnrollmentsContext();

  // Fetch enrollments for this program
  useEffect(() => {
    if (programId) {
      setParams({ programId });
    }
  }, [programId, setParams]);

  // Process and sort students alphabetically
  const studentsData = useMemo(() => {
    if (!enrollments?.data || getEnrollmentsLoading || getEnrollmentsError) {
      return [];
    }

    // Extract unique students from enrollments and sort alphabetically
    const uniqueStudents = enrollments.data.reduce((acc, enrollment) => {
      const student = enrollment.student;
      const studentKey = student.id;

      if (!acc[studentKey]) {
        acc[studentKey] = {
          key: studentKey,
          id: student.id,
          name: `${student.lastName}, ${student.firstName} ${
            student.middleName || ""
          }`.trim(),
          firstName: student.firstName,
          lastName: student.lastName,
          middleName: student.middleName,
          contactNumber: student.contactNumber,
          email: student.email,
          address: student.address,
          school: student.school?.name,
          enrollments: [],
        };
      }

      acc[studentKey].enrollments.push(enrollment);
      return acc;
    }, {});

    // Convert to array and sort alphabetically by name (lastName, firstName, middleName)
    return Object.values(uniqueStudents).sort((a, b) => {
      // First compare by lastName
      const lastNameComparison = a.lastName.localeCompare(b.lastName);
      if (lastNameComparison !== 0) return lastNameComparison;

      // If lastNames are equal, compare by firstName
      const firstNameComparison = a.firstName.localeCompare(b.firstName);
      if (firstNameComparison !== 0) return firstNameComparison;

      // If firstNames are also equal, compare by middleName
      return (a.middleName || "").localeCompare(b.middleName || "");
    });
  }, [enrollments, getEnrollmentsLoading, getEnrollmentsError]);

  // Calculate program totals - use program data if available, otherwise calculate from enrollments
  const programTotals = useMemo(() => {
    // If program data has financial information, use it
    if (programData?.totalCollectibles !== undefined) {
      return {
        totalCollectibles: programData.totalCollectibles || 0,
        totalMoneyCollected: programData.totalCollected || 0,
        totalRemainingCollectibles: programData.totalRemainingCollectibles || 0,
      };
    }

    // Otherwise calculate from enrollments
    if (!enrollments?.data || getEnrollmentsLoading || getEnrollmentsError) {
      return {
        totalCollectibles: 0,
        totalMoneyCollected: 0,
        totalRemainingCollectibles: 0,
      };
    }

    const totals = enrollments.data.reduce(
      (acc, enrollment) => {
        const reviewFee = parseFloat(enrollment.reviewFee) || 0;
        const discountAmount = parseFloat(enrollment.discountAmount) || 0;
        const totalAmountPaid = parseFloat(enrollment.totalAmountPaid) || 0;
        const remainingBalance = reviewFee - discountAmount - totalAmountPaid;

        acc.totalCollectibles += reviewFee;
        acc.totalMoneyCollected += totalAmountPaid;
        acc.totalRemainingCollectibles += remainingBalance;

        return acc;
      },
      {
        totalCollectibles: 0,
        totalMoneyCollected: 0,
        totalRemainingCollectibles: 0,
      }
    );

    return totals;
  }, [enrollments, getEnrollmentsLoading, getEnrollmentsError, programData]);

  const studentsColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: "ascend",
    },

    {
      title: "Total Review Fee",
      dataIndex: "enrollments",
      key: "totalReviewFee",
      render: (enrollments) => {
        const total = enrollments.reduce(
          (sum, enrollment) => sum + (parseFloat(enrollment.reviewFee) || 0),
          0
        );
        return formatAmount(total);
      },
    },
    {
      title: "Total Remaining Balance",
      dataIndex: "enrollments",
      key: "totalRemainingBalance",
      render: (enrollments) => {
        const total = enrollments.reduce((sum, enrollment) => {
          const reviewFee = parseFloat(enrollment.reviewFee) || 0;
          const discountAmount = parseFloat(enrollment.discountAmount) || 0;
          const totalAmountPaid = parseFloat(enrollment.totalAmountPaid) || 0;
          return sum + (reviewFee - discountAmount - totalAmountPaid);
        }, 0);
        return (
          <span className={total > 0 ? "text-red-600 font-bold" : ""}>
            {formatAmount(total)}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <CustomButton onClick={() => navigate(`/students/${record.id}`)}>
            View Profile
          </CustomButton>
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]} className="mt-6">
      <Col xs={24} sm={24} md={36} lg={36}>
        <Card>
          <h2 className="text-xl mb-4">Students Enrolled in {programName}</h2>

          {/* Program Summary Statistics */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <Statistic
                  title="Total Collectibles"
                  value={programTotals.totalCollectibles}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix="₱"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <Statistic
                  title="Total Money Collected"
                  value={programTotals.totalMoneyCollected}
                  precision={2}
                  valueStyle={{ color: "#1890ff" }}
                  prefix="₱"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <Statistic
                  title="Total Remaining Collectibles"
                  value={programTotals.totalRemainingCollectibles}
                  precision={2}
                  valueStyle={{
                    color:
                      programTotals.totalRemainingCollectibles > 0
                        ? "#cf1322"
                        : "#3f8600",
                  }}
                  prefix="₱"
                />
              </Card>
            </Col>
          </Row>

          <Table
            columns={studentsColumns}
            dataSource={studentsData}
            loading={getEnrollmentsLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} students`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StudentsTable;
