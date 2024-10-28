// src/pages/index.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
	const [status, setStatus] = useState<string>('');
	const [data, setData] = useState<any[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	const testConnection = async () => {
		try {
			setStatus('Testing connection...');
			setError(null);

			const response = await fetch('/api/test-connection');
			const result = await response.json();

			if (result.success) {
				setStatus('Connection successful!');
				setData(result.data);
			} else {
				throw new Error(result.message);
			}
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'Failed to test connection'
			);
			setStatus('Connection failed');
		}
	};

	return (
		<main className='min-h-screen p-8'>
			<Card>
				<CardHeader>
					<CardTitle>Database Connection Test</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<Button onClick={testConnection}>Test Database Connection</Button>

						{status && (
							<p
								className={`mt-4 ${error ? 'text-red-500' : 'text-green-500'}`}
							>
								Status: {status}
							</p>
						)}

						{error && <p className='text-red-500'>Error: {error}</p>}

						{data && (
							<div className='mt-4'>
								<h3 className='font-medium mb-2'>Sample Products:</h3>
								<pre className='bg-gray-100 p-4 rounded'>
									{JSON.stringify(data, null, 2)}
								</pre>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* "Go to API Tests" Button */}
			<div className='mt-8'>
				<Link href='/api-test' passHref>
					<Button variant='outline'>Go to API Tests</Button>
				</Link>
			</div>
		</main>
	);
}
