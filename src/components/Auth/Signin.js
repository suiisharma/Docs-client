// Signin.js
import React, { useContext } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { LockOutlined,MailOutlined } from '@ant-design/icons';
import './Signin.css'; // Import your CSS file for additional styles
import Axios  from 'axios';
import {useNavigate,Link} from 'react-router-dom';
import {message} from 'antd';
import { AuthContext } from '../../context/AuthContext';

const Signin = () => {
  const navigate= useNavigate();
  const {setToken}=useContext(AuthContext);


  const onFinish = async(values) => {
    try {
      const response = await sendData(values);
      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        await setToken(response.data.token);
        await message.success(response.data.message || 'Login Successfull!.');
        navigate('/');
      }
      
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || 'Login failed!';
        message.error(errorMessage);
      } else {
        message.error('Something went wrong!');
      }
    }
  };


  const sendData = async (userData) => {
    try {
      const formData = new FormData();
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      
      const response = await Axios.post('https://docsbackend-cvv1.onrender.com/login/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="signin-container">
      <div className="background-animation"></div>
      <Card className="signin-card">
        <h1 className="signin-title">Welcome Back!</h1>
        <Form
          name="signin"
          initialValues={{ remember: true,
          email: 'rotaj94720@dacgu.com', 
          password: "m]48}V_Da8FSu'W"
           }}
          onFinish={onFinish}
        >
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
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              className="input-field"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="signin-button">
              Sign In
            </Button>
          </Form.Item>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </Form>
      </Card>
      <div className="fun-characters">
        <span role="img" aria-label="emoji">🚀</span>
        <span role="img" aria-label="emoji">🌟</span>
        <span role="img" aria-label="emoji">🎉</span>
      </div>
    </div>
  );
};

export default Signin;
