import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

interface AnalyticsData {
	metrics: {
		total_revenue: number;
		total_orders: number;
		unique_customers: number;
		average_order_value: number;
	};
	dailyRevenue: Array<{
		date: string;
		revenue: number;
		orders: number;
	}>;
	topProducts: Array<{
		product_name: string;
		units_sold: number;
		revenue: number;
	}>;
	categoryStats: Array<{
		category_name: string;
		orders_count: number;
		revenue: number;
	}>;
	orderStatusStats: Array<{
		status: string;
		count: number;
	}>;
}

export default function Analytics() {
	const [timeframe, setTimeframe] = useState('30');
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAnalytics();
	}, [timeframe]);

	const fetchAnalytics = async () => {
		try {
			setLoading(true);
			const res = await fetch(
				`/api/dashboard/analytics?timeframe=${timeframe}`
			);
			const data = await res.json();

			if (data.success) {
				setAnalyticsData(data.data);
			}
		} catch (error) {
			console.error('Failed to fetch analytics:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<DashboardLayout>
				<div className='flex items-center justify-center h-96'>
					Loading analytics...
				</div>
			</DashboardLayout>
		);
	}

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

	return (
		<DashboardLayout>
			<div className='space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>Analytics</h1>
					<Select value={timeframe} onValueChange={setTimeframe}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Select timeframe' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='7'>Last 7 days</SelectItem>
							<SelectItem value='30'>Last 30 days</SelectItem>
							<SelectItem value='90'>Last 90 days</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Key Metrics */}
				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Revenue
							</CardTitle>
							<DollarSign className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								${analyticsData?.metrics.total_revenue.toFixed(2)}
							</div>
							<p className='text-xs text-muted-foreground'>
								+20.1% from last period
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Orders</CardTitle>
							<ShoppingBag className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{analyticsData?.metrics.total_orders}
							</div>
							<p className='text-xs text-muted-foreground'>
								+15% from last period
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Customers</CardTitle>
							<Users className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{analyticsData?.metrics.unique_customers}
							</div>
							<p className='text-xs text-muted-foreground'>
								+8% from last period
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Avg. Order Value
							</CardTitle>
							<TrendingUp className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								${analyticsData?.metrics.average_order_value.toFixed(2)}
							</div>
							<p className='text-xs text-muted-foreground'>
								+12% from last period
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Revenue Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Revenue Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='h-[400px]'>
							<ResponsiveContainer width='100%' height='100%'>
								<LineChart data={analyticsData?.dailyRevenue}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='date' />
									<YAxis yAxisId='left' />
									<YAxis yAxisId='right' orientation='right' />
									<Tooltip />
									<Legend />
									<Line
										yAxisId='left'
										type='monotone'
										dataKey='revenue'
										stroke='#8884d8'
										name='Revenue ($)'
									/>
									<Line
										yAxisId='right'
										type='monotone'
										dataKey='orders'
										stroke='#82ca9d'
										name='Orders'
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Product and Category Analysis */}
				<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
					{/* Top Products */}
					<Card>
						<CardHeader>
							<CardTitle>Top Products</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='h-[300px]'>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart data={analyticsData?.topProducts}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='product_name' />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar
											dataKey='units_sold'
											fill='#8884d8'
											name='Units Sold'
										/>
										<Bar dataKey='revenue' fill='#82ca9d' name='Revenue ($)' />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>

					{/* Order Status Distribution */}
					<Card>
						<CardHeader>
							<CardTitle>Order Status Distribution</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='h-[300px]'>
								<ResponsiveContainer width='100%' height='100%'>
									<PieChart>
										<Pie
											data={analyticsData?.orderStatusStats}
											dataKey='count'
											nameKey='status'
											cx='50%'
											cy='50%'
											outerRadius={100}
											label
										>
											{analyticsData?.orderStatusStats.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</DashboardLayout>
	);
}
