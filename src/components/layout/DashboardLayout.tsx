import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import Header from './Header';
import UserMenu from './UserMenu';

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className='min-h-screen bg-gray-100'>
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			<div className='lg:pl-72'>
				<Header onMenuClick={() => setSidebarOpen(true)}>
					<UserMenu /> {/* Pass as children to Header */}
				</Header>

				<main className='py-10'>
					<div className='px-4 sm:px-6 lg:px-8'>{children}</div>
				</main>
			</div>
		</div>
	);
}
