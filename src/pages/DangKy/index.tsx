import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Form, message, Row, Col } from 'antd';

interface Application {
  id: number;
  name: string;
  email: string;
  department: string;
  reason: string;
  status: 'Pending';
}

const ApplicationManager: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [form] = Form.useForm<Omit<Application, 'id' | 'status'>>();

  useEffect(() => {
    const savedApps = localStorage.getItem('applications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }
  }, []);

  const handleSubmit = (values: Omit<Application, 'id' | 'status'>) => {
    const savedApps = localStorage.getItem('applications');
    const currentApps: Application[] = savedApps ? JSON.parse(savedApps) : [];

    const emailExists = currentApps.some(app => app.email === values.email);
    if (emailExists) {
      message.error('Email này đã được đăng ký!');
      return;
    }

    const newApp: Application = {
      id: Date.now(),
      ...values,
      status: 'Pending'
    };

    const updatedApps = [...currentApps, newApp];
    setApplications(updatedApps);
    localStorage.setItem('applications', JSON.stringify(updatedApps));

    message.success('Đăng ký thành công!');
    form.resetFields();
  };

  return (
    <Row justify="center" style={{ padding: 16 }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}> 
            <Input type="email" />
          </Form.Item>
          <Form.Item name="department" label="Nguyện vọng" rules={[{ required: true, message: 'Chọn nguyện vọng' }]}> 
            <Select>
              <Select.Option value="design">Design</Select.Option>
              <Select.Option value="dev">Dev</Select.Option>
              <Select.Option value="media">Media</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="reason" label="Lý do đăng ký" rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}> 
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Gửi đăng ký</Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ApplicationManager;