import React, { useCallback, useEffect } from "react";
import CustomInput from "../../components/Input/Input";
import { Form, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, isLoading, user, isBootstrapping } = useAuth();

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }
    if (isAuthenticated && user) {
      navigate(user.isSuperAdmin ? "/admin/dashboard" : "/students");
    }
  }, [isAuthenticated, isBootstrapping, navigate, user]);

  const onFinish = useCallback(
    async (values) => {
      const loginResult = await login(values.email, values.password);

      if (loginResult) {
        Swal.fire({
          icon: "success",
          title: "Login success",
          timer: 2000,
        });
        navigate(loginResult.isSuperAdmin ? "/admin/dashboard" : "/students");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Error",
          text: "The email and password you entered did not match our records. Please double check and try again!",
        });
      }
    },
    [login, navigate]
  );

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
            rules={[
              { required: true, message: "Please input your email!" },
              {
                type: "email",
                message: "The input is not a valid email!",
              },
            ]}
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
              loading={isLoading}
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
