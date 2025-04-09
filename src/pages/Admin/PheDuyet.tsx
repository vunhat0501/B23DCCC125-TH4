import React, { useEffect, useState } from 'react';
import { Row, Col, Typography } from 'antd';
import ApplicantTable from '@/pages/Admin/components/ApplicantTable';
import { Modal, message } from 'antd';

const { Title } = Typography;

interface Applicant {
    id: number;
    name: string;
    email: string;
    department: 'design' | 'dev' | 'media';
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    rejectionNote?: string;
    logs?: string[];
}

const ApplicationsPage: React.FC = () => {
    const [data, setData] = useState<Applicant[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    // Lấy dữ liệu từ localStorage
    useEffect(() => {
        const stored = localStorage.getItem('applications');
        if (stored) {
            setData(JSON.parse(stored));
        }
    }, []);

    // Cập nhật lại localStorage mỗi khi data thay đổi
    useEffect(() => {
        localStorage.setItem('applications', JSON.stringify(data));
    }, [data]);

    const handleApprove = (record: Applicant) => {
        Modal.confirm({
            title: `Duyệt ứng viên ${record.name}?`,
            onOk: () => {
                const newData = data.map((item) =>
                    item.id === record.id ? { ...item, status: 'Approved' } : item
                );
                setData(newData);
                message.success('Đã duyệt!');
            },
        });
    };

    const handleReject = (record: Applicant) => {
        Modal.confirm({
            title: `Từ chối ứng viên ${record.name}?`,
            onOk: () => {
                const newData = data.map((item) =>
                    item.id === record.id ? { ...item, status: 'Rejected' } : item
                );
                setData(newData);
                message.warning('Đã từ chối!');
            },
        });
    };

    const handleNote = (record: Applicant) => {
        let note = '';
        Modal.confirm({
            title: `Ghi chú lý do từ chối - ${record.name}`,
            content: (
                <textarea
                    onChange={(e) => (note = e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    style={{ width: '100%', minHeight: 80 }}
                />
            ),
            onOk: () => {
                const now = new Date().toLocaleString();
                const newData = data.map((item) =>
                    item.id === record.id
                        ? {
                            ...item,
                            rejectionNote: note,
                            logs: [
                                ...(item.logs || []),
                                `Admin đã Rejected vào lúc ${now} với lý do: ${note}`,
                            ],
                        }
                        : item
                );
                setData(newData);
                message.info('Đã lưu ghi chú!');
            },
        });
    };

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
    };

    const filteredData = data.filter(
        (item) =>
            item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.department.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    return (
        <div style={{ padding: 16 }}>
            <Row justify="center">
                <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                    <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                        Quản lý đơn đăng ký câu lạc bộ
                    </Title>
                    <div style={{ overflowX: 'auto' }}>
                        <ApplicantTable
                            data={filteredData}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onNote={handleNote}
                            onSearch={handleSearch}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ApplicationsPage;
