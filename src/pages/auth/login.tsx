// src/pages/auth/login.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/router';

export default function Login() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (data.success) {
				router.push('/dashboard');
			} else {
				setError(data.error || 'Authentication failed');
			}
		} catch (error) {
			setError('Failed to login');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<Card className='w-[400px]'>
				<CardHeader>
					<CardTitle>Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								value={formData.email}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										email: e.target.value,
									}))
								}
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								value={formData.password}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										password: e.target.value,
									}))
								}
								required
							/>
						</div>

						{error && <div className='text-red-500 text-sm'>{error}</div>}

						<Button type='submit' className='w-full' disabled={loading}>
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
