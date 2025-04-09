import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table } from 'antd';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from 'recharts';
const departments = [
	{ value: 'design', label: 'Design' },
	{ value: 'dev', label: 'Development' },
	{ value: 'media', label: 'Media' },
];

interface Application {
	status: string;
	department: string;
	team?: string;
	createdAt: string;
}

interface StatusPercentage {
	name: string;
	value: number;
}

interface PieChartData {
	name: string;
	value: number;
}

interface MonthlyStat {
	name: string;
	total: number;
	approved: number;
	rejected: number;
	pending: number;
}

interface DepartmentBreakdown {
	department: string;
	total: number;
	approved: number;
	rejected: number;
	pending: number;
}

interface DashboardStatistics {
	totalApplications: number;
	pending: number;
	approved: number;
	rejected: number;
	departmentStats: PieChartData[];
	teamStats: PieChartData[];
	monthlyStats: MonthlyStat[];
	statusPercentages: StatusPercentage[];
	departmentStatusBreakdown: DepartmentBreakdown[];
}

const Dashboard: React.FC = () => {
	const [statistics, setStatistics] = useState<DashboardStatistics>({
		totalApplications: 0,
		pending: 0,
		approved: 0,
		rejected: 0,
		departmentStats: [],
		teamStats: [],
		monthlyStats: [],
		statusPercentages: [],
		departmentStatusBreakdown: [],
	});

	useEffect(() => {
		calculateStatistics();
	}, []);

	const calculateStatistics = () => {
		const applications: Application[] = JSON.parse(localStorage.getItem('applications') || '[]');

		const statusStats: Record<string, number> = applications.reduce((acc, app) => {
			const status = app.status.toLowerCase();
			acc[status] = (acc[status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const total = applications.length;
		const statusPercentages: StatusPercentage[] = Object.entries(statusStats).map(([status, count]) => ({
			name: status.charAt(0).toUpperCase() + status.slice(1),
			value: total ? Math.round((count / total) * 100) : 0,
		}));

		const deptStats: Record<string, number> = applications.reduce((acc, app) => {
			acc[app.department] = (acc[app.department] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const teamStats: Record<string, number> = applications
			.filter((app) => app.status === 'Approved')
			.reduce((acc, app) => {
				const team = app.team || 'Unassigned';
				acc[team] = (acc[team] || 0) + 1;
				return acc;
			}, {} as Record<string, number>);

		const monthlyStatsObj: Record<string, MonthlyStat> = applications.reduce((acc, app) => {
			const month = new Date(app.createdAt).toLocaleString('default', { month: 'long' });
			if (!acc[month]) {
				acc[month] = { name: month, total: 0, approved: 0, rejected: 0, pending: 0 };
			}
			acc[month].total += 1;
			(acc[month][app.status.toLowerCase() as keyof MonthlyStat] as number) += 1;
			return acc;
		}, {} as Record<string, MonthlyStat>);

		const departmentStatusBreakdown: DepartmentBreakdown[] = departments.map(
			(dept: { value: string; label: string }) => {
				const deptApps = applications.filter((app) => app.department === dept.value);
				return {
					department: dept.label,
					total: deptApps.length,
					approved: deptApps.filter((app) => app.status === 'Approved').length,
					rejected: deptApps.filter((app) => app.status === 'Rejected').length,
					pending: deptApps.filter((app) => app.status === 'Pending').length,
				};
			},
		);

		setStatistics({
			totalApplications: total,
			pending: statusStats.pending || 0,
			approved: statusStats.approved || 0,
			rejected: statusStats.rejected || 0,
			departmentStats: Object.entries(deptStats).map(([name, value]) => ({
				name: departments.find((d: { value: string; label: string }) => d.value === name)?.label || name,
				value,
			})),
			teamStats: Object.entries(teamStats).map(([name, value]) => ({
				name: name.charAt(0).toUpperCase() + name.slice(1),
				value,
			})),
			monthlyStats: Object.values(monthlyStatsObj),
			statusPercentages,
			departmentStatusBreakdown,
		});
	};

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

	const departmentColumns = [
		{ title: 'Department', dataIndex: 'department', key: 'department' },
		{ title: 'Total', dataIndex: 'total', key: 'total' },
		{ title: 'Approved', dataIndex: 'approved', key: 'approved' },
		{ title: 'Rejected', dataIndex: 'rejected', key: 'rejected' },
		{ title: 'Pending', dataIndex: 'pending', key: 'pending' },
	];

	return (
		<div>
			<h2>Dashboard</h2>

			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Total Applications' value={statistics.totalApplications} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic
							title='Pending'
							value={statistics.pending}
							suffix={`(${
								statistics.totalApplications ? Math.round((statistics.pending / statistics.totalApplications) * 100) : 0
							}%)`}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic
							title='Approved'
							value={statistics.approved}
							suffix={`(${
								statistics.totalApplications
									? Math.round((statistics.approved / statistics.totalApplications) * 100)
									: 0
							}%)`}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic
							title='Rejected'
							value={statistics.rejected}
							suffix={`(${
								statistics.totalApplications
									? Math.round((statistics.rejected / statistics.totalApplications) * 100)
									: 0
							}%)`}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
				<Col xs={24} md={12}>
					<Card title='Applications by Department'>
						<ResponsiveContainer width='100%' height={300}>
							<PieChart>
								<Pie
									data={statistics.departmentStats}
									cx='50%'
									cy='50%'
									labelLine={false}
									outerRadius={80}
									fill='#8884d8'
									dataKey='value'
									label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}
								>
									{statistics.departmentStats.map((_, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</Card>
				</Col>

				<Col xs={24} md={12}>
					<Card title='Application Status Distribution'>
						<ResponsiveContainer width='100%' height={300}>
							<PieChart>
								<Pie
									data={statistics.statusPercentages}
									cx='50%'
									cy='50%'
									labelLine={false}
									outerRadius={80}
									fill='#8884d8'
									dataKey='value'
									label={({ name, value }: { name: string; value: number }) => `${name}: ${value}%`}
								>
									{statistics.statusPercentages.map((_, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
				<Col xs={24}>
					<Card title='Monthly Application Trends'>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={statistics.monthlyStats}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey='approved' fill='#00C49F' name='Approved' />
								<Bar dataKey='rejected' fill='#FF8042' name='Rejected' />
								<Bar dataKey='pending' fill='#FFBB28' name='Pending' />
							</BarChart>
						</ResponsiveContainer>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
				<Col xs={24}>
					<Card title='Department-wise Application Status'>
						<Table
							dataSource={statistics.departmentStatusBreakdown}
							columns={departmentColumns}
							pagination={false}
							scroll={{ x: true }}
							rowKey='department'
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
