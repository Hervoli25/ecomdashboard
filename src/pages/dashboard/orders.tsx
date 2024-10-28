// src/pages/dashboard/orders.tsx
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ShoppingCart, DollarSign, Package } from 'lucide-react';

interface Order {
	order_id: number;
	total_amount: string;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
	created_at: string;
	customer_email: string;
	items_count: number;
}

export default function Orders() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [statusFilter, setStatusFilter] = useState('all');

	useEffect(() => {
		fetchOrders();
	}, [currentPage, statusFilter]);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const res = await fetch(
				`/api/dashboard/orders?page=${currentPage}&limit=10${
					statusFilter !== 'all' ? `&status=${statusFilter}` : ''
				}`
			);
			const data = await res.json();

			if (data.success) {
				setOrders(data.data.orders);
				setTotalPages(data.data.totalPages);
			}
		} catch (error) {
			console.error('Failed to fetch orders:', error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status: Order['status']) => {
		const colors = {
			pending: 'bg-yellow-100 text-yellow-800',
			processing: 'bg-blue-100 text-blue-800',
			shipped: 'bg-purple-100 text-purple-800',
			delivered: 'bg-green-100 text-green-800',
			cancelled: 'bg-red-100 text-red-800',
		};
		return colors[status];
	};

	const getPaymentStatusColor = (status: Order['payment_status']) => {
		const colors = {
			pending: 'bg-yellow-100 text-yellow-800',
			paid: 'bg-green-100 text-green-800',
			failed: 'bg-red-100 text-red-800',
			refunded: 'bg-gray-100 text-gray-800',
		};
		return colors[status];
	};

	return (
		<DashboardLayout>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>Orders</h1>
				</div>

				{/* Stats Cards */}
				<div className='grid gap-4 md:grid-cols-3'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Orders
							</CardTitle>
							<ShoppingCart className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{orders.length}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Revenue
							</CardTitle>
							<DollarSign className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								$
								{orders
									.reduce(
										(sum, order) => sum + parseFloat(order.total_amount),
										0
									)
									.toFixed(2)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Pending Orders
							</CardTitle>
							<Package className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{orders.filter((order) => order.status === 'pending').length}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Orders Table */}
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle>Orders List</CardTitle>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Filter by status' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All Status</SelectItem>
									<SelectItem value='pending'>Pending</SelectItem>
									<SelectItem value='processing'>Processing</SelectItem>
									<SelectItem value='shipped'>Shipped</SelectItem>
									<SelectItem value='delivered'>Delivered</SelectItem>
									<SelectItem value='cancelled'>Cancelled</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className='flex justify-center py-8'>Loading...</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Order ID</TableHead>
										<TableHead>Customer</TableHead>
										<TableHead>Items</TableHead>
										<TableHead>Total</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Payment</TableHead>
										<TableHead className='text-right'>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orders.map((order) => (
										<TableRow key={order.order_id}>
											<TableCell>#{order.order_id}</TableCell>
											<TableCell>{order.customer_email}</TableCell>
											<TableCell>{order.items_count}</TableCell>
											<TableCell>${order.total_amount}</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
														order.status
													)}`}
												>
													{order.status}
												</span>
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusColor(
														order.payment_status
													)}`}
												>
													{order.payment_status}
												</span>
											</TableCell>
											<TableCell className='text-right'>
												<Button variant='ghost' size='sm'>
													View Details
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<div className='flex justify-center space-x-2 mt-4'>
								<Button
									variant='outline'
									size='sm'
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={currentPage === 1}
								>
									Previous
								</Button>
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										setCurrentPage((p) => Math.min(totalPages, p + 1))
									}
									disabled={currentPage === totalPages}
								>
									Next
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	);
}
