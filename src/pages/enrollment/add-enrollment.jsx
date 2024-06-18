import React, { useState, useCallback, useEffect } from "react";
import CustomInput from "../../components/Input/Input";
import CustomSelect from "../../components/Select/Select";
import { Layout, Select, Input, Button, Form } from "antd";
import Swal from "sweetalert2";
import CustomButton from "../../components/Button/Button";
import { useOfferingsContext } from "../../contexts/offerings";

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const Enrollment = () => {
  const [offeringsSearchParams, setOfferingsSearchParams] = useState({});
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

  const onFinish = useCallback(async (values) => {
    console.log("Received values of form: ", values);

    // await enrollment({
    //     firstName: values.firstName,

    //     middleName: values.middleName,
    //     firstName: values.firstName,
    //     school: values.school,
    //     contactNumber: values.contactNumber,
    // });
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    schoolId: "",
    status: "",
    address: "",
    contactNumber: "",
    emergencyContact: {
      name: "",
      relationship: "",
      address: "",
      contactNumber: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      emergencyContact: {
        ...prevState.emergencyContact,
        [name]: value,
      },
    }));
  };

  console.log(offerings);

  return (
    <Form
      name="enrollment"
      onFinish={onFinish}
      layout="vertical"
      className="w-1/2"
    >
      <div>
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

        <Form.Item
          label="Semester"
          name="semester"
          onChange={(value) =>
            setOfferingsSearchParams({
              ...offeringsSearchParams,
              semester: value,
            })
          }
        >
          <Select className="w-full mb=[2vh]" size="large" defaultValue="1st">
            <Option value="FIRST_SEMESTER">1st</Option>
            <Option value="SECOND_SEMESTER">2nd</Option>
            <Option value="SUMMER">Summer</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Course Offering" name="courseId">
          <Select
            className="w-full mb=[2vh]"
            size="large"
            disabled={getOfferingsLoading || getOfferingsError}
          >
            {offerings &&
              offerings?.data?.map((offering) => (
                <Option value={offering?.id}>
                  {" "}
                  {`${offering?.course?.name}-${offering?.program}-${offering?.yearOffered}-${offering?.semester}`}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <br />
        <hr />
        <br />

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please input your School" }]}
        >
          <CustomInput type="text" name="firstName" onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Middle Name"
          name="middleName"
          rules={[{ required: true, message: "Please input your Middle Name" }]}
        >
          <CustomInput type="text" name="middleName" onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please input your Last Name" }]}
        >
          <CustomInput type="text" name="lastName" onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="School"
          name="schoolId"
          rules={[{ required: true, message: "Please input your School" }]}
        >
          <CustomInput type="text" name="schoolId" onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Status" name="takerType">
          <Select
            className="w-full mb=[2vh]"
            size="large"
            defaultValue="1st Taker"
          >
            <Option value="1st Taker">1st Taker</Option>
            <Option value="Re-Taker">Re-Taker</Option>
            <Option value="Summer">Summer</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Address" name="address">
          <TextArea
            type="text"
            name="address"
            placeholder=""
            rows={4}
            className="mb-[2vh]"
            size="large"
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Contact No."
          name="contactNumber"
          rules={[{ required: true, message: "Please input your Contact No." }]}
        >
          <Input
            type="number"
            name="contactNumber"
            placeholder=""
            size="large"
            className="mb-[2vh]"
            onChange={handleChange}
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

          <Form.Item label="Name" name="name">
            <CustomInput
              type="text"
              name="name"
              placeholder=""
              className="mb-[2vh]"
              onChange={handleEmergencyContactChange}
            />
          </Form.Item>

          <Form.Item label="Relationship" name="relationship">
            <CustomInput
              type="text"
              name="relationship"
              placeholder=""
              className="mb-[2vh]"
              onChange={handleEmergencyContactChange}
            />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <TextArea
              type="text"
              name="address"
              placeholder=""
              rows={4}
              className="mb-[2vh]"
              size="large"
              onChange={handleEmergencyContactChange}
            />
          </Form.Item>

          <Form.Item label="Contact No." name="contactNumber">
            <Input
              type="number"
              name="contactNumber"
              placeholder=""
              size="large"
              className="mb-[2vh]"
              onChange={handleEmergencyContactChange}
            />
          </Form.Item>
        </div>

        {/* Save button */}
        <div className="text-right mb-5">
          <Form.Item>
            <CustomButton type="primary" htmlType="submit" size="large">
              Submit
            </CustomButton>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default Enrollment;
