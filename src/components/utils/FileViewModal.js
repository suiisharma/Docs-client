import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import ReactPlayer from 'react-player';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from 'axios';
import { message, Upload, Input } from 'antd';
import { AuthContext } from '../../context/AuthContext';

const FileViewModal = ({ visible, fileUrl, fileType, onClose, docId, refreshDocs, setRefreshDocs ,fileowner}) => {
    const { token } = useContext(AuthContext)
    const [userData, setUserData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://docsbackend-cvv1.onrender.com/profile/', {
                headers: {
                    Authorization: `token ${token}`
                }
            });
            if (response && response.data && response.data.user) {
                setUserData(response.data.user);
            } else {
                console.log(response);
                message.error('Some error occurred!.');
            }
        } catch (error) {
            message.error(error?.response?.data?.detail || 'Some error occurred!.');
        }
    };

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const handleClose = () => {
        // Any additional clean-up or closing logic
        onClose();
    };
    // Function to render the appropriate viewer based on file type
    const renderFileViewer = () => {
        if (fileType.startsWith('video/')) {
            return <ReactPlayer controls playing width='100%' height='auto' url={fileUrl}></ReactPlayer>
        }
        if (fileType.startsWith('audio/')) {
            return <AudioPlayer
                controls
                src={fileUrl}
            />
        }
        const docs = [
            { uri: fileUrl }];
        return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`https://docsbackend-cvv1.onrender.com/document/${docId}`, {
                headers: {
                    Authorization: `token ${token}`
                }
            })

            if (response) {
                await setRefreshDocs(!refreshDocs)
                message.info(response?.data?.message || 'Deletion completed successfully!.')
                handleClose()
            }

        } catch (error) {
            message.error(error?.response?.data?.detail || error?.response?.data?.message || "Some Error occurred!")
        }
    };

    // Function to handle update action
    const handleUpdate = () => {
        setUpdateModalVisible(true);
    };

    const handleUpdateCancel = () => {
        setUpdateModalVisible(false);
    };

    const handleUpdateSubmit = async () => {
        // Check if at least one of title, description, or file is filled
        if (!title && !description && !file) {
            message.error('Please fill in at least one field.');
            return;
        }

        // Prepare form data for API request
        const formData = new FormData();
        if (title) {

            formData.append('title', title);
        }
        if (description) {

            formData.append('description', description);
        }
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await axios.put(`https://docsbackend-cvv1.onrender.com/document/${docId}`, formData, {
                headers: {
                    Authorization: `token ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response) {
                setRefreshDocs(!refreshDocs);
                message.info(response?.data?.message || 'Update completed successfully!.');
                handleClose();
                setUpdateModalVisible(false);
            }
        } catch (error) {
            message.error(
                error?.response?.data?.detail || error?.response?.data?.message || 'Some Error occurred!'
            );
        }
    };

    return (
        <Modal
            open={visible}
            title="File Viewer"
            onCancel={handleClose}
            footer={null}
            width={800}
            destroyOnClose={true}
        >
            {
            userData?.username===fileowner &&
            <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                <Button onClick={handleUpdate} style={{ backgroundColor: 'blue', color: 'white' }}>
                    Update
                </Button>
                <Button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
                    Delete
                </Button>
            </div>
            }
            {renderFileViewer()}
            <Modal
                open={updateModalVisible}
                title="Update Document"
                onCancel={handleUpdateCancel}
                footer={ [
                    <Button key="cancel" onClick={handleUpdateCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleUpdateSubmit}>
                        Update
                    </Button>,
                ]}
            >
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <Input.TextArea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <Upload
                    beforeUpload={(file) => {
                        setFile(file);
                        return false;
                    }}
                    showUploadList={false}
                >
                    <Button>Select File</Button>
                </Upload>
                {file && (
                    <p style={{ marginTop: '10px', marginBottom: '0' }}>
                        Selected File: {file.name}
                    </p>
                )}
            </Modal>
        </Modal>
    );
};

export default FileViewModal;
