// src/pages/dashboard/products.tsx
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
import { Package, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ProductForm,
	ProductFormData,
} from '@/components/products/ProductForm';

interface Product {
	product_id: number;
	product_name: string;
	price: string;
	stock_quantity: number;
	category_name: string;
	is_featured: boolean;
	created_at: string;
}

export default function Products() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

	useEffect(() => {
		fetchProducts();
	}, [currentPage, searchTerm]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const res = await fetch(
				`/api/dashboard/products?page=${currentPage}&limit=10&search=${searchTerm}`
			);
			const data = await res.json();

			if (data.success) {
				setProducts(data.data.products);
				setTotalPages(data.data.totalPages);
			}
		} catch (error) {
			console.error('Failed to fetch products:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddProduct = () => {
		setSelectedProduct(null);
		setFormMode('create');
		setIsFormOpen(true);
	};

	const handleEditProduct = (product: Product) => {
		setSelectedProduct(product);
		setFormMode('edit');
		setIsFormOpen(true);
	};

	const handleDeleteProduct = async (productId: number) => {
		if (confirm('Are you sure you want to delete this product?')) {
			try {
				const response = await fetch(`/api/dashboard/products/${productId}`, {
					method: 'DELETE',
				});
				if (!response.ok) throw new Error('Failed to delete product');

				// Refresh product list
				fetchProducts();
			} catch (error) {
				console.error('Error deleting product:', error);
			}
		}
	};

	const handleFormSubmit = async (data: ProductFormData) => {
		try {
			if (formMode === 'create') {
				const response = await fetch('/api/dashboard/products', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				});
				if (!response.ok) throw new Error('Failed to create product');
			} else {
				const response = await fetch(
					`/api/dashboard/products/${selectedProduct?.product_id}`,
					{
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(data),
					}
				);
				if (!response.ok) throw new Error('Failed to update product');
			}

			// Refresh products list and close form
			fetchProducts();
			setIsFormOpen(false);
		} catch (error) {
			console.error('Error saving product:', error);
		}
	};

	return (
		<DashboardLayout>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>Products</h1>
					<Button onClick={handleAddProduct}>
						<Plus className='mr-2 h-4 w-4' />
						Add Product
					</Button>
				</div>

				{/* Stats Cards */}
				<div className='grid gap-4 md:grid-cols-3'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Products
							</CardTitle>
							<Package className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{products.length}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Low Stock</CardTitle>
							<Package className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{products.filter((p) => p.stock_quantity < 10).length}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Featured</CardTitle>
							<Package className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{products.filter((p) => p.is_featured).length}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Products Table */}
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle>Products List</CardTitle>
							<div className='flex w-full max-w-sm items-center space-x-2'>
								<Input
									placeholder='Search products...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-[300px]'
								/>
								<Button>
									<Search className='h-4 w-4' />
								</Button>
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
										<TableHead>Product</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Price</TableHead>
										<TableHead>Stock</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className='text-right'>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{products.map((product) => (
										<TableRow key={product.product_id}>
											<TableCell className='font-medium'>
												{product.product_name}
											</TableCell>
											<TableCell>{product.category_name}</TableCell>
											<TableCell>${product.price}</TableCell>
											<TableCell>
												<span
													className={
														product.stock_quantity < 10
															? 'text-red-500'
															: 'text-green-500'
													}
												>
													{product.stock_quantity}
												</span>
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
														product.is_featured
															? 'bg-green-100 text-green-700'
															: 'bg-gray-100 text-gray-700'
													}`}
												>
													{product.is_featured ? 'Featured' : 'Standard'}
												</span>
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex justify-end space-x-2'>
													<Button
														variant='ghost'
														size='sm'
														onClick={() => handleEditProduct(product)}
													>
														<Pencil className='h-4 w-4' />
													</Button>
													<Button
														variant='ghost'
														size='sm'
														onClick={() =>
															handleDeleteProduct(product.product_id)
														}
														className='text-red-500 hover:text-red-700'
													>
														<Trash2 className='h-4 w-4' />
													</Button>
												</div>
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

				{/* Product Form Modal */}
				<ProductForm
					open={isFormOpen}
					onClose={() => setIsFormOpen(false)}
					onSubmit={handleFormSubmit}
					initialData={
						selectedProduct
							? {
									...selectedProduct,
									stock_quantity: selectedProduct.stock_quantity.toString(),
							  }
							: undefined
					}
					mode={formMode}
				/>
			</div>
		</DashboardLayout>
	);
}
