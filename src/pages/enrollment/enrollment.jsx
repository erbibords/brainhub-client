import React, { useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import CustomInput from "../../components/Input/Input";
import { Layout, Select, Input, Button } from "antd";
import Swal from "sweetalert2";
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const Enrollment = () => {
  const initialMarginBottom = "2vh";
  const [formData, setFormData] = useState({
    firstName: "",
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

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.contactNo || !formData.status || !formData.address) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
      });
      return;
    }
    console.log("Form Data:", formData);
    // You can perform additional actions here, such as sending the data to an API
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px" }}>
          <div>
            <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>Enrollment</h1>
            <div style={{ display: "flex", flexDirection: "row", marginBottom: initialMarginBottom }}>
              <div style={{ flex: 1, marginRight: "1rem" }}>
                <span>Name</span>
                <CustomInput type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
              </div>
              <div style={{ flex: 1, marginRight: "1rem" }}>
                <span>&nbsp;</span>
                <CustomInput type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} />
              </div>
              <div style={{ flex: 1 }}>
                <span>&nbsp;</span>
                <CustomInput type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
              </div>
            </div>
            <span>School</span>
            <CustomInput type="text" name="school" placeholder="School" style={{ marginBottom: initialMarginBottom }} onChange={handleChange} />
            <span>Select Status</span>
            <Select style={{ width: "100%", marginBottom: initialMarginBottom }} size="large" onChange={(value) => setFormData((prevState) => ({ ...prevState, status: value }))} required>
              <Option ></Option> 
              <Option value="1st Taker">1st Taker</Option>
              <Option value="Re-Taker">Re-Taker</Option>
              <Option value="Summer">Summer</Option>
            </Select>
            <span>Address</span>
            <TextArea type="text" name="address" placeholder="" rows={4} style={{ marginBottom: initialMarginBottom }} size="large" onChange={handleChange} required />
            <span>Contact No.</span>
            <Input type="number" name="contactNo" placeholder="" size="large" style={{ marginBottom: initialMarginBottom }} onChange={handleChange} required />

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
              <Button type="primary" onClick={handleSave}>Save</Button>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Enrollment;
