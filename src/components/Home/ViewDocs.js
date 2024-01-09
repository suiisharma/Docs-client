import React, { useContext, useState, useEffect } from 'react';
import { Table, Modal, message, Input, Button } from 'antd';
import FileViewModal from '../utils/FileViewModal';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import {ShareAltOutlined,SearchOutlined} from '@ant-design/icons';

const ViewDocs = () => {
    const { token } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [refreshDocs, setRefreshDocs] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    
    useEffect(() => {
        const fetchAllDocs = async () => {
            try {
                const response = await axios.get('https://docsbackend-cvv1.onrender.com/documents/', {
                    headers: {
                        Authorization: `token ${token}`
                    }
                });
                if (response && response.data) {
                    setDocuments(response.data.Documents);
                    setFilteredDocuments(response.data.Documents);
                }
            } catch (error) {
                message.error(error?.response?.data?.detail || error?.response?.data?.message || "Some Error occurred!");
            }
        };

        fetchAllDocs();
    }, [token, refreshDocs]);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Uploaded By',
            dataIndex: 'uploaded_by',
            key: 'uploaded_by',
        },
        {
            title: 'File Size',
            dataIndex: 'file_size',
            key: 'file_size',
        },
        {
            title: 'File Type',
            dataIndex: 'file_type',
            key: 'file_type',
        },
        {
            title: 'Share',
            key: 'share',
            render: (_, record) => (
                <Button icon={<ShareAltOutlined />} onClick={(e) => {e.stopPropagation();handleCopyToClipboard(record.id)}} />
            ),
        },
    ];

    const handleCopyToClipboard = (id) => {
        navigator.clipboard.writeText(id.toString());
        message.success('Document ID copied to clipboard!');
    };

    const handleSearchById = async () => {
        if (searchValue.trim() === '') {
            setFilteredDocuments(documents);
        } else {
            // Assuming API call to search by ID and update the state with filtered documents
            try {
                const response = await axios.get(`https://docsbackend-cvv1.onrender.com/document/${searchValue}`, {
                    headers: {
                        Authorization: `token ${token}`
                    }
                });
                if (response && response.data && response.data.document) {
                    setFilteredDocuments([response.data.document]);
                } else {
                    setFilteredDocuments([]);
                    message.warning('No document found with this ID.');
                }
            } catch (error) {
                setFilteredDocuments([]);
                message.error('Error occurred while searching for the document.');
            }
        }
    };

    const handleRowClick = (record) => {
        setSelectedDoc(record);
        setModalVisible(true);
    };

    const modalConfig = {
        visible: modalVisible,
        title: 'Document Details',
        onCancel: () => setModalVisible(false),
        footer: null,
    };

    useEffect(() => {
        const fetchData = async () => {
            if (searchValue) {
                try {
                    const response = await axios.get(`https://docsbackend-cvv1.onrender.com/document/${searchValue}`, {
                        headers: {
                            Authorization: `token ${token}`
                        }
                    });
                    if (response && response.data && response.data.document) {
                        setSelectedDoc(response.data.document);
                        setModalVisible(true);
                    } else {
                        message.error('Document not found!');
                    }
                } catch (error) {
                    message.error(error?.response?.data?.detail || error?.response?.data?.message || "Some Error occurred!");
                }
            }
        };
        fetchData();
    }, [searchValue, token]);

    return (
        <>
            <Input.Search
                placeholder="Search by ID"
                value={searchValue}
                onChange={(e) =>{ setSearchValue(e.target.value);
                }}
                onSearch={handleSearchById}
                enterButton={<SearchOutlined />} // Displaying search icon
                style={{ width: 200, marginBottom: 16 }}
            />

            <Table
                dataSource={filteredDocuments}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                    onClick: (event) => handleRowClick(record),
                })}
            />

            {modalVisible && (
                <Modal {...modalConfig}>
                    {selectedDoc && (
                        <FileViewModal
                            fileowner={selectedDoc.uploaded_by}
                            visible={modalVisible}
                            fileUrl={selectedDoc.file_url}
                            fileType={selectedDoc.file_type}
                            onClose={() => setModalVisible(false)}
                            docId={selectedDoc.id}
                            setRefreshDocs={setRefreshDocs}
                            refreshDocs={refreshDocs}
                        />
                    )}
                </Modal>
            )}
        </>
    );
};

export default ViewDocs;
