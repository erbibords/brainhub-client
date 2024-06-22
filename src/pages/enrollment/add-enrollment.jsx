import React, { useState, useCallback, useEffect } from "react";

import CustomInput from "../../components/Input/Input";
import useSchools from "../../hooks/useSchools";
import { useCourse } from "../../contexts/courses";
import { useStudentContext } from "../../contexts/students";
import { Select, Input, Form, Divider, Radio } from "antd";
import Swal from "sweetalert2";
import CustomButton from "../../components/Button/Button";
import { useOfferingsContext } from "../../contexts/offerings";
import useMutation from "../../hooks/useMutation";
import { DEFAULT_BRANCH_ID } from "../../constants";

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
  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();
  const [offeringsSearchParams, setOfferingsSearchParams] = useState({});
  const { students, studentDataLoading, getStudentError, addStudent } =
    useStudentContext();
  const [studentToEnrollRadioValue, setstudentToEnrollRadioValue] =
    useState("new");
  const [selectedOfferingId, setSelectedOfferingId] = useState(undefined);

  const getRadioStudent = ({ target: { value } }) => {
    setstudentToEnrollRadioValue(value);
  };

  console.log(selectedOfferingId);

  const {
    mutate: addEnrollment,
    loading: addEnrollmentLoading,
    error: addEnrollmentError,
  } = useMutation(
    `/branches/${DEFAULT_BRANCH_ID}/offerings/${selectedOfferingId}/enrollments`,
    "PUT"
  );

  useEffect(() => {
    if (addEnrollmentError) {
      Swal.fire({
        icon: "error",
        title: "Error enrolling student!",
        message: "It may be due to inputs, Please double check and try again!",
        timer: 2000,
      });
    }
  }, [addEnrollmentError]);

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
        email: `${values?.firstName}generateFourDigitRandomNumber@brainhub.com`,
        emergencyContact: {
          name: values?.emergencyContactName,
          relationship: values?.emergencyContactRelationship,
          address: values?.emergencyContactAddress,
          contactNumber: values?.emergencyContactNumber,
        },
      };

      console.log(addStudentValue);

      try {
        const res = await addStudent(addStudentValue);
        if (res && res.id) {
          const studentId = res.id;
          const enrollmentData = {
            takerType: "FIRST_TAKER",
            status: "",
            studentId,
          };
          addEnrollment(enrollmentData);
          console.log(enrollmentData);
        }
      } catch (error) {
        alert("error");
      }
    },
    [addStudent, setSelectedOfferingId, addEnrollment]
  );

  return (
    <div className="w-full h-[800px] overflow-y-auto">
      <div>
        <Form layout="vertical" className="w-1/2">
          <h1 className="text-2xl mb-[2vh]">Enroll Student</h1>
          <Form.Item label="Review Program" name="review_program">
            <Select
              className="w-full mb=[2vh]"
              size="large"
              defaultValue="INTENSIVE"
              onChange={(value) =>
                setOfferingsSearchParams({
                  ...offeringsSearchParams,
                  program: value,
                })
              }
            >
              <Option value="INTENSIVE">Intensive</Option>
              <Option value="ENHANCEMENT">Enhancement-Intensive</Option>
            </Select>
          </Form.Item>

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

          <Form.Item label="Semester" name="semester">
            <Select
              className="w-full mb=[2vh]"
              size="large"
              defaultValue="1st"
              // onChange={(value) => {
              //   console.log(value);
              //   setOfferingsSearchParams({
              //     ...offeringsSearchParams,
              //     semester: value,
              //   });
              // }}
            >
              <Option value="FIRST_SEMESTER">1st</Option>
              <Option value="SECOND_SEMESTER">2nd</Option>
              <Option value="SUMMER">Summer</Option>
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
              <Option value="test"> Test </Option>
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
          className="w-1/2"
        >
          <Select
            className="w-full mb-[2vh]"
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
            <Form.Item
              label="Student Name"
              name="studentId"
              className="mt-[10px] w-1/2"
              layout="vertical"
            >
              <Select
                className="w-full"
                loading={studentDataLoading}
                disabled={studentDataLoading || getStudentError}
              >
                {students &&
                  students?.data?.map((student) => (
                    <Option key={student.studentId} value={student.studentId}>
                      {student.firstName} {student.middleName}{" "}
                      {student.lastName}
                    </Option>
                  ))}
              </Select>

              {getStudentError && (
                <label className="text-secondary">
                  Error loading students. please try again later!{" "}
                </label>
              )}
            </Form.Item>
          )}
        </div>
        <Divider />
        {studentToEnrollRadioValue === "new" && (
          <Form
            name="enrollment"
            onFinish={onFinish}
            layout="vertical"
            className="w-1/2"
            initialValues={{
              lastName: "John",
              middleName: "Day",
              firstName: "Doe",
              contactNumber: "09182254329",
              address: "Lopez Jaena",
              age: 0,
              email: `test${generateFourDigitRandomNumber}@brainhub.com`,
              emergencyContactName: "Jane Day Doe",
              emergencyContactRelationship: "Spouse",
              emergencyContactAddress: "USA",
              emergencyContactNumber: "09101214090",
            }}
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
                  type="number"
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
                    type="number"
                    name="emergencyContactNumber"
                    size="large"
                    className="w-full mb-[2vh] py-[5px]"
                  />
                </Form.Item>
                <Form.Item>
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
          <div className="text-right mb-5">
            <CustomButton type="primary" size="large">
              Submit
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollment;
