import React, { useState, useContext } from 'react';
import { Layout, Button, Drawer, Menu, Form, Input, Typography } from 'antd';
import {
    RightOutlined,
    UserOutlined,
    EyeOutlined,
    UploadOutlined,
    MailOutlined, LinkedinOutlined
} from '@ant-design/icons';
import './Home.css';
import { ReactComponent as Icon } from '../../assets/favicon.svg';
import UploadDocsModal from '../utils/UploadDocsModal';
import UserProfile from '../pages/Profile';
import ViewDocs from './ViewDocs';
import axios from 'axios';
import { message } from 'antd';
import { AuthContext } from '../../context/AuthContext';

const { Header, Sider, Content } = Layout;

const Home = () => {
    const {token,setToken}=useContext(AuthContext)
    const [showDrawer, setShowDrawer] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [showViewDocs, setShowViewDocs] = useState(false); // State to control rendering
    const [ShowWelcomText, setShowWelcomeText] = useState(true);

    const { Title, Text } = Typography;

    const handleMenuClick = (e) => {
        const { key } = e;
        setSelectedKeys([key]);
        onCloseRightDrawer();
        if (key === '3') {
            handleModalOpen();
            setSelectedKeys([1]);
            setShowProfile(false);
            setShowViewDocs(false);
            setShowWelcomeText(false);
        } else if (key === '4') {
            setShowProfile(true);
            setShowViewDocs(false);
            setShowWelcomeText(false);
        }
        else if (key === '2') {
            setShowViewDocs(true);
            setShowProfile(false);
            setShowWelcomeText(false);
        }
    };

    const showRightDrawer = () => {
        setShowDrawer(true);
    };

    const onCloseRightDrawer = () => {
        setShowDrawer(false);
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get('https://docsbackend-cvv1.onrender.com/logout/', {
            headers:{
                Authorization:`token ${token}`
            }
            })
            if(response){
                const val= localStorage.getItem('token')
                if(val){
                localStorage.removeItem('token')
                }
                setToken("");
                await message.info(response?.data?.message || 'Logged out successfully!' )
            }
        } catch (error) {
            message.error(error?.response?.data?.detail || error?.response?.data?.detail || 'Some error occurred!.');
        }
    }

    const handleModalOpen = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    

    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        console.log('Form values:', values);
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={true}
                width={260}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    zIndex: 1000,
                }}
            >
                <div className="demo-logo-vertical" style={{ display: 'flex', justifyContent: 'center', paddingTop: '5px', paddingBottom: '5px', color: 'whitesmoke', alignchildren: 'center' }}>
                    <Icon style={{ width: '24px', height: '24px' }}></Icon>
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} selectedKeys={selectedKeys}
                    onClick={handleMenuClick}>
                    <Menu.Item key="2" icon={<EyeOutlined />} children="View Docs" />
                    <Menu.Item key="3" icon={<UploadOutlined />} children="Upload Docs" />
                    <Menu.Item key="4" icon={<UserOutlined />} children="Profile" />
                </Menu>
                <UploadDocsModal visible={modalVisible} onClose={handleModalClose} />
                <Button className="logout-btn" onClick={handleLogout}>Logout</Button>
            </Sider>
            <Layout style={{ marginLeft:80}}>
                <Header className="site-layout-header">
                    <Button
                        type="text"
                        icon={<RightOutlined />}
                        onClick={showRightDrawer}
                        className="open-drawer-btn"
                    />
                </Header>
                <Content className="site-layout-content">
                    <Drawer
                        title="Contact"
                        placement="right"
                        onClose={onCloseRightDrawer}
                        open={showDrawer}
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            zIndex: 999,
                        }}
                    >
                        <Form
                            form={form}
                            onFinish={handleSubmit}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter your name' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input prefix={<MailOutlined />} />
                            </Form.Item>

                            <Form.Item
                                label="Message"
                                name="message"
                                rules={[{ required: true, message: 'Please enter a message' }]}
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Form>

                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <p>Contact me via:</p>
                            <Button icon={<MailOutlined></MailOutlined>} href="mailto:souravdalana@gmail.com" target='_blank' rel="noreferrer">Email</Button>
                            <br />
                            <Button icon={<LinkedinOutlined></LinkedinOutlined>} href="https://www.linkedin.com/in/sourav-sharma-646291222/" target='_blank' rel="noreferrer">LinkedIn Profile</Button>
                        </div>
                    </Drawer>
                    <div className="scrollable-content" style={{ marginTop: '100px', overflow: 'scroll' }}>
                        {showViewDocs ? <ViewDocs /> :
                            showProfile ? <UserProfile></UserProfile> :
                                ShowWelcomText && (<div style={{ textAlign: 'center', paddingTop: '100px' }}>
                                    <Title level={2} style={{ color: '#1890ff', fontFamily: 'Arial, sans-serif' }}>
                                        Welcome to a World of Learning
                                    </Title>
                                    <Text style={{ color: '#666', fontSize: '18px', marginTop: '20px', display: 'block' }}>
                                        Explore, Engage, Evolve
                                    </Text>
                                </div>)
                        }
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;
