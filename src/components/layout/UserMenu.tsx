// src/components/layout/UserMenu.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, UserCog } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export default function UserMenu() {
	const router = useRouter();
	const { user, logout } = useAuth();

	// If no user is authenticated, do not display the menu
	if (!user) return null;

	const handleLogout = async () => {
		try {
			await logout(); // Using the logout function from useAuth
			router.push('/auth/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='relative h-8 w-8 rounded-full'
				>
					<User className='h-5 w-5' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='end' forceMount>
				<DropdownMenuLabel className='font-normal'>
					<div className='flex flex-col space-y-1'>
						<p className='text-sm font-medium leading-none'>
							{user.firstName} {user.lastName}
						</p>
						<p className='text-xs leading-none text-muted-foreground'>
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push('/profile')}>
					<UserCog className='mr-2 h-4 w-4' />
					<span>Profile</span>
				</DropdownMenuItem>
				{user.role === 'admin' && (
					<DropdownMenuItem onClick={() => router.push('/settings')}>
						<Settings className='mr-2 h-4 w-4' />
						<span>Settings</span>
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout} className='text-red-600'>
					<LogOut className='mr-2 h-4 w-4' />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
