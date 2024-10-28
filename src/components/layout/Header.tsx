import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';

interface HeaderProps {
	onMenuClick: () => void;
	children?: React.ReactNode;
}

export default function Header({ onMenuClick, children }: HeaderProps) {
	return (
		<header className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
			<Button
				variant='ghost'
				className='lg:hidden'
				size='icon'
				onClick={onMenuClick}
			>
				<Menu className='h-6 w-6' />
			</Button>

			<div className='flex flex-1 gap-x-4 self-stretch items-center justify-end'>
				<div className='flex items-center gap-x-4 lg:gap-x-6'>
					<Button variant='ghost' size='icon'>
						<Bell className='h-6 w-6' />
					</Button>

					<div className='hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200' />

					{children || <UserMenu />}
				</div>
			</div>
		</header>
	);
}
