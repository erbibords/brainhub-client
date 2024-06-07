import React, { useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import CustomInput from "../../components/Input/Input";
import { Layout, Select, Input, Button } from "antd";
import Swal from "sweetalert2";
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const CourseList = () => {
  const initialMarginBottom = "2vh";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px" }}>
          <div>
            <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>Course List</h1>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <Button type="primary">Add Course</Button>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CourseList;
