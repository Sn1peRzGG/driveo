'use client'

import menuItems from '@/constants/menuItems.json'
import { Phone, TextAlignJustify, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Logo from '../Logo'

interface NavBarProps {
	isMenuOpen: boolean
	setIsMenuOpen: (open: boolean) => void
}

export default function NavBar({ isMenuOpen, setIsMenuOpen }: NavBarProps) {
	const pathname = usePathname()

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

	return (
		<>
			<div className='w-full px-4 md:px-12 xl:px-0 xl:w-2/3 h-full flex items-center justify-between mx-auto max-w-360'>
				<div className='flex items-center gap-3'>
					<button
						onClick={() => setIsMenuOpen(true)}
						className='xl:hidden w-10 h-10 border border-border-main rounded-md flex items-center justify-center cursor-pointer hover:bg-main-bg transition-colors'
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
										className='group relative flex items-center gap-1 transition-colors duration-200'
									>
										<span className={isActive ? 'font-bold' : 'font-medium'}>
											{item.label}
										</span>
										<span
											className={`absolute -bottom-1 left-0 h-0.5 bg-current transition-all duration-200 group-hover:w-full ${
												isActive ? 'w-full' : 'w-0'
											}`}
										/>
									</Link>
								</li>
							)
						})}
					</ul>
				</nav>

				<div className='flex flex-row items-center justify-center'>
					<a
						href='tel:+491711234567'
						className='w-10 h-10 flex items-center justify-center bg-primary hover:bg-primary-hover rounded-full cursor-pointer transition-colors shrink-0'
						aria-label='Call Us'
					>
						<Phone size={20} color='white' />
					</a>

					<div className='hidden sm:block ml-3 h-10'>
						<h2 className='text-[16px] font-normal font-work-sans text-main/80'>
							Need help?
						</h2>
						<a href='tel:+491711234567'>
							<span className='text-[16px] font-semibold font-work-sans text-main hover:text-primary transition-colors'>
								+49 171 1234567
							</span>
						</a>
					</div>
				</div>
			</div>

			{isMenuOpen && (
				<div
					className='xl:hidden fixed inset-0 bg-black/40 z-50 animate-in fade-in duration-200'
					onClick={() => setIsMenuOpen(false)}
				/>
			)}

			<div
				className={`xl:hidden fixed top-0 left-0 h-full w-80 bg-card-bg z-50 shadow-2xl transform transition-transform duration-200 flex flex-col ${
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
										className={`block py-2.5 px-3 rounded-md transition-colors font-inter text-base ${
											isActive
												? 'bg-main-bg text-primary font-bold'
												: 'text-main hover:bg-main-bg/50'
										}`}
									>
										{item.label}
									</Link>
								</li>
							)
						})}
					</ul>
				</nav>

				<div className='p-4 border-t border-border-main bg-main-bg flex items-center gap-3 justify-center'>
					<div className='w-9 h-9 flex items-center justify-center bg-primary rounded-full shrink-0'>
						<Phone size={18} color='white' />
					</div>
					<div className='flex flex-col'>
						<span className='text-xs font-normal text-main/80 font-work-sans'>
							Need help?
						</span>
						<a href='tel:+491711234567'>
							<span className='text-sm font-semibold text-main font-work-sans'>
								+49 171 1234567
							</span>
						</a>
					</div>
				</div>
			</div>
		</>
	)
}
