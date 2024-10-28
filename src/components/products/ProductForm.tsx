import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { X, Upload } from 'lucide-react';

interface ProductFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: ProductFormData) => void;
	initialData?: Partial<ProductFormData>;
	mode: 'create' | 'edit';
}

export interface ProductFormData {
	product_name: string;
	description: string;
	price: string;
	stock_quantity: string;
	category_id: string;
	images: string[];
	is_featured: boolean;
}

export function ProductForm({
	open,
	onClose,
	onSubmit,
	initialData,
	mode,
}: ProductFormProps) {
	const [formData, setFormData] = useState<ProductFormData>({
		product_name: initialData?.product_name || '',
		description: initialData?.description || '',
		price: initialData?.price || '',
		stock_quantity: initialData?.stock_quantity?.toString() || '',
		category_id: initialData?.category_id || '',
		images: initialData?.images || [],
		is_featured: initialData?.is_featured || false,
	});
	const [categories, setCategories] = useState<
		{ category_id: string; category_name: string }[]
	>([]);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [loading, setLoading] = useState(false);

	// Fetch categories from the backend when the component loads
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch('/api/dashboard/categories');
				const data = await res.json();
				if (data.success) {
					setCategories(data.data);
				} else {
					console.error('Failed to fetch categories');
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			} finally {
				setLoadingCategories(false);
			}
		};

		fetchCategories();
	}, []);

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);

		// TODO: Implement actual image upload to your storage service
		// This is a placeholder that creates temporary URLs
		const newImages = files.map((file) => URL.createObjectURL(file));
		setFormData((prev) => ({
			...prev,
			images: [...prev.images, ...newImages],
		}));
	};

	const removeImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSubmit(formData);
			onClose();
		} catch (error) {
			console.error('Failed to save product:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>
						{mode === 'create' ? 'Add New Product' : 'Edit Product'}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='col-span-2'>
							<label className='text-sm font-medium'>Product Name</label>
							<Input
								value={formData.product_name}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										product_name: e.target.value,
									}))
								}
								placeholder='Enter product name'
								required
							/>
						</div>

						<div className='col-span-2'>
							<label className='text-sm font-medium'>Category</label>
							<Select
								value={formData.category_id}
								onValueChange={(value) =>
									setFormData((prev) => ({
										...prev,
										category_id: value,
									}))
								}
								disabled={loadingCategories}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select category' />
								</SelectTrigger>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem
											key={category.category_id}
											value={category.category_id}
										>
											{category.category_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<label className='text-sm font-medium'>Price</label>
							<Input
								type='number'
								step='0.01'
								value={formData.price}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										price: e.target.value,
									}))
								}
								placeholder='0.00'
								required
							/>
						</div>

						<div>
							<label className='text-sm font-medium'>Stock Quantity</label>
							<Input
								type='number'
								value={formData.stock_quantity}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										stock_quantity: e.target.value,
									}))
								}
								placeholder='0'
								required
							/>
						</div>

						<div className='col-span-2'>
							<label className='text-sm font-medium'>Description</label>
							<Textarea
								value={formData.description}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								placeholder='Enter product description'
								rows={4}
							/>
						</div>

						<div className='col-span-2'>
							<label className='text-sm font-medium'>Product Images</label>
							<div className='mt-2 grid grid-cols-4 gap-4'>
								{formData.images.map((url, index) => (
									<div key={index} className='relative group'>
										<img
											src={url}
											alt={`Product image ${index + 1}`}
											className='w-full h-24 object-cover rounded-lg'
										/>
										<button
											title='Remove image'
											type='button'
											onClick={() => removeImage(index)}
											className='absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
										>
											<X className='h-4 w-4' />
										</button>
									</div>
								))}
								<label className='border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50'>
									<Upload className='h-8 w-8 text-gray-400' />
									<span className='mt-2 text-sm text-gray-500'>
										Upload Image
									</span>
									<input
										type='file'
										className='hidden'
										accept='image/*'
										multiple
										onChange={handleImageUpload}
									/>
								</label>
							</div>
						</div>

						<div className='col-span-2 flex items-center space-x-2'>
							<input
								type='checkbox'
								checked={formData.is_featured}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										is_featured: e.target.checked,
									}))
								}
								id='featured'
							/>
							<label htmlFor='featured' className='text-sm font-medium'>
								Featured Product
							</label>
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
								? 'Create Product'
								: 'Update Product'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
