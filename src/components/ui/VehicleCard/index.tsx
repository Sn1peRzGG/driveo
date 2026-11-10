'use client'

import { BASE_URL } from '@/src/lib/api'
import { Vehicle } from '@/src/types/vehicle'
import Image from 'next/image'
import Link from 'next/link'
import { DoorsIcon, FuelIcon, GearboxIcon } from '../VehicleIcons'

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
	return (
		<div
			key={vehicle._id}
			className='bg-card-bg/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 font-work-sans group'
		>
			<div>
				{vehicle.images[0] && (
					<div className='relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-main-bg/50 flex items-center justify-center p-3 border border-white/5'>
						<Image
							src={`${BASE_URL}${vehicle.images[0]}`}
							alt={`${vehicle.brand} ${vehicle.model}`}
							fill
							loading='eager'
							className='object-contain p-2 transition-transform duration-500 group-hover:scale-105 select-none'
							unoptimized
						/>
					</div>
				)}

				<div className='flex items-start justify-between gap-2 mt-4'>
					<div className='min-w-0'>
						<h2 className='text-base sm:text-lg font-bold text-text-main truncate'>
							{vehicle.brand} {vehicle.model}
						</h2>
						<p className='text-xs sm:text-sm text-text-muted truncate'>
							{typeof vehicle.category === 'string'
								? vehicle.category
								: vehicle.category?.name || 'N/A'}
						</p>
					</div>
					<div className='flex flex-col items-end shrink-0'>
						<span className='text-base sm:text-lg font-bold text-primary'>
							${vehicle.pricePerDay}
						</span>
						<span className='text-[11px] text-text-muted'>per day</span>
					</div>
				</div>

				<div className='mt-5 grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-white/5 border border-white/5'>
					<div className='flex items-center gap-1.5 min-w-0'>
						<span className='shrink-0 text-text-muted'>
							<GearboxIcon />
						</span>
						<span className='text-xs text-text-muted truncate'>
							{vehicle.transmission
								? vehicle.transmission.charAt(0) +
									vehicle.transmission.slice(1).toLowerCase()
								: ''}
						</span>
					</div>

					<div className='flex items-center gap-1.5 min-w-0 justify-center'>
						<span className='shrink-0 text-text-muted'>
							<FuelIcon />
						</span>
						<span className='text-xs text-text-muted truncate'>
							{vehicle.fuelType
								? vehicle.fuelType.charAt(0) +
									vehicle.fuelType.slice(1).toLowerCase()
								: ''}
						</span>
					</div>

					<div className='flex items-center gap-1.5 min-w-0 justify-end'>
						<span className='shrink-0 text-text-muted'>
							<DoorsIcon />
						</span>
						<span className='text-xs text-text-muted truncate'>
							{vehicle.doors} doors
						</span>
					</div>
				</div>
			</div>

			<Link
				href={`/vehicles/${vehicle._id}`}
				className='mt-5 w-full py-3 flex items-center justify-center bg-primary hover:bg-primary-hover active:scale-[0.98] rounded-xl text-white transition-all font-inter font-semibold text-sm shadow-md shadow-primary/20 cursor-pointer'
			>
				View Details
			</Link>
		</div>
	)
}
