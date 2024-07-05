import React, { useState, useCallback, useEffect, useMemo } from "react";
import CustomInput from "../../components/Input/Input";
import useSchools from "../../hooks/useSchools";
import { useCourse } from "../../contexts/courses";
import { useStudentContext } from "../../contexts/students";
import { Select, Input, Form, Radio, AutoComplete } from "antd";
import Swal from "sweetalert2";
import CustomButton from "../../components/Button/Button";
import { useOfferingsContext } from "../../contexts/offerings";
import useMutation from "../../hooks/useMutation";
import { DEFAULT_BRANCH_ID, PROCESSED_BY } from "../../constants";
import { useNavigate } from "react-router-dom";
function generateFourDigitRandomNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

const { Option } = Select;
const { TextArea } = Input;

const options = [
  {
    label: "Existing",
    value: "existing",
  },
  {
    label: "New",
    value: "new",
  },
];

const Enrollment = () => {
  const navigate = useNavigate();
  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();

  const [offeringsSearchParams, setOfferingsSearchParams] = useState({
    pageNo: 1,
    pageSize: 25,
    yearOffered: new Date().getFullYear(),
  });
  const [studentSearchText, setStudentSearchText] = useState();
  const { students, studentDataLoading, getStudentError, addStudent } =
    useStudentContext();
  const [studentToEnrollRadioValue, setstudentToEnrollRadioValue] =
    useState("existing");
  const [selectedOfferingId, setSelectedOfferingId] = useState(undefined);
  const [selectedProcessedBy, setSelectedProcessedBy] = useState(undefined);
  const [selectedExistingStudentId, setSelectedStudentId] = useState(undefined);
  const [takerType, setTakerType] = useState("FIRST_TAKER");

  const getRadioStudent = ({ target: { value } }) => {
    setstudentToEnrollRadioValue(value);
  };

  const { mutate: addEnrollment, loading: addEnrollmentLoading } = useMutation(
    `/branches/${DEFAULT_BRANCH_ID}/offerings/${selectedOfferingId}/enrollments`,
    "PUT",
    "enrollments"
  );

  const {
    data: offerings,
    getOfferingsLoading,
    getOfferingsError,
    setParams: setOfferingsSearchParamsInContext,
  } = useOfferingsContext();

  useEffect(() => {
    if (offeringsSearchParams) {
      setOfferingsSearchParamsInContext(offeringsSearchParams);
    }
  }, [offeringsSearchParams]);

  const mapStudentsToAutocompleteOptions = (students) => {
    if (!students || students.length < 1) {
      return [];
    }

    return students?.map((student) => {
      const studentName = `${student.firstName} ${student.middleName} ${student.lastName}`;
      return {
        label: studentName,
        value: studentName,
        id: student.id,
      };
    });
  };

  const filteredStudentOptions = useMemo(() => {
    if (
      !studentSearchText ||
      studentSearchText === "" ||
      !students ||
      students.data < 1
    ) {
      return [];
    }

    const res = students.data.filter((item) =>
      item.firstName.toLowerCase().includes(studentSearchText.toLowerCase())
    );
    return mapStudentsToAutocompleteOptions(
      students.data.filter((item) =>
        item.firstName.toLowerCase().includes(studentSearchText.toLowerCase())
      )
    );
  }, [studentSearchText, students]);

  const enrollStudent = useCallback(
    async (data) => {
      if (!data) return;

      if (!data.studentId) {
        Swal.fire({
          icon: "warning",
          title: "Please add student to enroll!",
          timer: 2500,
        });

        return;
      }

      if (!data.takerType) {
        Swal.fire({
          icon: "warning",
          title: "Please add taker type!",
          timer: 2500,
        });
        return;
      }

      if (!data.processedBy) {
        Swal.fire({
          icon: "warning",
          title: "Please select processed by.",
          timer: 2500,
        });
        return;
      }

      try {
        const enrollmentRes = await addEnrollment(data);
        if (enrollmentRes) {
          const enrollmentId = enrollmentRes?.id;
          const studentId = data?.studentId;
          navigate(`/prints/enrollment/${studentId}/${enrollmentId}`);
          Swal.fire({
            icon: "success",
            title: "Enrollment successful!",
            text: "Redirecting to enrollment form printing...",
            timer: 2500,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Enrollment failed!",
          text: "This may be due to inputs. Please try again later!",
          timer: 2500,
        });
      }
    },
    [addEnrollment, selectedProcessedBy]
  );

  const enrollNewStudent = useCallback(
    async (values) => {
      try {
        const res = await addStudent(values);
        if (res && res.id) {
          const studentId = res.id;
          const enrollmentData = {
            takerType: "FIRST_TAKER",
            status: "",
            studentId,
            processedBy: selectedProcessedBy,
          };
          await enrollStudent(enrollmentData);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error adding student!",
          text: "It may be due to inputs, Please double check and try again!",
          timer: 2000,
        });
      }
    },
    [addStudent, addEnrollment, selectedProcessedBy]
  );

  const enrollExistingStudent = useCallback(async () => {
    if (!selectedOfferingId) {
      Swal.fire({
        icon: "warning",
        title: "Please select course offering!",
        timer: 2000,
      });
      return;
    }

    if (!selectedProcessedBy) {
      Swal.fire({
        icon: "warning",
        title: "Please select processed by.",
        timer: 2500,
      });
      return;
    }

    const data = {
      takerType,
      studentId: selectedExistingStudentId,
      status: "",
      processedBy: selectedProcessedBy,
    };

    await enrollStudent(data);
  }, [
    enrollStudent,
    selectedOfferingId,
    takerType,
    selectedExistingStudentId,
    selectedProcessedBy,
  ]);

  const onFinish = useCallback(
    async (values) => {
      if (!selectedOfferingId) {
        Swal.fire({
          icon: "warning",
          title: "Please select course offering!",
          timer: 2000,
        });
        return;
      }
      const addStudentValue = {
        lastName: values?.lastName,
        middleName: values?.lastName,
        firstName: values?.firstName,
        contactNumber: values?.contactNumber,
        schoolId: values?.schoolId,
        address: values?.address,
        age: 0,
        email: `${
          values?.firstName
        }${generateFourDigitRandomNumber()}@brainhub.com`,
        emergencyContact: {
          name: values?.emergencyContactName,
          relationship: values?.emergencyContactRelationship,
          address: values?.emergencyContactAddress,
          contactNumber: values?.emergencyContactNumber,
        },
      };

      await enrollNewStudent(addStudentValue);
    },
    [
      addStudent,
      setSelectedOfferingId,
      addEnrollment,
      enrollNewStudent,
      selectedProcessedBy,
    ]
  );

  return (
    <div className="w-full">
      <div>
        <Form layout="vertical" className="w-1/2">
          <h1 className="text-2xl mb-[2vh]">Enroll Student</h1>

          <Form.Item label="Year" name="year">
            <Select
              className="w-full mb=[2vh]"
              size="large"
              defaultValue="2024"
              onChange={(value) =>
                setOfferingsSearchParams({
                  ...offeringsSearchParams,
                  yearOffered: value,
                })
              }
            >
              {[...Array(8)].map((_, index) => {
                const year = 2024 + index;
                return (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="Course" name="course_name">
            <Select
              className="w-full"
              loading={getCoursesLoading}
              disabled={getCoursesLoading || getCoursesError}
              onChange={(value) =>
                setOfferingsSearchParams({
                  ...offeringsSearchParams,
                  courseId: value,
                })
              }
            >
              {courses &&
                courses?.data?.map((course) => (
                  <Option key={course.id} value={course.id}>
                    {course.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Form>

        <Form.Item
          label="Course Offering:"
          name="courseId"
          layout="vertical"
          className="w-1/2 mb-[2vh]"
        >
          <Select
            size="large"
            disabled={getOfferingsLoading || getOfferingsError}
            onChange={(value) => setSelectedOfferingId(value)}
          >
            {offerings &&
              offerings?.data?.map((offering) => (
                <Option key={offering?.id} value={offering?.id}>
                  {`${offering?.course?.name}-${offering?.program}-${offering?.yearOffered}-${offering?.semester}`}
                </Option>
              ))}
          </Select>

          {getOfferingsError && (
            <label className="text-secondary">
              Error loading offerings. please try again later!{" "}
            </label>
          )}
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

        <div className="mb-[2vh]">
          <p>
            <small>
              <i className="mb-[2vh]">Select Student to Enroll</i>
            </small>
          </p>

          <Radio.Group
            options={options}
            onChange={getRadioStudent}
            value={studentToEnrollRadioValue}
            optionType="button"
          />
          {studentToEnrollRadioValue === "existing" && (
            <>
              <Form.Item
                label="Student Name"
                name="studentId"
                className="mt-[10px] w-1/2"
                layout="vertical"
              >
                <AutoComplete
                  loading={studentDataLoading}
                  disabled={studentDataLoading || getStudentError}
                  className="w-full"
                  placeholder="Select student"
                  onSelect={(value, option) => {
                    setSelectedStudentId(option.id);
                  }}
                  onSearch={(value) => {
                    setStudentSearchText(value);
                  }}
                  options={filteredStudentOptions}
                />
                {getStudentError && (
                  <label className="text-secondary">
                    Error loading students. please try again later!{" "}
                  </label>
                )}
              </Form.Item>

              <Form.Item label="Taker type" layout="vertical" className="w-1/2">
                <Select
                  className="w-full mb=[2vh]"
                  size="large"
                  defaultValue="1st"
                  onChange={(value) => {
                    setTakerType(value);
                  }}
                >
                  <Option value="FIRST_TAKER">1st Taker</Option>
                  <Option value="RE_TAKER">Re-taker</Option>
                  <Option value="SUMMER">Summer</Option>
                </Select>
              </Form.Item>
            </>
          )}
        </div>

        {studentToEnrollRadioValue === "new" && (
          <Form
            name="enrollment"
            onFinish={onFinish}
            layout="vertical"
            className="w-1/2"
            initialValues={
              {
                // lastName: "John",
                // middleName: "Day",
                // firstName: "Doe",
                // contactNumber: "09182254329",
                // address: "Lopez Jaena",
                // age: 0,
                // email: `test${generateFourDigitRandomNumber()}@brainhub.com`,
                // emergencyContactName: "Jane Day Doe",
                // emergencyContactRelationship: "Spouse",
                // emergencyContactAddress: "USA",
                // emergencyContactNumber: "09101214090",
              }
            }
          >
            <>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please input your First Name" },
                ]}
              >
                <CustomInput type="text" name="firstName" />
              </Form.Item>

              <Form.Item
                label="Middle Name"
                name="middleName"
                rules={[
                  { required: true, message: "Please input your Middle Name" },
                ]}
              >
                <CustomInput type="text" name="middleName" />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please input your Last Name" },
                ]}
              >
                <CustomInput type="text" name="lastName" />
              </Form.Item>

              <Form.Item
                label="School"
                name="schoolId"
                rules={[
                  { required: true, message: "Please input your School" },
                ]}
              >
                <Select
                  className="w-full"
                  loading={schoolsLoading}
                  disabled={schoolsLoading || schoolsError}
                >
                  {schools &&
                    schools?.data?.map((school) => (
                      <Option key={school.id} value={school.id}>
                        {school.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please input your address!" },
                ]}
              >
                <TextArea
                  type="text"
                  name="address"
                  placeholder=""
                  rows={4}
                  className="mb-[2vh]"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Contact No."
                name="contactNumber"
                rules={[
                  { required: true, message: "Please input your Contact No." },
                ]}
              >
                <CustomInput
                  name="contactNumber"
                  className="w-full mb-[2vh] py-[5px]"
                />
              </Form.Item>

              <hr />
              <br />
              <div className="inline flex-row mb-[2vh]">
                <div className="mb-[2vh]">
                  <small>
                    <i className="mb-[2vh]">
                      Person to be notified in case of emergency:
                    </i>
                  </small>
                </div>

                <Form.Item
                  label="Emergency Contact Name"
                  name="emergencyContactName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your emergency contact name!",
                    },
                  ]}
                >
                  <CustomInput type="text" name="emergencyName" />
                </Form.Item>

                <Form.Item
                  label="Relationship"
                  name="emergencyContactRelationship"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please input your relation on your emergency contact!",
                    },
                  ]}
                >
                  <CustomInput type="text" name="emergencyRelationship" />
                </Form.Item>

                <Form.Item
                  label="Emergency Address"
                  name="emergencyContactAddress"
                  rules={[
                    {
                      required: true,
                      message: "Please input your emergency contact address!",
                    },
                  ]}
                >
                  <TextArea
                    type="text"
                    name="emergencyAddress"
                    placeholder=""
                    rows={4}
                    className="mb-[2vh]"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Emergency Contact No."
                  name="emergencyContactNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please input your emergency contact no.",
                    },
                  ]}
                >
                  <CustomInput
                    name="emergencyContactNumber"
                    size="large"
                    className="w-full mb-[2vh] py-[5px]"
                  />
                </Form.Item>
                <Form.Item className="flex justify-center">
                  <CustomButton
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={addEnrollmentLoading}
                    disabled={addEnrollmentLoading}
                  >
                    Submit
                  </CustomButton>
                </Form.Item>
              </div>
            </>
          </Form>
        )}

        {/* Save button */}
        {studentToEnrollRadioValue === "existing" && (
          <div className="text-right mb-5 w-1/2 flex justify-center">
            <CustomButton
              type="primary"
              size="large"
              onClick={enrollExistingStudent}
            >
              Submit
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollment;
