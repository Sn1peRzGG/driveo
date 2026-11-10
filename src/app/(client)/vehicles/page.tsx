'use client'

import Pagination from '@/src/components/ui/Pagination'
import SortDropdown from '@/src/components/ui/SortDropdown'
import VehicleCard from '@/src/components/ui/VehicleCard'
import VehicleFilter from '@/src/components/ui/VehicleFilter'
import { SortOption, useVehicles } from '@/src/hooks/useVehicles'
import { SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function VehiclesPage() {
	const {
		vehicles,
		meta,
		isLoading,
		error,
		page,
		setPage,
		limit,
		setLimit,
		sortBy,
		setSortBy,
		searchQuery,
		categoryName,
	} = useVehicles()

	const [isSortOpen, setIsSortOpen] = useState(false)
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
	const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	const dropdownRef = useRef<HTMLDivElement>(null)

	const sortLabels: Record<SortOption, string> = {
		default: 'Default',
		'price-asc': 'Price: Low to High',
		'price-desc': 'Price: High to Low',
		'year-desc': 'Year: Newest First',
		'year-asc': 'Year: Oldest First',
	}

	useEffect(() => {
		const savedState = window.sessionStorage.getItem(
			'isDesktopVehicleFilterOpen',
		)
		if (savedState !== null) {
			setIsDesktopFilterOpen(savedState === 'true')
		}

		setIsMounted(true)
	}, [])

	const toggleDesktopFilter = () => {
		setIsDesktopFilterOpen(prev => {
			const newState = !prev
			window.sessionStorage.setItem(
				'isDesktopVehicleFilterOpen',
				String(newState),
			)
			return newState
		})
	}

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsSortOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	useEffect(() => {
		if (isMobileFilterOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isMobileFilterOpen])

	if (!isMounted) {
		return (
			<div className='w-full flex items-center justify-center py-20 font-work-sans'>
				<div className='text-text-muted animate-pulse'>Loading vehicles...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='w-full flex items-center justify-center py-20 font-work-sans'>
				<p className='text-red-500'>Failed to load vehicles.</p>
			</div>
		)
	}

	return (
		<div className='container-responsive px-4 mx-auto max-w-7xl py-8 font-work-sans'>
			<div
				className={`fixed inset-x-0 top-24 bottom-0 z-50 xl:hidden transition-opacity duration-200 backdrop-blur-md ${
					isMobileFilterOpen
						? 'pointer-events-auto opacity-100'
						: 'pointer-events-none opacity-0'
				}`}
			>
				<div
					className='absolute inset-0 bg-main-bg/50'
					onClick={() => setIsMobileFilterOpen(false)}
				/>

				<aside
					className={`absolute left-0 top-0 h-full w-[85%] max-w-xs bg-card-bg border-r border-border-main shadow-xl overflow-y-auto transition-transform duration-200 ease-out ${
						isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
				>
					<div className='flex items-center justify-between px-4 py-4 border-b border-border-main'>
						<h2 className='text-lg font-bold text-text-main'>Filters</h2>

						<button
							type='button'
							onClick={() => setIsMobileFilterOpen(false)}
							className='p-2 border border-border-main rounded-md bg-card-bg active:bg-ui-active cursor-pointer'
						>
							<X className='w-5 h-5 text-text-main' />
						</button>
					</div>

					<div className='p-4'>
						<VehicleFilter />
					</div>
				</aside>
			</div>

			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-border-main pb-4'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-black text-text-main'>
						{searchQuery
							? `Results for "${searchQuery}"`
							: 'Available Vehicles'}
					</h1>
					<p className='text-sm text-text-muted mt-1'>
						{categoryName ? (
							<>
								Category:{' '}
								<span className='font-semibold text-primary'>
									{categoryName}
								</span>{' '}
								–{' '}
							</>
						) : null}
						Found {meta?.total || vehicles.length} items
					</p>
				</div>

				<div className='flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end'>
					<button
						type='button'
						onClick={() => setIsMobileFilterOpen(true)}
						className='flex xl:hidden items-center gap-2 border border-border-strong rounded-md h-10 px-4 py-2 bg-card-bg text-text-main font-medium text-sm shadow-sm hover:bg-ui-hover transition-colors cursor-pointer'
					>
						<SlidersHorizontal size={16} />
						Filters
					</button>

					<button
						type='button'
						onClick={toggleDesktopFilter}
						className='hidden xl:flex items-center justify-center gap-2 border border-border-strong rounded-md h-10 w-fit px-4 py-2 bg-card-bg text-text-main font-medium text-sm shadow-sm hover:bg-ui-hover transition-all select-none cursor-pointer'
					>
						<SlidersHorizontal
							size={16}
							className={`transition-colors duration-200 ${
								isDesktopFilterOpen ? 'text-primary' : 'text-text-muted'
							}`}
						/>
						<span className='w-24 text-center'>
							{isDesktopFilterOpen ? 'Hide Filters' : 'Show Filters'}
						</span>
					</button>

					<SortDropdown
						value={sortBy}
						onChange={setSortBy}
						options={sortLabels}
						className='min-w-44 sm:min-w-56'
					/>
				</div>
			</div>

			<div className='flex flex-col xl:flex-row gap-8 items-start'>
				<aside
					className={`hidden xl:block sticky top-40 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
						isDesktopFilterOpen
							? 'w-72 opacity-100 translate-x-0 blur-none mr-0 visible'
							: 'w-0 opacity-0 -translate-x-10 blur-sm -mr-8 invisible pointer-events-none'
					}`}
				>
					<div className='w-72'>
						<VehicleFilter />
					</div>
				</aside>

				<div className='w-full transition-all duration-200 ease-in-out'>
					{isLoading && vehicles.length === 0 ? (
						<div className='w-full flex items-center justify-center py-20'>
							<div className='text-text-muted animate-pulse'>
								Loading vehicles...
							</div>
						</div>
					) : vehicles.length === 0 ? (
						<div className='text-center py-20 bg-main-bg rounded-xl border border-dashed border-border-main'>
							<p className='text-text-muted text-lg'>
								We couldn&apos;t find anything matching your request.
							</p>
							<Link
								href='/'
								className='text-primary font-semibold mt-2 inline-block hover:underline'
							>
								Go back home
							</Link>
						</div>
					) : (
						<>
							<div
								className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
									isDesktopFilterOpen
										? 'lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3'
										: 'lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'
								}`}
							>
								{vehicles.map(vehicle => (
									<VehicleCard key={vehicle._id} vehicle={vehicle} />
								))}
							</div>

							{meta && (
								<Pagination
									currentPage={page}
									totalPages={meta.pages}
									onPageChange={setPage}
									limit={limit}
									onLimitChange={setLimit}
									limitOptions={[12, 24, 48, 72]}
								/>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}
