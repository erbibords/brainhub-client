import React, { useState, useCallback, useEffect } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import CustomInput from "../../components/Input/Input";
import { Layout, Select, Input, Button, Form } from "antd";
import Swal from "sweetalert2";
const { Content } = Layout;
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

        await enrollment({
            first_name: values.first_name,
        
            mname: values.mname,
            lname: values.lname,
            school: values.school,
            contactNo: values.contactNo,
        });
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
      contactNo: ""
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      emergencyContact: {
        ...prevState.emergencyContact,
        [name]: value
      }
    }));
  };
 

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px", paddingRight: screenWidth <= 1024 ? 0 : "45%" }}>
        <Form
          name="enrollment"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
            
          <div>
            <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>Add Enrollment</h1>
      

                <span>First Name:</span>
                <Form.Item
                    name="fname"
                    rules={[{ required: true, message: "Please input your School" }]}
                >
                <CustomInput type="text" name="first_name" placeholder="" onChange={handleChange} />
                </Form.Item>

                <span>Middle Name</span>
                <Form.Item
                    name="mname"
                    rules={[{ required: true, message: "Please input your Middle Name" }]}
                >
                <CustomInput type="text" name="middleName" placeholder="" onChange={handleChange} />
                </Form.Item>

                <span>Last Name</span>
                <Form.Item
                    name="lname"
                    rules={[{ required: true, message: "Please input your Last Name" }]}
                >
                <CustomInput type="text" name="lastName" placeholder="" onChange={handleChange} />
                </Form.Item>

            
                <span>School</span>
                <Form.Item
                    name="school"
                    rules={[{ required: true, message: "Please input your School" }]}
                >
                <CustomInput type="text" name="school" placeholder="" onChange={handleChange} />
                </Form.Item>
          
                <span>Select Status</span>
                <Select style={{ width: "100%", marginBottom: initialMarginBottom }} size="large" defaultValue="1st Taker">
                    <Option value="1st Taker">1st Taker</Option>
                    <Option value="Re-Taker">Re-Taker</Option>
                    <Option value="Summer">Summer</Option>
                </Select>
                <span>Address</span>
                
                <TextArea type="text" name="address" placeholder="" rows={4} style={{ marginBottom: initialMarginBottom }} size="large" onChange={handleChange} />
                <span>Contact No.</span>
                <Form.Item
                    name="contactNo"
                    rules={[{ required: true, message: "Please input your Contact No." }]}
                >
  
                <Input type="number" name="contactNo" placeholder="" size="large" style={{ marginBottom: initialMarginBottom }} onChange={handleChange} />
                </Form.Item>
             

            <br />
            <br />
            <hr />
            <br />
            <div style={{ display: "inline", flexDirection: "row", marginBottom: initialMarginBottom }}>
              <div style={{ marginBottom: initialMarginBottom }}>
                <small><i style={{ marginBottom: initialMarginBottom }}>Person to be notified in case of emergency:</i></small>
              </div>
              <span>Name</span>
              <CustomInput type="text" name="name" placeholder="" style={{ marginBottom: initialMarginBottom }} onChange={handleEmergencyContactChange} />

              <span>Relationship</span>
              <CustomInput type="text" name="relationship" placeholder="" style={{ marginBottom: initialMarginBottom }} onChange={handleEmergencyContactChange} />

              <span>Address</span>
              <TextArea type="text" name="address" placeholder="" rows={4} style={{ marginBottom: initialMarginBottom }} size="large" onChange={handleEmergencyContactChange} />
              <span>Contact No.</span>
              <Input type="number" name="contactNo" placeholder="" size="large" style={{ marginBottom: initialMarginBottom }} onChange={handleEmergencyContactChange} />
            </div>

            {/* Save button */}
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
             
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
