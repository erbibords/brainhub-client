import { useMemo, useEffect, useRef, useState } from "react";
import { Row, Col, Card, Table, Statistic, Input } from "antd";
import { useEnrollmentsContext } from "../../contexts/enrollments";
import CustomButton from "../../components/Button/Button";
import { formatAmount } from "../../utils/formatting";
import { useReactToPrint } from "react-to-print";
import "./students-table.css";

const StudentsTable = ({ programId, programName }) => {
  const { enrollments, getEnrollmentsLoading, getEnrollmentsError, setParams } =
    useEnrollmentsContext();
  const printRef = useRef();

  const [searchText, setSearchText] = useState("");

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Students - ${programName}`,
    removeAfterPrint: true,
  });

  // Fetch ALL enrollments for this program (not paginated)
  useEffect(() => {
    if (programId) {
      setParams({
        programId,
        pageNo: 1,
        pageSize: 10000, // Fetch all records for this program
      });
    }
  }, [programId, setParams]);

  // Process and sort students alphabetically
  const studentsData = useMemo(() => {
    if (!enrollments?.data || getEnrollmentsLoading || getEnrollmentsError) {
      return [];
    }

    // Filter out backedOut students first
    const activeEnrollments = enrollments.data.filter(
      (enrollment) => !enrollment.student?.backedOut
    );

    // Extract unique students from active enrollments and sort alphabetically
    const uniqueStudents = activeEnrollments.reduce((acc, enrollment) => {
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

  // Filter students based on search text
  const filteredStudentsData = useMemo(() => {
    if (!searchText.trim()) {
      return studentsData;
    }

    return studentsData.filter((student) => {
      const searchLower = searchText.toLowerCase();
      return student.name.toLowerCase().includes(searchLower);
    });
  }, [studentsData, searchText]);

  // Calculate program totals from current enrollments data
  const programTotals = useMemo(() => {
    // Always calculate from current enrollments data, not stale programData
    if (!enrollments?.data || getEnrollmentsLoading || getEnrollmentsError) {
      return {
        totalCollectibles: 0,
        totalDiscountAmount: 0,
        totalMoneyCollected: 0,
        totalRemainingCollectibles: 0,
        totalOverpaid: 0,
        totalBackedOutCollected: 0,
      };
    }

    // Filter out backedOut students for calculations
    const activeEnrollments = enrollments.data.filter(
      (enrollment) => !enrollment.student?.backedOut
    );

    // Calculate totals for active enrollments
    const totals = activeEnrollments.reduce(
      (acc, enrollment) => {
        const reviewFee = parseFloat(enrollment.reviewFee) || 0;
        const discountAmount = parseFloat(enrollment.discountAmount) || 0;
        const totalAmountPaid = parseFloat(enrollment.totalAmountPaid) || 0;
        const remainingBalance = reviewFee - discountAmount - totalAmountPaid;

        acc.totalCollectibles += reviewFee;
        acc.totalDiscountAmount += discountAmount;
        acc.totalMoneyCollected += totalAmountPaid;
        // Include all remaining balances (positive and negative) for accurate math
        acc.totalRemainingCollectibles += remainingBalance;

        // Track overpaid amounts (negative remaining balances)
        if (remainingBalance < 0) {
          acc.totalOverpaid += Math.abs(remainingBalance);
        }

        return acc;
      },
      {
        totalCollectibles: 0,
        totalDiscountAmount: 0,
        totalMoneyCollected: 0,
        totalRemainingCollectibles: 0,
        totalOverpaid: 0,
      }
    );

    // Calculate total money collected from backed-out students
    const backedOutEnrollments = enrollments.data.filter(
      (enrollment) => enrollment.student?.backedOut
    );

    const backedOutTotal = backedOutEnrollments.reduce((acc, enrollment) => {
      const totalAmountPaid = parseFloat(enrollment.totalAmountPaid) || 0;
      acc += totalAmountPaid;
      return acc;
    }, 0);

    totals.totalBackedOutCollected = backedOutTotal;

    return totals;
  }, [enrollments, getEnrollmentsLoading, getEnrollmentsError]);

  const studentsColumns = [
    {
      title: "#",
      key: "number",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      title: "Total Discount Amount",
      dataIndex: "enrollments",
      key: "totalDiscountAmount",
      render: (enrollments) => {
        const total = enrollments.reduce(
          (sum, enrollment) =>
            sum + (parseFloat(enrollment.discountAmount) || 0),
          0
        );
        return formatAmount(total);
      },
    },
    {
      title: "Total Amount Paid",
      dataIndex: "enrollments",
      key: "totalAmountPaid",
      render: (enrollments) => {
        const total = enrollments.reduce(
          (sum, enrollment) =>
            sum + (parseFloat(enrollment.totalAmountPaid) || 0),
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
          const remainingBalance = reviewFee - discountAmount - totalAmountPaid;
          // Include all remaining balances (positive and negative) for accurate display
          return sum + remainingBalance;
        }, 0);

        return (
          <span
            className={
              total > 0
                ? "text-red-600 font-bold"
                : total < 0
                ? "text-green-600 font-bold"
                : ""
            }
          >
            {formatAmount(total)}
          </span>
        );
      },
    },
  ];

  return (
    <Row gutter={[16, 16]} className="mt-6">
      <Col xs={24} sm={24} md={36} lg={36}>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">Students Enrolled in {programName}</h2>
            <CustomButton type="primary" onClick={handlePrint}>
              Print Students List
            </CustomButton>
          </div>

          {/* Main Financial Statistics - Row 1 */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <Card className="text-center main-stat-card">
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
              <Card className="text-center main-stat-card">
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
              <Card className="text-center main-stat-card">
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

          {/* Additional Statistics - Row 2 */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <Statistic
                  title="Total Discount Amount"
                  value={programTotals.totalDiscountAmount}
                  precision={2}
                  valueStyle={{ color: "#fa8c16" }}
                  prefix="₱"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <Statistic
                  title="Total Overpaid Amount"
                  value={programTotals.totalOverpaid}
                  precision={2}
                  valueStyle={{ color: "#52c41a" }}
                  prefix="₱"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center">
                <Statistic
                  title="Total Backed-Out Collected"
                  value={programTotals.totalBackedOutCollected}
                  precision={2}
                  valueStyle={{ color: "#722ed1" }}
                  prefix="₱"
                />
              </Card>
            </Col>
          </Row>

          {/* Search Input - Screen Only */}
          <div className="mb-4">
            <Input
              placeholder="Search students by full name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
              style={{ maxWidth: 400 }}
            />
          </div>

          <div ref={printRef} className="print-content">
            <h3 className="text-lg font-bold mb-4 text-center">
              Students Enrolled in {programName}
            </h3>
            <Table
              columns={studentsColumns}
              dataSource={filteredStudentsData}
              loading={getEnrollmentsLoading}
              pagination={false}
              scroll={{ x: 1200 }}
              rowClassName={(record) => {
                // Calculate if this student has overpaid
                const totalRemaining = record.enrollments.reduce(
                  (sum, enrollment) => {
                    const reviewFee = parseFloat(enrollment.reviewFee) || 0;
                    const discountAmount =
                      parseFloat(enrollment.discountAmount) || 0;
                    const totalAmountPaid =
                      parseFloat(enrollment.totalAmountPaid) || 0;
                    const remainingBalance =
                      reviewFee - discountAmount - totalAmountPaid;
                    return sum + remainingBalance;
                  },
                  0
                );

                // Add background color for overpaid students
                return totalRemaining < 0 ? "overpaid-student-row" : "";
              }}
            />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default StudentsTable;
