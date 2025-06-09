import React, { useState, useCallback, useEffect, useMemo } from "react";
import CustomInput from "../../components/Input/Input";
import useSchools from "../../hooks/useSchools";
import { useCourse } from "../../contexts/courses";
import { useStudentContext } from "../../contexts/students";
import { Select, Input, Form, Radio, AutoComplete, Divider } from "antd";
import Swal from "sweetalert2";
import CustomButton from "../../components/Button/Button";
import { useOfferingsContext } from "../../contexts/offerings";
import useMutation from "../../hooks/useMutation";
import useOffering from "../../hooks/useOffering";

import {
  DEFAULT_BRANCH_ID,
  PROCESSED_BY,
  YEAR,
  YEAR_LEVELS,
} from "../../constants";
import { useNavigate } from "react-router-dom";
import { getCourseOfferingName } from "../../utils/mappings";
import { toSafeNumber } from "../../utils/formatting";

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
  const [form] = Form.useForm();
  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();
  const [offeringsSearchParams, setOfferingsSearchParams] = useState({
    pageNo: 1,
    pageSize: 50,
    yearOffered: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
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
  const [additionalEnrollmentData, setAdditionalEnrollmentData] = useState({
    yearLevel: "1st Year",
    reviewFee: undefined,
    discountAmount: undefined,
    remarks: undefined,
  });

  const { data: selectedOffering } = useOffering(selectedOfferingId ?? null);
  const isRegularOffering = selectedOffering?.offeringType === "REGULAR";

  const filteredSchools = selectedOffering
    ? schools?.data?.filter((sc) => {
        if (selectedOffering.offeringType === "COMBI") return true;
        return selectedOffering.school && sc.id === selectedOffering.school.id;
      })
    : [];

  const isOfferingIntensive = useMemo(() => {
    return (
      selectedOffering && selectedOffering?.reviewProgram?.name?.includes("INT")
    );
  }, [selectedOffering]);

  useEffect(() => {
    if (selectedOffering) {
      setAdditionalEnrollmentData({
        ...additionalEnrollmentData,
        reviewFee: selectedOffering?.reviewFee ?? undefined,
      });
    }
  }, [selectedOffering, selectedOfferingId]);

  const getRadioStudent = ({ target: { value } }) => {
    setstudentToEnrollRadioValue(value);
  };

  const { mutate: addEnrollment, loading: addEnrollmentLoading } = useMutation(
    `/branches/${DEFAULT_BRANCH_ID()}/offerings/${selectedOfferingId}/enrollments`,
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
      const studentName = `${student.firstName} ${student?.middleName ?? ""} ${
        student.lastName
      }`;
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

    return mapStudentsToAutocompleteOptions(
      students.data.filter((student) => {
        const nameMatch = student.firstName
          .toLowerCase()
          .includes(studentSearchText.toLowerCase());
        if (isRegularOffering) {
          return student.school.id === selectedOffering.school.id;
        }

        return nameMatch;
      })
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

      if (!data.reviewFee) {
        Swal.fire({
          icon: "warning",
          title: "Please add review fee.",
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
    [addEnrollment, selectedProcessedBy, additionalEnrollmentData]
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
            discountAmount: additionalEnrollmentData?.discountAmount,
            reviewFee: (
              toSafeNumber(additionalEnrollmentData?.reviewFee) -
                toSafeNumber(additionalEnrollmentData?.discountAmount ?? 0) ?? 0
            ).toString(),
            yearLevel: isOfferingIntensive
              ? "Graduated"
              : additionalEnrollmentData?.yearLevel,
            remarks: additionalEnrollmentData?.remarks,
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
    [addStudent, addEnrollment, selectedProcessedBy, additionalEnrollmentData]
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
      discountAmount: additionalEnrollmentData?.discountAmount,
      reviewFee: (
        toSafeNumber(additionalEnrollmentData?.reviewFee) -
          toSafeNumber(additionalEnrollmentData?.discountAmount ?? 0) ?? 0
      ).toString(),
      yearLevel: isOfferingIntensive
        ? "Graduated"
        : additionalEnrollmentData?.yearLevel,
      remarks: additionalEnrollmentData?.remarks,
    };

    await enrollStudent(data);
  }, [
    enrollStudent,
    selectedOfferingId,
    takerType,
    selectedExistingStudentId,
    selectedProcessedBy,
    additionalEnrollmentData,
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
        lastName: values?.lastName?.toUpperCase(),
        middleName: values?.middleName?.toUpperCase(),
        firstName: values?.firstName?.toUpperCase(),
        contactNumber: values?.contactNumber,
        schoolId:
          filteredSchools && filteredSchools?.length === 1
            ? filteredSchools[0].id
            : values?.schoolId,
        address: values?.address?.toUpperCase(),
        age: 0,
        emergencyContact: {
          name: values?.emergencyContactName?.toUpperCase(),
          relationship: values?.emergencyContactRelationship?.toUpperCase(),
          address: values?.emergencyContactAddress?.toUpperCase(),
          contactNumber: values?.emergencyContactNumber?.toUpperCase(),
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
      <h1 className="text-2xl mb-[2vh]">Enroll Student</h1>

      <div>
        <Form layout="vertical" className="w-1/2" form={form}>
          <Form.Item label="Year" name="year">
            <Select
              className="w-full mb=[2vh]"
              defaultValue={`${new Date().getFullYear()}-${
                new Date().getFullYear() + 1
              }`}
              size="large"
              onChange={(value) => {
                form.resetFields(["course_name", "offering_id"]);
                setOfferingsSearchParams({
                  ...offeringsSearchParams,
                  yearOffered: value,
                });
              }}
            >
              {YEAR?.map((year) => (
                <Option value={year} key={year}>
                  {year}
                </Option>
              ))}
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

          <Form.Item
            label="Course Offering:"
            name="offering_id"
            layout="vertical"
            className="mb-[2vh]"
          >
            <Select
              size="large"
              disabled={getOfferingsLoading || getOfferingsError}
              onChange={(value) => {
                setSelectedOfferingId(value);
              }}
            >
              {offerings &&
                offerings?.data?.map((offering) => {
                  return (
                    <Option key={offering?.id} value={offering?.id}>
                      {getCourseOfferingName(offering)}
                    </Option>
                  );
                })}
            </Select>

            {getOfferingsError && (
              <label className="text-secondary">
                Error loading offerings. please try again later!{" "}
              </label>
            )}
          </Form.Item>
        </Form>

        {selectedOffering && (
          <div className="flex flex-col">
            <label className="text-sm">Enrollee type</label>
            <CustomInput
              disabled
              className="w-1/2 mb-[2vh] px-[12px] py-[10px]"
              type="text"
              value={selectedOffering?.offeringType}
            />
          </div>
        )}

        {selectedOffering && isOfferingIntensive ? (
          <p className="mb-[16px]">
            {" "}
            Year Level: <b>Graduated</b>
          </p>
        ) : (
          <Form.Item
            label="Year Level"
            name="yearLevel"
            layout="vertical"
            className="w-1/2 mb-[2vh]"
          >
            <Select
              size="large"
              name="yearLevel"
              onChange={(data) =>
                setAdditionalEnrollmentData({
                  ...additionalEnrollmentData,
                  yearLevel: data,
                })
              }
            >
              {YEAR_LEVELS?.map((year) => (
                <Option value={year} key={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <div className="flex flex-col">
          <label className="text-sm">Review Fee</label>
          <CustomInput
            className="w-1/2 mb-[2vh] px-[12px] py-[10px]"
            type="text"
            value={additionalEnrollmentData?.reviewFee}
            onChange={(e) =>
              setAdditionalEnrollmentData({
                ...additionalEnrollmentData,
                reviewFee: e.target.value,
              })
            }
          />
        </div>

        <Form.Item
          label="Discount Amount"
          name="discountAmount"
          layout="vertical"
          className="w-1/2 mb-[2vh]"
        >
          <CustomInput
            type="text"
            name="discount"
            onChange={(e) =>
              setAdditionalEnrollmentData({
                ...additionalEnrollmentData,
                discountAmount: e.target.value,
              })
            }
          />
        </Form.Item>

        <Form.Item
          label="Remarks"
          name="remarks"
          layout="vertical"
          className="w-1/2 mb-[2vh]"
        >
          <CustomInput
            type="text"
            name="remarks"
            onChange={(e) =>
              setAdditionalEnrollmentData({
                ...additionalEnrollmentData,
                remarks: e.target.value,
              })
            }
          />
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
                  onSelect={(_, option) => {
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
                  <Option value="SECOND_TAKER">2nd Taker</Option>
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
          >
            <>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Please input your First Name",
                  },
                ]}
              >
                <CustomInput
                  type="text"
                  name="firstName"
                  className="uppercase"
                />
              </Form.Item>

              <Form.Item label="Middle Name" name="middleName">
                <CustomInput
                  type="text"
                  name="middleName"
                  className="uppercase"
                />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "Please input your Last Name",
                  },
                ]}
              >
                <CustomInput
                  type="text"
                  name="lastName"
                  className="uppercase"
                />
              </Form.Item>

              {filteredSchools && filteredSchools?.length === 1 ? (
                <div className="flex flex-col mb-6">
                  <label className="text-sm mb-2">School</label>
                  <CustomInput
                    disabled
                    type="text"
                    value={filteredSchools[0].name}
                  />
                </div>
              ) : (
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
                    {filteredSchools &&
                      filteredSchools?.map((school) => (
                        <Option key={school.id} value={school.id}>
                          {school.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              )}

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
                  className="mb-[2vh] uppercase"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Contact No."
                name="contactNumber"
                rules={[
                  {
                    required: true,
                    message: "Please input your Contact No.",
                  },
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
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input your emergency contact name!",
                  //   },
                  // ]}
                >
                  <CustomInput
                    type="text"
                    name="emergencyName"
                    className="uppercase"
                  />
                </Form.Item>

                <Form.Item
                  label="Relationship"
                  name="emergencyContactRelationship"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message:
                  //       "Please input your relation on your emergency contact!",
                  //   },
                  // ]}
                >
                  <CustomInput
                    type="text"
                    name="emergencyRelationship"
                    className="uppercase"
                  />
                </Form.Item>

                <Form.Item
                  label="Emergency Address"
                  name="emergencyContactAddress"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input your emergency contact address!",
                  //   },
                  // ]}
                >
                  <TextArea
                    type="text"
                    name="emergencyAddress"
                    placeholder=""
                    rows={4}
                    className="mb-[2vh] uppercase"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Emergency Contact No."
                  name="emergencyContactNumber"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input your emergency contact no.",
                  //   },
                  // ]}
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
