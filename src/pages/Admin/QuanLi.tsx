import React, { useEffect, useState } from "react";
import { Table, Select, Button, message } from "antd";
import * as XLSX from "xlsx"; // Import thư viện XLSX

const { Option } = Select;

interface Member {
  id: number;
  name: string;
  email: string;
  department: string;
  reason: string;
  status: string;
  rejectionNote?: string;
  logs: string[];
}

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedData = localStorage.getItem("members");
    if (storedData) {
      const parsedData = JSON.parse(storedData).filter(
        (member: Member) => member.status === "Approved"
      );
      setMembers(parsedData);
    } else {
     
      const sampleData: Member[] = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          department: "dev",
          reason: "Thích lập trình",
          status: "Approved",
          logs: ["Admin đã Approved vào lúc 17h 09/04/2025"],
        },
        {
          id: 2,
          name: "Trần Thị B",
          email: "tranthib@example.com",
          department: "design",
          reason: "Yêu thích thiết kế",
          status: "Approved",
          logs: ["Admin đã Approved vào lúc 17h 09/04/2025"],
        },
      ];
      localStorage.setItem("members", JSON.stringify(sampleData));
      setMembers(sampleData);
      message.info("Dữ liệu mẫu đã được thêm vào localStorage.");
    }
  }, []);

  const handleGroupChange = (id: number, newGroup: string) => {
    const updatedMembers = members.map((member) =>
      member.id === id ? { ...member, department: newGroup } : member
    );
    setMembers(updatedMembers);
    localStorage.setItem("members", JSON.stringify(updatedMembers));
    message.success("Cập nhật nhóm thành công!");
  };

  const handleExport = () => {
    // Chuyển đổi dữ liệu thành định dạng phù hợp cho file Excel
    const dataToExport = members.map((member) => ({
      "Họ tên": member.name,
      Email: member.email,
      "Vai trò": member.reason,
      "Nhóm": member.department,
    }));

    // Tạo workbook và worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    // Xuất file Excel
    XLSX.writeFile(workbook, "DanhSachThanhVien.xlsx");
    message.success("Xuất file thành công!");
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Nhóm",
      dataIndex: "department",
      key: "department",
      render: (text: string, record: Member) => (
        <Select
          defaultValue={text}
          style={{ width: 150 }}
          onChange={(value) => handleGroupChange(record.id, value)}
        >
          <Option value="design">Team Design</Option>
          <Option value="dev">Team Dev</Option>
          <Option value="media">Team Media</Option>
        </Select>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý thành viên</h1>
      <Button type="primary" onClick={handleExport} style={{ marginBottom: "20px" }}>
        Xuất danh sách ra Excel
      </Button>
      <Table
        dataSource={members}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default MemberManagement;