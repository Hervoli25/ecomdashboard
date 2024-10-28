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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Mail, DollarSign } from 'lucide-react';
import {
	CustomerForm,
	CustomerFormData,
} from '@/components/customers/CustomerForm';

interface Customer {
	user_id: number;
	email: string;
	first_name: string;
	last_name: string;
	total_orders: number;
	total_spent: string;
	last_order_date: string;
	is_verified: boolean;
	created_at: string;
}

export default function Customers() {
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
		null
	);
	const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

	useEffect(() => {
		fetchCustomers();
	}, [currentPage, searchTerm]);

	const fetchCustomers = async () => {
		try {
			setLoading(true);
			const res = await fetch(
				`/api/dashboard/customers?page=${currentPage}&limit=10&search=${searchTerm}`
			);
			const data = await res.json();

			if (data.success) {
				setCustomers(data.data.customers);
				setTotalPages(data.data.totalPages);
			}
		} catch (error) {
			console.error('Failed to fetch customers:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddCustomer = () => {
		setSelectedCustomer(null);
		setFormMode('create');
		setIsFormOpen(true);
	};

	const handleFormSubmit = async (data: CustomerFormData) => {
		try {
			const response = await fetch('/api/dashboard/customers', {
				method: formMode === 'create' ? 'POST' : 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Failed to save customer');
			}

			// Refresh customers list
			fetchCustomers();
			setIsFormOpen(false);
		} catch (error) {
			console.error('Error saving customer:', error);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	return (
		<DashboardLayout>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>Customers</h1>
					<Button onClick={handleAddCustomer}>
						<UserPlus className='mr-2 h-4 w-4' />
						Add Customer
					</Button>
				</div>

				{/* Stats Cards */}
				<div className='grid gap-4 md:grid-cols-3'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Customers
							</CardTitle>
							<Users className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{customers.length}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Verified Users
							</CardTitle>
							<Mail className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{customers.filter((c) => c.is_verified).length}
							</div>
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
								{customers
									.reduce(
										(sum, customer) =>
											sum + parseFloat(customer.total_spent || '0'),
										0
									)
									.toFixed(2)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Customers Table */}
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle>Customers List</CardTitle>
							<div className='flex w-full max-w-sm items-center space-x-2'>
								<Input
									placeholder='Search customers...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-[300px]'
								/>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className='flex justify-center py-8'>Loading...</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Orders</TableHead>
										<TableHead>Total Spent</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Joined</TableHead>
										<TableHead className='text-right'>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{customers.map((customer) => (
										<TableRow key={customer.user_id}>
											<TableCell className='font-medium'>
												{customer.first_name} {customer.last_name}
											</TableCell>
											<TableCell>{customer.email}</TableCell>
											<TableCell>{customer.total_orders}</TableCell>
											<TableCell>
												${parseFloat(customer.total_spent || '0').toFixed(2)}
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
														customer.is_verified
															? 'bg-green-100 text-green-700'
															: 'bg-yellow-100 text-yellow-700'
													}`}
												>
													{customer.is_verified ? 'Verified' : 'Pending'}
												</span>
											</TableCell>
											<TableCell>{formatDate(customer.created_at)}</TableCell>
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

				{/* Add/Edit Customer Form Modal */}
				<CustomerForm
					open={isFormOpen}
					onClose={() => setIsFormOpen(false)}
					onSubmit={handleFormSubmit}
					initialData={selectedCustomer || undefined}
					mode={formMode}
				/>
			</div>
		</DashboardLayout>
	);
}
