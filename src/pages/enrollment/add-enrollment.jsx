import React, { useState, useCallback, useEffect } from "react";

 
import CustomInput from "../../components/Input/Input";
import CustomSelect from "../../components/Select/Select";
import useSchools from "../../hooks/useSchools";
import { useCourse } from "../../contexts/courses";
import { useStudentContext } from "../../contexts/students";
 
import { Layout, Select, Input, Button, Form, Divider, Radio} from "antd";
import Swal from "sweetalert2";
import CustomButton from "../../components/Button/Button";
import { useOfferingsContext } from "../../contexts/offerings";

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
 

const Enrollment = () => {

  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();

  const [offeringsSearchParams, setOfferingsSearchParams] = useState({});
  const [visibleCourseOffering, setVisibleCourseOffering] = useState(false);
  const [visibleNewStudent, setVisibleNewStudent] = useState(false);
  const [visibleExistingStudent, setVisibleExistingStudent] = useState(false);
  const { students, studentDataLoading, getStudentError } = useStudentContext();
  const [radioValue, setRadioValue] = useState('existing');

  const handleCourseChange = (value) => {
    setVisibleCourseOffering(true);  
  }; 


  useEffect(() => {
    if (radioValue === "new") {
      setVisibleNewStudent(true);
      setVisibleExistingStudent(false);
    } else if (radioValue === "existing") {
      setVisibleExistingStudent(true);
      setVisibleNewStudent(false);
    }
  }, [radioValue]);

  const getRadioStudent = ({ target: { value } }) => {
    console.log('Value:', value);
    setRadioValue(value);
  };
  
  const options = [
    {
      label: 'Existing',
      value: 'existing',
    },
    {
      label: 'New',
      value: 'new',
    }
  ];



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
    <div className="w-full h-[800px] overflow-y-auto">
      <Form
        name="enrollment"
        // onFinish={onFinish}
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


          <Form.Item label="Course" name="course_name" >
          <Select
            className="w-full"
            loading={getCoursesLoading}
            disabled={getCoursesLoading || getCoursesError}
            onChange={handleCourseChange}
          >
          
            {courses &&
              courses?.data?.map((course) => (
                <Option key={course.id} value={course.id}> 
                  {course.name}
                </Option>
              ))}
          </Select>
          </Form.Item>

      
          {visibleCourseOffering && (
          <Form.Item label="Course Offering" name="courseId">
            <Select
              className="w-full mb-[2vh]"
              size="large"
              disabled={getOfferingsLoading || getOfferingsError}
            >
              {offerings &&
                offerings?.data?.map((offering) => (
                  <Option key={offering?.id} value={offering?.id}>
                    {`${offering?.course?.name}-${offering?.program}-${offering?.yearOffered}-${offering?.semester}`}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          )}

        <div className="mb-[2vh]">
            <p>
              <small>
                <i className="mb-[2vh]">
                Select Student to Enroll
                </i>
              </small>
            </p>
        
            <Radio.Group options={options} onChange={getRadioStudent} value={radioValue} optionType="button" />
            {visibleExistingStudent && (
            <Form.Item
              label="Student Name"
              name="studentId"
              className="mt-[10px]"
            >
 
              <Select
                className="w-full"
                loading={studentDataLoading}
                disabled={studentDataLoading || getStudentError}
              >
              
                {students &&
                  students?.data?.map((student) => (
                    <Option key={student.studentId} value={student.studentId}> 
                      {student.firstName} {student.middleName} {student.lastName}
                    </Option>
                  ))}
              </Select>


            </Form.Item>
             )}
          </div>  
          <Divider></Divider>
          {visibleNewStudent && (
            <>
              <Form.Item
                label="First Name"
                name="firstName"
                // rules={[{ required: true, message: "Please input your First Name" }]}
              >
                <CustomInput type="text" name="firstName" onChange={handleChange} />
              </Form.Item>

              <Form.Item
                label="Middle Name"
                name="middleName"
                // rules={[{ required: true, message: "Please input your Middle Name" }]}
              >
                <CustomInput type="text" name="middleName" onChange={handleChange} />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                // rules={[{ required: true, message: "Please input your Last Name" }]}
              >
                <CustomInput type="text" name="lastName" onChange={handleChange} />
              </Form.Item>

              <Form.Item
                label="School"
                name="schoolId"
                // rules={[{ required: true, message: "Please input your School" }]}
              >
                <Select
                  className="w-full"
                  loading={schoolsLoading}
                  disabled={schoolsLoading || schoolsError}
                  onChange={(value) => setSelectedSchoolId(value)}
                >
                  {schools && schools.map((school) => (
                    <Option key={school.id} value={school.id}>
                      {school.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Status" name="takerType">
                <Select
                  className="w-full mb-[2vh]"
                  size="large"
                  defaultValue="FIRST_TAKER"
                >
                  <Option value="FIRST_TAKER">1st Taker</Option>
                  <Option value="SECOND_TAKER">Re-Taker</Option>
                  <Option value="SUMMER">Summer</Option>
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
                <CustomInput type="number" name="contactNumber" className="w-full mb-[2vh] py-[5px]"  />
          
              </Form.Item>

              <hr />
              <br />
              <div className="inline flex-row mb-[2vh]">
                <div className="mb-[2vh]">
                  <small>
                    <i className="mb-[2vh]">Person to be notified in case of emergency:</i>
                  </small>
                </div>

                <Form.Item label="Emergency Contact Name" name="emergencyName">
                   <CustomInput type="text" name="emergencyName"  /> 
                
                </Form.Item>

                <Form.Item label="Relationship" name="emergencyRelationship">
                  <CustomInput
                    type="text"
                    name="emergencyRelationship"
                 
                  />
                </Form.Item>

                <Form.Item label="Emergency Address" name="emergencyAddress">
                  <TextArea
                    type="text"
                    name="emergencyAddress"
                    placeholder=""
                    rows={4}
                    className="mb-[2vh]"
                    size="large"
                    onChange={handleEmergencyContactChange}
                  />
                </Form.Item>

                <Form.Item label="Emergency Contact No." name="emergencyContactNumber">
                  <CustomInput
                    type="number"
                    name="emergencyContactNumber"
                
                    size="large"
                    className="w-full mb-[2vh] py-[5px]"
       
                  />
                </Form.Item>
              </div>
            </>
          )}
 
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
    </div>
  );
};

export default Enrollment;
