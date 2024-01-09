import React, { useContext } from 'react';
import { Form, Input, Button, Card, Upload } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useNavigate,Link } from 'react-router-dom';
import './Signup.css';
import axios from 'axios'
import { message } from 'antd'
import { AuthContext } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const {setToken}=useContext(AuthContext);
  
  const onFinish = async (values) => {
    try {
      const response = await sendData(values);
      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        await message.success(response.data.message || 'Registration Successfull!.');
        await setToken(response.data.token);
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || 'Registration failed!';
        message.error(errorMessage);
      } else {
        message.error('Something went wrong!');
      }
    }
  };

  const sendData = async (userData) => {
    try {
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('first_name', userData.firstname);
      formData.append('last_name', userData.lastname);
      formData.append('password1', userData.password);
      formData.append('password2', userData.confirmPassword);

      if (userData.profilePic && userData.profilePic.length > 0) {
        formData.append('profile_pic', userData.profilePic[0].originFileObj);
      }

      const response = await axios.post('https://docsbackend-cvv1.onrender.com/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const uploadProps = {
    beforeUpload: () => false,
  };

  return (
    <div className="signup-container">
      <div className="background-animation"></div>
      <Card className="signup-card">
        <h1 className="signup-title">Create an Account</h1>
        <Form name="signup" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            name="firstname"
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="First Name"
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            name="lastname"
            rules={[{ required: true, message: 'Please input your last name!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Last Name"
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match!')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
              className="input-field"
            />
          </Form.Item>
          <Form.Item
            name="profilePic"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="signup-button">
              Sign Up
            </Button>
          </Form.Item>
          <p>
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </Form>
      </Card>
      <div className="fun-characters">
        <span role="img" aria-label="emoji">
          🚀
        </span>
        <span role="img" aria-label="emoji">
          🌟
        </span>
        <span role="img" aria-label="emoji">
          🎉
        </span>
      </div>
    </div>
  );
};

export default Signup;
