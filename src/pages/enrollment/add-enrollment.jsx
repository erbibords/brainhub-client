import { useState, useCallback, useEffect, useMemo } from "react";
import CustomInput from "../../components/Input/Input";
import useSchools from "../../hooks/useSchools";
import useCourses from "../../hooks/useCourses";
import { useStudentContext } from "../../contexts/students";
import { Select, Input, Form, Radio, AutoComplete } from "antd";
import Swal from "sweetalert2";
import CustomButton from "../../components/Button/Button";
import useMutation from "../../hooks/useMutation";
import useOffering from "../../hooks/useOffering";
import fetchAllPages from "../../utils/fetchAllPages";

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
  const { courses, isLoading: getCoursesLoading, error: getCoursesError } = useCourses();
  const [offeringsSearchParams, setOfferingsSearchParams] = useState({
    yearOffered: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  });
  const [offerings, setOfferings] = useState({ data: [], meta: {} });
  const [getOfferingsLoading, setGetOfferingsLoading] = useState(false);
  const [getOfferingsError, setGetOfferingsError] = useState(false);

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

  const filteredSchools = useMemo(() => {
    if (!selectedOffering) return [];
    return schools?.data?.filter((sc) => {
      if (selectedOffering.offeringType === "COMBI") return true;
      return selectedOffering.school && sc.id === selectedOffering.school.id;
    }) || [];
  }, [selectedOffering, schools?.data]);

  const isOfferingIntensive = useMemo(() => {
    return (
      selectedOffering && selectedOffering?.reviewProgram?.name?.includes("INT")
    );
  }, [selectedOffering]);

  useEffect(() => {
    if (selectedOffering) {
      setAdditionalEnrollmentData((prev) => ({
        ...prev,
        reviewFee: selectedOffering?.reviewFee ?? undefined,
      }));
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

  useEffect(() => {
    let cancelled = false;

    const loadOfferings = async () => {
      try {
        setGetOfferingsLoading(true);
        setGetOfferingsError(false);
        const result = await fetchAllPages({
          baseUrl: `/branches/${DEFAULT_BRANCH_ID()}/offerings`,
          params: offeringsSearchParams,
          pageSize: 300,
          maxPages: 200,
          shouldCancel: () => cancelled,
        });

        if (!cancelled) {
          setOfferings({
            data: result.data || [],
            meta: result.meta || {},
          });
        }
      } catch (error) {
        if (!cancelled) {
          setGetOfferingsError(error || true);
          setOfferings({ data: [], meta: {} });
        }
      } finally {
        if (!cancelled) {
          setGetOfferingsLoading(false);
        }
      }
    };

    loadOfferings();

    return () => {
      cancelled = true;
    };
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
        const studentName = `${student.firstName} ${
          student?.middleName ?? ""
        } ${student.lastName}`?.toLowerCase();
        const searchText = studentSearchText?.toLowerCase();
        const nameMatch = studentName?.includes(searchText);

        return nameMatch;
      })
    );
  }, [studentSearchText, students]);

  const enrollStudent = useCallback(
    async (data, { studentAlreadySaved = false } = {}) => {
      const warn = (title, text) => {
        Swal.fire({
          icon: "warning",
          title: studentAlreadySaved
            ? "Student was saved, but enrollment did not finish"
            : title,
          text: studentAlreadySaved
            ? `${text || title} Submit again to enroll this student.`
            : text,
          timer: studentAlreadySaved ? 4000 : 2500,
        });
      };

      if (!data) {
        return;
      }

      if (!data.studentId) {
        warn("Please add student to enroll!");
        return;
      }

      if (!data.takerType) {
        warn("Please add taker type!");
        return;
      }

      if (!data.processedBy) {
        warn("Please select processed by.");
        return;
      }

      if (!data.reviewFee) {
        warn("Please add review fee.");
        return;
      }

      if (!selectedOfferingId) {
        warn("Please select course offering!");
        return;
      }

      Swal.fire({
        title: "Enrolling student...",
        text: "Please wait while we process your request.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const enrollmentUrl = `/branches/${DEFAULT_BRANCH_ID()}/offerings/${selectedOfferingId}/enrollments`;
        const enrollmentRes = await addEnrollment(data, enrollmentUrl);

        if (enrollmentRes?.id) {
          const enrollmentId = enrollmentRes.id;
          const studentId = data?.studentId;

          Swal.fire({
            icon: "success",
            title: "Enrollment successful!",
            text: "Redirecting to enrollment form printing...",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
              navigate(`/prints/enrollment/${studentId}/${enrollmentId}`);
            },
          });
          return enrollmentRes;
        }

        console.error('[EnrollStudent] Response missing enrollment id:', enrollmentRes);
        warn(
          "Enrollment response was empty",
          "Please check if enrollment was created successfully."
        );
      } catch (error) {
        console.error('[EnrollStudent] Enrollment error:', error);
        console.error('[EnrollStudent] Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        const serverMessage =
          error?.response?.data?.message ||
          error?.message ||
          "This may be due to inputs. Please try again later!";
        Swal.fire({
          icon: "error",
          title: studentAlreadySaved
            ? "Student was saved, but enrollment failed"
            : "Enrollment failed!",
          text: studentAlreadySaved
            ? `${serverMessage} Submit again to enroll this student.`
            : serverMessage,
          timer: 4000,
        });
      }
    },
    [addEnrollment, navigate, selectedOfferingId]
  );

  const enrollNewStudent = useCallback(
    async (values) => {
      if (!selectedProcessedBy) {
        Swal.fire({
          icon: "warning",
          title: "Please select processed by.",
          timer: 2500,
        });
        return;
      }

      if (!toSafeNumber(additionalEnrollmentData?.reviewFee)) {
        Swal.fire({
          icon: "warning",
          title: "Please add review fee.",
          timer: 2500,
        });
        return;
      }

      Swal.fire({
        title: "Creating student...",
        text: "Please wait while we process your request.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const res = await addStudent(values);
        const enrollmentData = {
          takerType: "FIRST_TAKER",
          status: "",
          studentId: res.id,
          processedBy: selectedProcessedBy,
          discountAmount: toSafeNumber(
            additionalEnrollmentData?.discountAmount
          ).toString(),
          reviewFee: toSafeNumber(
            additionalEnrollmentData?.reviewFee
          ).toString(),
          yearLevel: isOfferingIntensive
            ? "Graduated"
            : additionalEnrollmentData?.yearLevel,
          remarks: additionalEnrollmentData?.remarks,
        };
        await enrollStudent(enrollmentData, { studentAlreadySaved: true });
      } catch (error) {
        console.error('[AddStudent] Enrollment page error:', error);
        console.error('[AddStudent] Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        Swal.fire({
          icon: "error",
          title: "Error adding student!",
          text:
            error?.response?.data?.message ||
            error?.message ||
            "It may be due to inputs. Please double check and try again!",
          timer: 4000,
        });
      }
    },
    [addStudent, enrollStudent, selectedProcessedBy, additionalEnrollmentData, isOfferingIntensive]
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
      discountAmount: toSafeNumber(
        additionalEnrollmentData?.discountAmount
      ).toString(),
      reviewFee: toSafeNumber(additionalEnrollmentData?.reviewFee).toString(),
      yearLevel: isOfferingIntensive
        ? "Graduated"
        : additionalEnrollmentData?.yearLevel,
      remarks: additionalEnrollmentData?.remarks,
    };

    try {
      await enrollStudent(data);
    } catch (error) {
      // enrollStudent handles its own errors
    }
  }, [
    enrollStudent,
    selectedOfferingId,
    takerType,
    selectedExistingStudentId,
    selectedProcessedBy,
    additionalEnrollmentData,
    isOfferingIntensive,
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
      enrollNewStudent,
      filteredSchools,
      selectedOfferingId,
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
            name="discountAmount"
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
              disabled={addEnrollmentLoading}
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
