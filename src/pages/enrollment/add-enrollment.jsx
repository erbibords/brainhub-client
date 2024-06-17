import React, { useState, useCallback, useEffect } from "react";
import CustomInput from "../../components/Input/Input";
import CustomSelect from "../../components/Select/Select";
import { Layout, Select, Input, Button, Form } from "antd";
const { Option } = Select;
const { TextArea } = Input;

const Enrollment = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const initialMarginBottom = "2vh";

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

  return (
    <Form
      name="enrollment"
      initialValues={{ remember: true }}
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
            defaultValue="Intensive"
          >
            <Option value="Intensive">Intensive</Option>
            <Option value="Enhancement-Intensive">Enhancement-Intensive</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Semester" name="semester">
          <Select className="w-full mb=[2vh]" size="large" defaultValue="1st">
            <Option value="1st">1st</Option>
            <Option value="2nd">2nd</Option>
            <Option value="Summer">Summer</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Year" name="year">
          <Select className="w-full mb=[2vh]" size="large" defaultValue="2024">
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

        <Form.Item label="Course Offering" name="courseId">
          <Select
            className="w-full mb=[2vh]"
            size="large"
            defaultValue=""
          ></Select>
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
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-auto bg-primary text-white"
            >
              Save
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default Enrollment;
