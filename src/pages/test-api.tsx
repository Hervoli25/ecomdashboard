// src/pages/test-api.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TestAPI() {
	const [stats, setStats] = useState<any>(null);
	const [products, setProducts] = useState<any>(null);
	const [orders, setOrders] = useState<any>(null);
	const [analytics, setAnalytics] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchStats = async () => {
		try {
			setLoading(true);
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
		<div className='p-8'>
			<Card>
				<CardHeader>
					<CardTitle>API Tests</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-6'>
						{/* Test Buttons */}
						<div className='flex flex-wrap gap-4'>
							<Button onClick={fetchStats} disabled={loading}>
								Test Stats API
							</Button>
							<Button onClick={fetchProducts} disabled={loading}>
								Test Products API
							</Button>
							<Button onClick={fetchOrders} disabled={loading}>
								Test Orders API
							</Button>
							<Button onClick={fetchAnalytics} disabled={loading}>
								Test Analytics API
							</Button>
						</div>

						{/* Loading and Error States */}
						{loading && <p className='text-blue-500'>Loading...</p>}
						{error && <p className='text-red-500'>{error}</p>}

						{/* Results Display */}
						{stats && (
							<Card>
								<CardHeader>
									<CardTitle>Dashboard Stats</CardTitle>
								</CardHeader>
								<CardContent>
									<pre className='bg-gray-100 p-4 rounded overflow-auto'>
										{JSON.stringify(stats, null, 2)}
									</pre>
								</CardContent>
							</Card>
						)}

						{products && (
							<Card>
								<CardHeader>
									<CardTitle>Products</CardTitle>
								</CardHeader>
								<CardContent>
									<pre className='bg-gray-100 p-4 rounded overflow-auto'>
										{JSON.stringify(products, null, 2)}
									</pre>
								</CardContent>
							</Card>
						)}

						{orders && (
							<Card>
								<CardHeader>
									<CardTitle>Orders</CardTitle>
								</CardHeader>
								<CardContent>
									<pre className='bg-gray-100 p-4 rounded overflow-auto'>
										{JSON.stringify(orders, null, 2)}
									</pre>
								</CardContent>
							</Card>
						)}

						{analytics && (
							<Card>
								<CardHeader>
									<CardTitle>Analytics</CardTitle>
								</CardHeader>
								<CardContent>
									<pre className='bg-gray-100 p-4 rounded overflow-auto'>
										{JSON.stringify(analytics, null, 2)}
									</pre>
								</CardContent>
							</Card>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
