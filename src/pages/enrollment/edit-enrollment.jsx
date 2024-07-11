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
import useOffering from "../../hooks/useOffering";
import { ArrowLeftOutlined } from "@ant-design/icons";

import {
  DEFAULT_BRANCH_ID,
  PROCESSED_BY,
  YEAR,
  YEAR_LEVELS,
} from "../../constants";
import { useNavigate } from "react-router-dom";
import { getCourseOfferingName } from "../../utils/mappings";

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

const EditEnrollment = () => {
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

  const [selectedExistingStudentId, setSelectedStudentId] = useState(undefined);
  const [takerType, setTakerType] = useState("FIRST_TAKER");
  const [additionalEnrollmentData, setAdditionalEnrollmentData] = useState({
    yearLevel: undefined,
    reviewFee: undefined,
    discountAmount: undefined,
    remarks: undefined,
  });

  const { data: selectedOffering } = useOffering(selectedOfferingId ?? null);

  const {
    data: offerings,
    getOfferingsLoading,
    getOfferingsError,
    setParams: setOfferingsSearchParamsInContext,
  } = useOfferingsContext();

  return (
    <div className="w-full">
      <div>
        <CustomButton
          type="text"
          onClick={() => navigate("/enrollments")}
          icon={<ArrowLeftOutlined />}
          className="mb-6"
        />
        <Form name="enrollment" layout="vertical" className="w-1/2">
          <h1 className="text-2xl mb-[2vh]">Edit Student Enrollment</h1>
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
              rules={[{ required: true, message: "Please input your School" }]}
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
            </div>
          </>
        </Form>
        <Form layout="vertical" className="w-1/2">
          <Form.Item label="Year" name="year">
            <Select
              className="w-full mb=[2vh]"
              size="large"
              onChange={(value) =>
                setOfferingsSearchParams({
                  ...offeringsSearchParams,
                  yearOffered: value,
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

        <Form.Item className="flex justify-center w-1/2">
          <CustomButton type="primary" htmlType="submit" size="large">
            Update
          </CustomButton>
        </Form.Item>
      </div>
    </div>
  );
};

export default EditEnrollment;
