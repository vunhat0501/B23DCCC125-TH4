import React from "react";
import { Table, Tag, Button, Input } from "antd";

const { Search } = Input;

interface Applicant {
    id: string;
    name: string;
    email: string;
    department: 'Design' | 'Dev' | 'Media';
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected'; 
}

interface Props {
    data: Applicant[];
    onApprove: (record: Applicant) => void;
    onReject: (record: Applicant) => void;
    onNote: (record: Applicant) => void;
    onSearch: (value: string) => void;
}

const statusColors = {
    Pending: 'gold',
    Approved: 'green',
    Rejected: 'red'
}

const ApplicantTable: React.FC<Props> = ({
    data,
    onApprove,
    onReject,
    onNote,
    onSearch,
}) => {
    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            sorter: (a: Applicant, b: Applicant) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Nguyện vọng',
            dataIndex: 'department',
            filters: [
                { text: 'Design', value: 'Design' },
                { text: 'Dev', value: 'Dev' },
                { text: 'Media', value: 'Media' },
            ],
            onFilter: (value: string | number | boolean, record: Applicant) => record.department === value,
        },
        {
            title: 'Lý do đăng ký',
            dataIndex: 'reason',
            responsive: ['md'], // ẩn cột này trên màn hình nhỏ
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status: string) => (
                <Tag color={statusColors[status as keyof typeof statusColors]}>{status}</Tag>
            ),
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'Approved', value: 'Approved' },
                { text: 'Rejected', value: 'Rejected' },
            ],
            onFilter: (value: string | number | boolean, record: Applicant) => record.status === value,
        },
        {
            title: 'Actions',
            render: (_: any, record: Applicant) => (
                <>
                    <Button type="link" onClick={() => onApprove(record)}>Duyệt</Button>
                    <Button type="link" danger onClick={() => onReject(record)}>Từ chối</Button>
                    {record.status === 'Rejected' && (
                        <Button type="link" onClick={() => onNote(record)}>Ghi chú</Button>
                    )}
                </>
            ),
        },
    ];

    return (
        <>
            <Search
                placeholder="Tìm kiếm theo tên, email..."
                onSearch={onSearch}
                enterButton
                style={{ width: 400, marginBottom: 16 }}
            />
            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }}
            />
        </>
    );
};

export default ApplicantTable;
