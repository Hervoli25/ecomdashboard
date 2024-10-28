import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
	LayoutDashboard,
	ShoppingCart,
	Users,
	Package,
	BarChart,
	Settings,
	X,
} from 'lucide-react';

interface SidebarProps {
	open: boolean;
	onClose: () => void;
}

const navigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ name: 'Products', href: '/dashboard/products', icon: Package },
	{ name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
	{ name: 'Customers', href: '/dashboard/customers', icon: Users },
	{ name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
	{ name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
	const router = useRouter();

	return (
		<>
			{/* Mobile sidebar */}
			<div
				className={cn(
					'fixed inset-0 bg-gray-900/80 lg:hidden',
					open ? 'block' : 'hidden'
				)}
				onClick={onClose}
			/>

			<div
				className={cn(
					'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col',
					open ? 'block' : 'hidden lg:block'
				)}
			>
				<div className='flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200'>
					<span className='text-xl font-semibold'>E-commerce</span>
					<Button
						variant='ghost'
						size='icon'
						className='lg:hidden'
						onClick={onClose}
					>
						<X className='h-6 w-6' />
					</Button>
				</div>

				<nav className='flex-1 overflow-y-auto px-4 py-4 space-y-1'>
					{navigation.map((item) => {
						const isActive = router.pathname === item.href;
						return (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									'flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium',
									isActive
										? 'bg-gray-100 text-gray-900'
										: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
								)}
							>
								<item.icon className='h-6 w-6 shrink-0' />
								{item.name}
							</Link>
						);
					})}
				</nav>
			</div>
		</>
	);
}
