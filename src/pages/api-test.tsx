// src/pages/api-test.tsx (new file)
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function APITest() {
	const [stats, setStats] = useState<any>(null);
	const [products, setProducts] = useState<any>(null);
	const [orders, setOrders] = useState<any>(null);
	const [analytics, setAnalytics] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchStats = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch('/api/dashboard/stats');
			const data = await res.json();
			setStats(data);
		} catch (err) {
			setError('Failed to fetch stats');
		} finally {
			setLoading(false);
		}
	};

	const fetchProducts = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch('/api/dashboard/products?page=1&limit=5');
			const data = await res.json();
			setProducts(data);
		} catch (err) {
			setError('Failed to fetch products');
		} finally {
			setLoading(false);
		}
	};

	const fetchOrders = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch('/api/dashboard/orders?page=1&limit=5');
			const data = await res.json();
			setOrders(data);
		} catch (err) {
			setError('Failed to fetch orders');
		} finally {
			setLoading(false);
		}
	};

	const fetchAnalytics = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch('/api/dashboard/analytics');
			const data = await res.json();
			setAnalytics(data);
		} catch (err) {
			setError('Failed to fetch analytics');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen p-8 bg-gray-50'>
			<Card className='max-w-5xl mx-auto'>
				<CardHeader>
					<CardTitle className='text-2xl'>Dashboard API Tests</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-6'>
						{/* Test Buttons */}
						<div className='flex flex-wrap gap-3'>
							<Button onClick={fetchStats} disabled={loading} variant='outline'>
								Test Stats
							</Button>
							<Button
								onClick={fetchProducts}
								disabled={loading}
								variant='outline'
							>
								Test Products
							</Button>
							<Button
								onClick={fetchOrders}
								disabled={loading}
								variant='outline'
							>
								Test Orders
							</Button>
							<Button
								onClick={fetchAnalytics}
								disabled={loading}
								variant='outline'
							>
								Test Analytics
							</Button>
						</div>

						{/* Loading and Error States */}
						{loading && (
							<div className='text-blue-500 font-medium'>Loading...</div>
						)}
						{error && (
							<div className='text-red-500 font-medium'>Error: {error}</div>
						)}

						{/* Results Display */}
						<div className='space-y-4'>
							{stats && (
								<Card>
									<CardHeader>
										<CardTitle className='text-lg'>Stats Results</CardTitle>
									</CardHeader>
									<CardContent>
										<pre className='bg-gray-100 p-4 rounded-lg overflow-auto max-h-96'>
											{JSON.stringify(stats, null, 2)}
										</pre>
									</CardContent>
								</Card>
							)}

							{products && (
								<Card>
									<CardHeader>
										<CardTitle className='text-lg'>Products Results</CardTitle>
									</CardHeader>
									<CardContent>
										<pre className='bg-gray-100 p-4 rounded-lg overflow-auto max-h-96'>
											{JSON.stringify(products, null, 2)}
										</pre>
									</CardContent>
								</Card>
							)}

							{orders && (
								<Card>
									<CardHeader>
										<CardTitle className='text-lg'>Orders Results</CardTitle>
									</CardHeader>
									<CardContent>
										<pre className='bg-gray-100 p-4 rounded-lg overflow-auto max-h-96'>
											{JSON.stringify(orders, null, 2)}
										</pre>
									</CardContent>
								</Card>
							)}

							{analytics && (
								<Card>
									<CardHeader>
										<CardTitle className='text-lg'>Analytics Results</CardTitle>
									</CardHeader>
									<CardContent>
										<pre className='bg-gray-100 p-4 rounded-lg overflow-auto max-h-96'>
											{JSON.stringify(analytics, null, 2)}
										</pre>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
