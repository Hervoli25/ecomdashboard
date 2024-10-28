import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'; // Import Dialog components from Shadcn UI

interface CustomerFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: CustomerFormData) => void;
	initialData?: Partial<CustomerFormData>;
	mode: 'create' | 'edit';
}

export interface CustomerFormData {
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	password: string;
}

export function CustomerForm({
	open,
	onClose,
	onSubmit,
	initialData,
	mode,
}: CustomerFormProps) {
	const [formData, setFormData] = useState<CustomerFormData>({
		first_name: initialData?.first_name || '',
		last_name: initialData?.last_name || '',
		email: initialData?.email || '',
		phone_number: initialData?.phone_number || '',
		password: initialData?.password || '',
	});
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSubmit(formData);
			onClose();
		} catch (error) {
			console.error('Failed to save customer:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[400px]'>
				<DialogHeader>
					<DialogTitle>
						{mode === 'create' ? 'Add New Customer' : 'Edit Customer'}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='text-sm font-medium'>First Name</label>
						<Input
							value={formData.first_name}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, first_name: e.target.value }))
							}
							placeholder='Enter first name'
							required
						/>
					</div>

					<div>
						<label className='text-sm font-medium'>Last Name</label>
						<Input
							value={formData.last_name}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, last_name: e.target.value }))
							}
							placeholder='Enter last name'
							required
						/>
					</div>

					<div>
						<label className='text-sm font-medium'>Email</label>
						<Input
							type='email'
							value={formData.email}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, email: e.target.value }))
							}
							placeholder='Enter email'
							required
						/>
					</div>

					<div>
						<label className='text-sm font-medium'>Phone Number</label>
						<Input
							type='tel'
							value={formData.phone_number}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									phone_number: e.target.value,
								}))
							}
							placeholder='Enter phone number'
						/>
					</div>

					<div>
						<label className='text-sm font-medium'>Password</label>
						<div className='relative'>
							<Input
								type={passwordVisible ? 'text' : 'password'}
								value={formData.password}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, password: e.target.value }))
								}
								placeholder='Enter password'
								required
							/>
							<button
								type='button'
								onClick={() => setPasswordVisible(!passwordVisible)}
								className='absolute inset-y-0 right-0 px-2 flex items-center text-gray-600'
								aria-label={passwordVisible ? 'Hide password' : 'Show password'}
							>
								{passwordVisible ? (
									<EyeOff className='h-5 w-5' />
								) : (
									<Eye className='h-5 w-5' />
								)}
							</button>
						</div>
					</div>

					<div className='flex justify-end space-x-4'>
						<Button type='button' variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button type='submit' disabled={loading}>
							{loading
								? 'Saving...'
								: mode === 'create'
								? 'Create Customer'
								: 'Update Customer'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
