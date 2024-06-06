import React from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import CustomInput from "../../components/Input/Input";
import { Layout, Select, Input  } from "antd";
const { Content } = Layout;
const { Option  } = Select;
const { TextArea } = Input;

const Enrollment = () => {
  const initialMarginBottom = "2vh";
  
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
                <CustomInput type="text" placeholder="First Name" />
              </div>
              <div style={{ flex: 1, marginRight: "1rem" }}>
                <span>&nbsp;</span>
                <CustomInput type="text" placeholder="Middle Name" />
              </div>
              <div style={{ flex: 1 }}>
                <span>&nbsp;</span>
                <CustomInput type="text" placeholder="Last Name" />
              </div>
            </div>
            <span>School</span>
            <CustomInput type="text" placeholder="School" style={{ marginBottom: initialMarginBottom }} />
            <span>Select Status</span>
            <Select defaultValue="Option 1" style={{ width: "100%", marginBottom: initialMarginBottom }} size="large" >
              <Option value="1st Taker">1st Taker</Option>
              <Option value="Re-Taker">Re-Taker</Option>
              <Option value="Summer">Summer</Option>
            </Select>
            <span>Address</span>
            <TextArea type="text" placeholder=""  rows={4} style={{ marginBottom: initialMarginBottom }} size="large"/>
            <span>Contact No.</span>
            <CustomInput type="text" placeholder="" style={{ marginBottom: initialMarginBottom }} />

            <br/>
            <br/>
            <hr/>
            <br/>
            <div style={{ display: "inline", flexDirection: "row", marginBottom: initialMarginBottom }}>
              <div style={{ marginBottom: initialMarginBottom }}>
                <small><i style={{ marginBottom: initialMarginBottom }}>Person to be notified in case of emergency:</i></small>
              </div>
              <span>Name</span>
              <CustomInput type="text" placeholder="" style={{ marginBottom: initialMarginBottom }} />

              <span>Relationship</span>
              <CustomInput type="text" placeholder="" style={{ marginBottom: initialMarginBottom }} />

              <span>Address</span>
              <TextArea type="text" placeholder=""  rows={4} style={{ marginBottom: initialMarginBottom }} size="large"/>
              <span>Contact No.</span>
              <CustomInput type="text" placeholder="" style={{ marginBottom: initialMarginBottom }} />
            </div>



          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Enrollment;
