'use client'

import menuItems from '@/constants/menuItems.json'
import { useLogout } from '@/src/hooks/useLogout'
import { useUser } from '@/src/hooks/useUser'
import {
	CalendarCheck,
	ChevronDown,
	Heart,
	LogOut,
	Phone,
	TextAlignJustify,
	User as UserIcon,
	X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import ConfirmModal from '../ConfirmModal'
import Logo from '../Logo'

interface NavBarProps {
	isMenuOpen: boolean
	setIsMenuOpen: (open: boolean) => void
	showPhoneBlock?: boolean
	phoneNumber?: string
	phoneDisplay?: string
}

export default function NavBar({
	isMenuOpen,
	setIsMenuOpen,
	showPhoneBlock = true,
	phoneNumber = '+491711234567',
	phoneDisplay = '+49 171 1234567',
}: NavBarProps) {
	const pathname = usePathname()
	const { data: user, isLoading } = useUser()
	const { logout } = useLogout()
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isMenuOpen])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const getInitials = () => {
		if (user?.firstName) {
			return user.firstName
				.split(' ')
				.map((n: string) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2)
		}
		return user?.email?.[0]?.toUpperCase() || 'U'
	}

	const handleLogoutConfirm = async () => {
		try {
			setIsLoggingOut(true)
			await logout()
		} catch (error) {
			console.error('Logout failed:', error)
		} finally {
			setIsLoggingOut(false)
			setShowLogoutConfirm(false)
		}
	}

	return (
		<>
			<div className='w-full px-4 md:px-12 xl:px-0 xl:w-2/3 h-full flex items-center justify-between mx-auto max-w-360'>
				<div className='flex items-center gap-3'>
					<button
						onClick={() => setIsMenuOpen(true)}
						className='xl:hidden w-10 h-10 border border-border-main rounded-md flex items-center justify-center cursor-pointer hover:bg-ui-hover transition-colors'
						aria-label='Open Menu'
					>
						<TextAlignJustify className='w-5 h-5 text-main' />
					</button>
					<Logo />
				</div>

				<nav className='hidden xl:block'>
					<ul className='flex flex-row gap-5'>
						{menuItems.map(item => {
							const isActive =
								item.href === '/'
									? pathname === '/'
									: pathname.startsWith(item.href)

							return (
								<li
									key={item.href}
									className='relative py-1 px-3 font-inter text-main text-lg'
								>
									<Link
										href={item.href}
										className='group relative flex items-center gap-1 transition-colors hover:text-primary'
									>
										<span
											className={
												isActive ? 'font-bold text-primary' : 'font-medium'
											}
										>
											{item.label}
										</span>
										<span
											className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full ${
												isActive ? 'w-full' : 'w-0'
											}`}
										/>
									</Link>
								</li>
							)
						})}
					</ul>
				</nav>

				<div className='flex flex-row items-center gap-3 justify-center'>
					{showPhoneBlock && (
						<a
							href={`tel:${phoneNumber}`}
							className='w-10 h-10 flex items-center justify-center bg-primary hover:bg-primary-hover rounded-full cursor-pointer transition-colors shrink-0 shadow-sm'
							aria-label='Call Us'
						>
							<Phone size={20} color='white' />
						</a>
					)}

					<div className='hidden sm:block'>
						{!isMounted || isLoading ? (
							<div className='w-24 h-10 bg-ui-hover animate-pulse rounded-xl' />
						) : user ? (
							<div className='relative' ref={dropdownRef}>
								<button
									onClick={() => setIsDropdownOpen(prev => !prev)}
									className='flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-border-main bg-card-bg hover:bg-ui-hover transition-colors cursor-pointer shadow-xs'
									aria-expanded={isDropdownOpen}
									aria-label='User menu'
								>
									{user.avatarUrl ? (
										<Image
											src={user.avatarUrl}
											alt={user.firstName || 'User avatar'}
											width={32}
											height={32}
											className='w-8 h-8 rounded-full object-cover border border-border-main'
										/>
									) : (
										<div className='w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center'>
											{getInitials()}
										</div>
									)}
									<span className='text-sm font-semibold font-inter text-main max-w-27.5 truncate'>
										{user.firstName || 'Account'}
									</span>
									<ChevronDown
										className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
											isDropdownOpen ? 'rotate-180' : ''
										}`}
									/>
								</button>

								{isDropdownOpen && (
									<div className='absolute right-0 mt-2 w-64 rounded-2xl bg-card-bg border border-border-main shadow-xl shadow-black/5 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150'>
										<div className='px-4 py-3 border-b border-border-main flex items-center gap-3'>
											{user.avatarUrl ? (
												<Image
													src={user.avatarUrl}
													alt={user.firstName || 'Avatar'}
													width={36}
													height={36}
													className='w-9 h-9 rounded-full object-cover border border-border-main shrink-0'
												/>
											) : (
												<div className='w-9 h-9 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0'>
													{getInitials()}
												</div>
											)}
											<div className='min-w-0 flex-1'>
												<p className='text-sm font-semibold text-main truncate'>
													{user.firstName || 'User'}
												</p>
												{user.email && (
													<p className='text-xs text-text-muted truncate'>
														{user.email}
													</p>
												)}
											</div>
										</div>

										<div className='py-1.5 px-1.5'>
											<Link
												href='/account'
												onClick={() => setIsDropdownOpen(false)}
												className='flex items-center gap-2.5 px-3 py-2 text-sm text-main rounded-xl hover:bg-ui-hover transition-colors font-medium'
											>
												<UserIcon className='w-4 h-4 text-text-muted' />
												Profile
											</Link>
											<Link
												href='/account/bookings'
												onClick={() => setIsDropdownOpen(false)}
												className='flex items-center gap-2.5 px-3 py-2 text-sm text-main rounded-xl hover:bg-ui-hover transition-colors font-medium'
											>
												<CalendarCheck className='w-4 h-4 text-text-muted' />
												Bookings
											</Link>
											<Link
												href='/account/saved'
												onClick={() => setIsDropdownOpen(false)}
												className='flex items-center gap-2.5 px-3 py-2 text-sm text-main rounded-xl hover:bg-ui-hover transition-colors font-medium'
											>
												<Heart className='w-4 h-4 text-text-muted' />
												Saved Cars
											</Link>
										</div>

										<div className='pt-1.5 px-1.5 border-t border-border-main'>
											<button
												onClick={() => {
													setIsDropdownOpen(false)
													setShowLogoutConfirm(true)
												}}
												className='w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer text-left font-medium'
											>
												<LogOut className='w-4 h-4' />
												Log Out
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<Link
								href='/login'
								className='px-5 py-2.5 text-sm font-semibold font-inter bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center'
							>
								Log In
							</Link>
						)}
					</div>
				</div>
			</div>

			{isMenuOpen && (
				<div
					className='xl:hidden fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200'
					onClick={() => setIsMenuOpen(false)}
				/>
			)}

			<div
				className={`xl:hidden fixed top-0 left-0 h-full w-full max-w-[320px] bg-card-bg z-50 shadow-2xl transform transition-transform duration-200 flex flex-col border-r border-border-main ${
					isMenuOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div className='p-4 border-b border-border-main flex items-center justify-between bg-main-bg'>
					<div className='flex items-center gap-2'>
						<div className='w-8.75 h-8.75 border border-border-main rounded-md flex items-center justify-center bg-card-bg'>
							<TextAlignJustify className='w-4 h-4 text-main' />
						</div>
						<span className='font-bold text-main text-base'>Navigation</span>
					</div>
					<button
						onClick={() => setIsMenuOpen(false)}
						className='p-1 hover:bg-ui-hover rounded-md transition-colors cursor-pointer'
						aria-label='Close Menu'
					>
						<X className='w-5 h-5 text-main' />
					</button>
				</div>

				<div className='px-4 mt-6'>
					<Logo />
				</div>

				<nav className='flex-1 overflow-y-auto p-4 mt-2'>
					<ul className='flex flex-col gap-1'>
						{menuItems.map(item => {
							const isActive =
								item.href === '/'
									? pathname === '/'
									: pathname.startsWith(item.href)

							return (
								<li
									key={item.href}
									className='border-b border-border-main pb-2 last:border-none'
								>
									<Link
										href={item.href}
										onClick={() => setIsMenuOpen(false)}
										className={`block py-2.5 px-3 rounded-md font-inter text-base ${
											isActive
												? 'bg-ui-hover text-primary font-bold'
												: 'text-main hover:bg-ui-hover'
										}`}
									>
										{item.label}
									</Link>
								</li>
							)
						})}
					</ul>
				</nav>

				<div className='p-4 border-t border-border-main bg-main-bg'>
					{!isMounted || isLoading ? (
						<div className='w-full h-12 bg-ui-hover animate-pulse rounded-xl mb-3' />
					) : user ? (
						<div className='mb-3 p-3 rounded-xl bg-card-bg border border-border-main'>
							<Link
								href='/account'
								onClick={() => setIsMenuOpen(false)}
								className='flex items-center gap-3 mb-3 min-w-0'
							>
								{user.avatarUrl ? (
									<Image
										src={user.avatarUrl}
										alt={user.firstName || 'User avatar'}
										width={40}
										height={40}
										className='w-10 h-10 rounded-full object-cover border border-border-main shrink-0'
									/>
								) : (
									<div className='w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0'>
										{getInitials()}
									</div>
								)}
								<div className='min-w-0 flex-1'>
									<p className='text-sm font-semibold text-main truncate'>
										{user.firstName || 'User'}
									</p>
									{user.email && (
										<p className='text-xs text-text-muted truncate'>
											{user.email}
										</p>
									)}
								</div>
							</Link>

							<div className='flex flex-col sm:flex-row gap-2 pt-2 border-t border-border-main'>
								<Link
									href='/account'
									onClick={() => setIsMenuOpen(false)}
									className='flex-1 py-1.5 text-xs font-medium text-center text-main bg-ui-hover hover:opacity-80 rounded-lg transition-opacity'
								>
									Profile
								</Link>
								<button
									onClick={() => {
										setIsMenuOpen(false)
										setShowLogoutConfirm(true)
									}}
									className='flex-1 py-1.5 text-xs font-medium text-center text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer'
								>
									Log Out
								</button>
							</div>
						</div>
					) : (
						<Link
							href='/login'
							onClick={() => setIsMenuOpen(false)}
							className='w-full mb-3 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-sm block text-center'
						>
							Log In
						</Link>
					)}

					{showPhoneBlock && (
						<div className='flex items-center gap-3 justify-center pt-3 border-t border-border-main'>
							<div className='w-9 h-9 flex items-center justify-center bg-primary rounded-full shrink-0'>
								<Phone size={18} color='white' />
							</div>
							<div className='flex flex-col min-w-0'>
								<span className='text-xs font-normal text-text-muted font-work-sans'>
									Need help?
								</span>
								<a href={`tel:${phoneNumber}`} className='truncate'>
									<span className='text-sm font-semibold text-main font-work-sans hover:text-primary transition-colors truncate block'>
										{phoneDisplay}
									</span>
								</a>
							</div>
						</div>
					)}
				</div>
			</div>

			<ConfirmModal
				isOpen={showLogoutConfirm}
				isLoading={isLoggingOut}
				title='Log Out'
				description='Are you sure you want to log out of your account?'
				confirmText='Log Out'
				cancelText='Cancel'
				variant='danger'
				onClose={() => setShowLogoutConfirm(false)}
				onConfirm={handleLogoutConfirm}
			/>
		</>
	)
}
