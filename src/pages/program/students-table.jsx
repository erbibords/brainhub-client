import { useMemo, useEffect, useRef, useState } from "react";
import { Row, Col, Card, Table, Statistic, Input } from "antd";
import { useEnrollmentsContext } from "../../contexts/enrollments";
import CustomButton from "../../components/Button/Button";
import { formatAmount } from "../../utils/formatting";
import { useReactToPrint } from "react-to-print";
import "./students-table.css";

const StudentsTable = ({ programId, programName, programData }) => {
  const { enrollments, getEnrollmentsLoading, getEnrollmentsError, setParams } =
    useEnrollmentsContext();
  const printRef = useRef();

  const [searchText, setSearchText] = useState("");

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Students - ${programName}`,
    removeAfterPrint: true,
  });

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
          return sum + (reviewFee - discountAmount - totalAmountPaid);
        }, 0);
        return (
          <span className={total > 0 ? "text-red-600 font-bold" : ""}>
            {formatAmount(total)}
          </span>
        );
      },
    },
  ];

  console.log(filteredStudentsData.length);

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

          {/* Search Input - Screen Only */}
          <div className="mb-4">
            <Input
              placeholder="Search students by full name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ maxWidth: 400 }}
            />
          </div>

          {/* Program Summary Statistics - Screen Only */}
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
            />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default StudentsTable;
