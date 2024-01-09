import React, { useContext, useState } from 'react';
import { Modal, Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const UploadDocsModal = ({ visible, onClose }) => {
  const {token}=useContext(AuthContext)

  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();

      setConfirmLoading(true);

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('file', values.file[0].originFileObj);

      await axios.post('https://docsbackend-cvv1.onrender.com/documents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization:`token ${token}`
        },
      });

      message.success('Document uploaded successfully');
      setConfirmLoading(false);
      form.resetFields()
      onClose();
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    onClose();
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

  const handleError = (error) => {
    message.error(
      error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'Failed to upload document'
    );
    console.log(error);
    setConfirmLoading(false);
  };

  return (
    <Modal
      title="Upload Document"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          loading={confirmLoading}
          onClick={handleUpload}
        >
          Upload
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please enter the title',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: 'Please enter the description',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="File"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: 'Please select a file',
            },
          ]}
        >
          <Upload
            {...uploadProps}
            listType="file"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UploadDocsModal;
