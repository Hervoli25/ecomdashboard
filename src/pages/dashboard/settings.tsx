import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Settings, Store, Truck, Bell } from 'lucide-react';

export default function SettingsPage() {
	const [loading, setLoading] = useState(false);

	// Store settings state
	const [storeSettings, setStoreSettings] = useState({
		storeName: 'My E-commerce Store',
		storeEmail: 'contact@mystore.com',
		phoneNumber: '+1234567890',
		currency: 'USD',
		timezone: 'UTC',
		orderPrefix: 'ORD-',
	});

	// Notification settings state
	const [notificationSettings, setNotificationSettings] = useState({
		orderConfirmation: true,
		orderShipped: true,
		orderDelivered: true,
		lowStock: true,
		newCustomer: true,
		newsletter: false,
	});

	// Shipping settings state
	const [shippingSettings, setShippingSettings] = useState({
		freeShippingThreshold: '100',
		defaultShippingRate: '10',
		internationalShipping: false,
		localPickup: true,
	});

	const handleSaveSettings = async (section: string) => {
		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log(`Saving ${section} settings...`);
		} catch (error) {
			console.error(`Failed to save ${section} settings:`, error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<DashboardLayout>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>Settings</h1>
				</div>

				<Tabs defaultValue='general' className='space-y-4'>
					<TabsList>
						<TabsTrigger value='general' className='flex items-center gap-2'>
							<Settings className='h-4 w-4' />
							General
						</TabsTrigger>
						<TabsTrigger value='store' className='flex items-center gap-2'>
							<Store className='h-4 w-4' />
							Store
						</TabsTrigger>
						<TabsTrigger value='shipping' className='flex items-center gap-2'>
							<Truck className='h-4 w-4' />
							Shipping
						</TabsTrigger>
						<TabsTrigger
							value='notifications'
							className='flex items-center gap-2'
						>
							<Bell className='h-4 w-4' />
							Notifications
						</TabsTrigger>
					</TabsList>

					{/* General Settings */}
					<TabsContent value='general'>
						<Card>
							<CardHeader>
								<CardTitle>General Settings</CardTitle>
								<CardDescription>
									Manage your store's general settings and preferences
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='space-y-4'>
									<div>
										<Label>Store Name</Label>
										<Input
											value={storeSettings.storeName}
											onChange={(e) =>
												setStoreSettings((prev) => ({
													...prev,
													storeName: e.target.value,
												}))
											}
										/>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<Label>Currency</Label>
											<Select
												value={storeSettings.currency}
												onValueChange={(value) =>
													setStoreSettings((prev) => ({
														...prev,
														currency: value,
													}))
												}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select currency' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='USD'>USD ($)</SelectItem>
													<SelectItem value='EUR'>EUR (€)</SelectItem>
													<SelectItem value='GBP'>GBP (£)</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div>
											<Label>Timezone</Label>
											<Select
												value={storeSettings.timezone}
												onValueChange={(value) =>
													setStoreSettings((prev) => ({
														...prev,
														timezone: value,
													}))
												}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select timezone' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='UTC'>UTC</SelectItem>
													<SelectItem value='EST'>EST</SelectItem>
													<SelectItem value='PST'>PST</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									<div>
										<Label>Order Number Prefix</Label>
										<Input
											value={storeSettings.orderPrefix}
											onChange={(e) =>
												setStoreSettings((prev) => ({
													...prev,
													orderPrefix: e.target.value,
												}))
											}
										/>
									</div>
								</div>

								<Button
									onClick={() => handleSaveSettings('general')}
									disabled={loading}
								>
									{loading ? 'Saving...' : 'Save Changes'}
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Shipping Settings */}
					<TabsContent value='shipping'>
						<Card>
							<CardHeader>
								<CardTitle>Shipping Settings</CardTitle>
								<CardDescription>
									Configure your store's shipping options and rates
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='space-y-4'>
									<div>
										<Label>Free Shipping Threshold ($)</Label>
										<Input
											type='number'
											value={shippingSettings.freeShippingThreshold}
											onChange={(e) =>
												setShippingSettings((prev) => ({
													...prev,
													freeShippingThreshold: e.target.value,
												}))
											}
										/>
									</div>

									<div>
										<Label>Default Shipping Rate ($)</Label>
										<Input
											type='number'
											value={shippingSettings.defaultShippingRate}
											onChange={(e) =>
												setShippingSettings((prev) => ({
													...prev,
													defaultShippingRate: e.target.value,
												}))
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<Label>Enable International Shipping</Label>
										<Switch
											checked={shippingSettings.internationalShipping}
											onCheckedChange={(checked: boolean) =>
												setShippingSettings((prev) => ({
													...prev,
													internationalShipping: checked,
												}))
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<Label>Enable Local Pickup</Label>
										<Switch
											checked={shippingSettings.localPickup}
											onCheckedChange={(checked: boolean) =>
												setShippingSettings((prev) => ({
													...prev,
													localPickup: checked,
												}))
											}
										/>
									</div>
								</div>

								<Button
									onClick={() => handleSaveSettings('shipping')}
									disabled={loading}
								>
									{loading ? 'Saving...' : 'Save Changes'}
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Notification Settings */}
					<TabsContent value='notifications'>
						<Card>
							<CardHeader>
								<CardTitle>Notification Settings</CardTitle>
								<CardDescription>
									Configure your email and system notifications
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='space-y-4'>
									<div className='flex items-center justify-between'>
										<Label>Order Confirmation</Label>
										<Switch
											checked={notificationSettings.orderConfirmation}
											onCheckedChange={(checked: boolean) =>
												setNotificationSettings((prev) => ({
													...prev,
													orderConfirmation: checked,
												}))
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<Label>Order Shipped</Label>
										<Switch
											checked={notificationSettings.orderShipped}
											onCheckedChange={(checked: boolean) =>
												setNotificationSettings((prev) => ({
													...prev,
													orderShipped: checked,
												}))
											}
										/>
									</div>

									<div className='flex items-center justify-between'>
										<Label>Order Delivered</Label>
										<Switch
											checked={notificationSettings.orderDelivered}
											onCheckedChange={(checked: boolean) =>
												setNotificationSettings((prev) => ({
													...prev,
													orderDelivered: checked,
												}))
											}
										/>
									</div>
								</div>

								<Button
									onClick={() => handleSaveSettings('notifications')}
									disabled={loading}
								>
									{loading ? 'Saving...' : 'Save Changes'}
								</Button>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
}
