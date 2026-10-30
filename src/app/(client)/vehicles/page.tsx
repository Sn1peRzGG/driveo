'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import { BASE_URL } from '@/src/lib/api'
import Image from 'next/image'
import Link from 'next/link'

export default function VehiclesPage() {
	const {
		vehicles,
		isLoading,
		error,
		categoryName,
		city,
		returnCity,
		rentalDate,
		returnDate,
	} = useVehicles()

	if (isLoading) {
		return (
			<div className='w-full flex items-center justify-center py-20'>
				<p className='text-text-muted animate-pulse'>Loading vehicles...</p>
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
		<div className='container mx-auto px-4 py-8 max-w-7xl font-work-sans'>
			<div className='mb-8 border-b border-border-main pb-4'>
				<h1 className='text-3xl font-bold text-text-main'>
					Available Vehicles
				</h1>
				<div className='flex flex-wrap gap-4 mt-2 text-sm text-text-muted'>
					{categoryName && (
						<p>
							Category:{' '}
							<span className='font-semibold text-primary'>{categoryName}</span>
						</p>
					)}
					{city && (
						<p>
							Pickup City:{' '}
							<span className='font-semibold text-text-main'>{city}</span>
						</p>
					)}
					{returnCity && (
						<p>
							Return City:{' '}
							<span className='font-semibold text-text-main'>{returnCity}</span>
						</p>
					)}
					{rentalDate && (
						<p>
							Rental Date:{' '}
							<span className='font-semibold text-text-main'>{rentalDate}</span>
						</p>
					)}
					{returnDate && (
						<p>
							Return Date:{' '}
							<span className='font-semibold text-text-main'>{returnDate}</span>
						</p>
					)}
				</div>
			</div>

			{vehicles.length === 0 ? (
				<div className='text-center py-20 bg-card-bg rounded-xl border border-dashed border-border-main'>
					<p className='text-text-muted text-lg'>
						No vehicles found matching your criteria.
					</p>
					<Link
						href='/'
						className='text-primary font-semibold mt-2 inline-block hover:underline'
					>
						Go back home
					</Link>
				</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{vehicles.map(vehicle => (
						<div
							key={vehicle._id}
							className='bg-card-bg border border-border-main rounded-2xl p-4 flex flex-col gap-4 shadow-sm'
						>
							{vehicle.image && (
								<div className='relative w-full h-48 rounded-xl overflow-hidden bg-linear-to-br from-main-bg to-ui-hover flex items-center justify-center p-4'>
									<Image
										src={`${BASE_URL}${vehicle.image}`}
										alt={`${vehicle.brand} ${vehicle.model}`}
										fill
										className='object-contain p-2 transition-transform duration-300 hover:scale-105'
										unoptimized
									/>
								</div>
							)}
							<div>
								<h2 className='text-xl font-bold text-text-main'>
									{vehicle.brand} {vehicle.model}
								</h2>
								<p className='text-sm text-text-muted'>City: {vehicle.city}</p>
								<p className='text-lg font-semibold text-primary mt-2'>
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
