import React, { useEffect, useState } from 'react';
import CustomInput from '../../components/Input/Input';
import { Button, Row, Col, Card, Divider, Skeleton, Form } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import useMutation from '../../hooks/useMutation';
import useSchools from '../../hooks/useSchools';
import Swal from 'sweetalert2';
 

const ViewSchool = () => {
  const navigate = useNavigate();
  const params = useParams();

  if (!params?.schoolId) {
    navigate('/schools');
  }

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const { data, error, isLoading } = useCourse(params.schoolId);

  const onFormSubmission = async (values) => {
    setIsEditing(false);
  };

  
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data]);

   
  return (
    <div>
      <Button
        type="text"
        onClick={() => navigate('/school-list')}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={36} lg={36}>
          {!data || isLoading ? (
            <Card>
              <Skeleton />
            </Card>
          ) : (
            <Card>
              <Form
                form={form}
                name="update_school"
                onFinish={onFormSubmission}
                onFinishFailed={onFormFailed}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={16} lg={18}>
                    <h1 className="text-2xl mb-[2vh]">UI</h1>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={6}>
                    <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                      {isEditing ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            size="large"
                            style={{ marginRight: '10px' }}
                            className="mr-[10px]"
                      
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>

                          <Button
                            size="large"
                            type="primary"
                            className="w-auto bg-primary text-white"
                 
                            htmlType="submit"
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          size="large"
                          className="w-auto bg-primary text-white"
               
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
                <Divider />
                <div layout="vertical" className="w-1/2">
                  <p>
                    <strong>Name:</strong>{' '}
                    {isEditing ? (
                      <Form.Item
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: 'Please input school name',
                          },
                        ]}
                      >
                        <CustomInput />
                      </Form.Item>
                    ) : (
                        "UI"
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Description:</strong>{' '}
                    {isEditing ? (
                      <Form.Item
                        name="description"
                        rules={[
                          {
                            required: true,
                            message: 'Please input school description',
                          },
                        ]}
                      >
                        <CustomInput />
                      </Form.Item>
                    ) : (
                       "testased"
                    )}
                  </p>
                </div>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ViewSchool;