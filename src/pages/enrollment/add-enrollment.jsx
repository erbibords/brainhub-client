import React, { useState, useCallback, useEffect } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import CustomInput from "../../components/Input/Input";
import { Layout, Select, Input, Button, Form } from "antd";
import { useStudentContext } from "../../contexts/students";

import Swal from "sweetalert2";

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const Enrollment = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { addStudent } = useStudentContext();

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onFinish = useCallback(async (values) => {
    // console.log("Received values of form: ", values);

    const createStudentValues = {
      firstName: values.firstName,
      middleName: values.middleName,
      lastName: values.lastName,
      schoolId: values.schoolId,
      address: values.address,
      age: 20,
      contactNumber: values.contactNumber,
      email: "test1@test.com",
      emergencyContact: {
        name: "Rey Guidoriagao Sr.",
        relationship: "Father",
        address: "North baluarte molo, iloilo city",
        contactNumber: "09182254320",
      },
    };

    const student = await addStudent(createStudentValues);
    console.log(student);
    // await enrollment({
    //   first_name: values.first_name,
    //   // password: values.password,
    //   mname: values.mname,
    //   lname: values.lname,
    //   school: values.school,
    //   contactNo: values.contactNo,
    // });
  }, []);

  const initialMarginBottom = "2vh";
  const [formData, setFormData] = useState({
    first_name: "",
    middleName: "",
    lastName: "",
    school: "",
    status: "",
    address: "",
    contactNo: "",
    emergencyContact: {
      name: "",
      relationship: "",
      address: "",
      contactNo: "",
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

  //   const handleSave = () => {
  //     if (!formData.first_name || !formData.lastName || !formData.contactNo || !formData.status || !formData.address) {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: 'Please fill in all required fields!',
  //       });
  //       return;
  //     }
  //     console.log("Form Data:", formData);
  //     // You can perform additional actions here, such as sending the data to an API
  //   };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content
          style={{
            margin: "25px 25px",
            paddingRight: screenWidth <= 1024 ? 0 : "35%",
          }}
        >
          <Form
            name="enrollment"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <div>
              <h1
                style={{ fontSize: "2em", marginBottom: initialMarginBottom }}
              >
                Add Enrollment
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: initialMarginBottom,
                }}
              >
                <div style={{ flex: 1, marginRight: "1rem" }}>
                  <span>Name</span>
                  <Form.Item
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
                      placeholder="First Name"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
                <div style={{ flex: 1, marginRight: "1rem" }}>
                  <span>&nbsp;</span>
                  <Form.Item
                    name="middleName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your First Name",
                      },
                    ]}
                  >
                    <CustomInput
                      type="text"
                      name="middleName"
                      placeholder="Middle Name"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
                <div style={{ flex: 1 }}>
                  <span>&nbsp;</span>
                  <Form.Item
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your First Name",
                      },
                    ]}
                  >
                    <CustomInput
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
              <span>School</span>
              <Form.Item
                name="schoolId"
                rules={[
                  { required: true, message: "Please input your School" },
                ]}
              >
                <CustomInput
                  type="text"
                  name="schoolId"
                  placeholder="School"
                  onChange={handleChange}
                />
              </Form.Item>

              <span>Select Status</span>
              <Select
                style={{ width: "100%", marginBottom: initialMarginBottom }}
                size="large"
                defaultValue="1st Taker"
              >
                <Option value="1st Taker">1st Taker</Option>
                <Option value="Re-Taker">Re-Taker</Option>
                <Option value="Summer">Summer</Option>
              </Select>
              <span>Address</span>

              <TextArea
                type="text"
                name="address"
                placeholder=""
                rows={4}
                style={{ marginBottom: initialMarginBottom }}
                size="large"
                onChange={handleChange}
              />
              <span>Contact No.</span>
              <Form.Item
                name="contactNumber"
                rules={[
                  { required: true, message: "Please input your Contact No." },
                ]}
              >
                <Input
                  type="number"
                  name="contactNumber"
                  placeholder=""
                  size="large"
                  style={{ marginBottom: initialMarginBottom }}
                  onChange={handleChange}
                />
              </Form.Item>

              <br />
              <br />
              <hr />
              <br />
              <div
                style={{
                  display: "inline",
                  flexDirection: "row",
                  marginBottom: initialMarginBottom,
                }}
              >
                <div style={{ marginBottom: initialMarginBottom }}>
                  <small>
                    <i style={{ marginBottom: initialMarginBottom }}>
                      Person to be notified in case of emergency:
                    </i>
                  </small>
                </div>
                <span>Name</span>
                <CustomInput
                  type="text"
                  name="name"
                  placeholder=""
                  style={{ marginBottom: initialMarginBottom }}
                  onChange={handleEmergencyContactChange}
                />

                <span>Relationship</span>
                <CustomInput
                  type="text"
                  name="relationship"
                  placeholder=""
                  style={{ marginBottom: initialMarginBottom }}
                  onChange={handleEmergencyContactChange}
                />

                <span>Address</span>
                <TextArea
                  type="text"
                  name="address"
                  placeholder=""
                  rows={4}
                  style={{ marginBottom: initialMarginBottom }}
                  size="large"
                  onChange={handleEmergencyContactChange}
                />
                <span>Contact No.</span>
                <Input
                  type="number"
                  name="contactNo"
                  placeholder=""
                  size="large"
                  style={{ marginBottom: initialMarginBottom }}
                  onChange={handleEmergencyContactChange}
                />
              </div>

              {/* Save button */}
              <div style={{ textAlign: "right", marginBottom: "20px" }}>
                {/* <Button type="primary" onClick={handleSave}>Save</Button> */}
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default Enrollment;
