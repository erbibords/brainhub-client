import React, { useCallback } from "react";
import CustomInput from "../../components/Input/Input";
import { Form, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login = () => {
  const onFinish = useCallback(async (values) => {
    console.log("Received values of form: ", values);

    await login({
      email: values.email,
      password: values.password,
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)]">
      <Card className="w-1/3 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          Login your account.
        </h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <CustomInput
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              className="bg-gray-100 p-2"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <CustomInput
              type="password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              className="bg-gray-100 p-2"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full bg-primary text-white"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
