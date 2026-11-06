'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import { BASE_URL } from '@/src/lib/api'
import Image from 'next/image'
import Link from 'next/link'

export default function VehiclesPage() {
	const { vehicles, isLoading, error, categoryName } = useVehicles()

	if (isLoading) {
		return (
			<div className='w-full flex items-center justify-center py-20'>
				<div className='text-text-muted animate-pulse'>Loading vehicles...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='w-full flex items-center justify-center py-20'>
				<p className='text-red-500'>Failed to load vehicles.</p>
			</div>
		)
	}

	return (
		<div className='container-responsive px-4 mx-auto max-w-7xl py-8 font-work-sans'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-border-main pb-4'>
				<div>
					<h1 className='text-2xl sm:text-3xl font-black text-text-main'>
						Available Vehicles
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
						Found {vehicles.length} items
					</p>
				</div>
			</div>

			{vehicles.length === 0 ? (
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
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
					{vehicles.map(vehicle => (
						<div
							key={vehicle._id}
							className='bg-card-bg border border-border-main rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow'
						>
							{vehicle.image && (
								<div className='relative w-full h-48 rounded-xl overflow-hidden bg-main-bg flex items-center justify-center p-4'>
									<Image
										src={`${BASE_URL}${vehicle.image}`}
										alt={`${vehicle.brand} ${vehicle.model}`}
										fill
										className='object-contain p-2 transition-transform duration-300 hover:scale-105'
										unoptimized
									/>
								</div>
							)}
							<div className='flex flex-col grow justify-between'>
								<div>
									<h2 className='text-lg font-bold text-text-main'>
										{vehicle.brand} {vehicle.model}
									</h2>
									<p className='text-sm text-text-muted mt-1'>
										City:{' '}
										{typeof vehicle.city === 'string'
											? vehicle.city
											: vehicle.city?.name || 'N/A'}
									</p>
								</div>
								<p className='text-lg font-semibold text-primary mt-4'>
									${vehicle.pricePerDay} / day
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
