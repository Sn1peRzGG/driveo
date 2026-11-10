'use client'

import { BASE_URL } from '@/src/lib/api'
import { Vehicle } from '@/src/types/vehicle'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { DoorsIcon, FuelIcon, GearboxIcon, SeatIcon } from '../VehicleIcons'

export default function FullVehicleCard(vehicle: Vehicle) {
	const carFeatures = vehicle.features?.length > 0 ? vehicle.features : []

	const [selectedImage, setSelectedImage] = useState(vehicle.images[0])

	const currentIndex = vehicle.images.indexOf(selectedImage)

	const handlePrev = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		const newIndex =
			(currentIndex - 1 + vehicle.images.length) % vehicle.images.length
		setSelectedImage(vehicle.images[newIndex])
	}

	const handleNext = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		const newIndex = (currentIndex + 1) % vehicle.images.length
		setSelectedImage(vehicle.images[newIndex])
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-7xl mx-auto p-4 md:p-6'>
			<div className='flex flex-col gap-6'>
				<div>
					<h1 className='text-3xl md:text-4xl font-bold text-text-main tracking-tight'>
						{vehicle.brand} {vehicle.model} {vehicle.year}
					</h1>
					<div className='flex flex-row items-baseline gap-1 mt-2'>
						<span className='text-primary text-3xl font-bold'>
							${vehicle.pricePerDay}
						</span>
						<span className='text-base text-text-muted'>/ day</span>
					</div>
				</div>

				<div className='relative h-75 md:h-90 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-card-bg border border-border-main p-4'>
					<Image
						src={`${BASE_URL}${selectedImage}`}
						alt={`${vehicle.brand} ${vehicle.model}`}
						fill
						className='object-contain p-2 transition-transform duration-300 hover:scale-105 drag-none select-none'
						unoptimized
					/>

					{vehicle.images.length > 1 && (
						<>
							<button
								onClick={handlePrev}
								className='absolute left-3 top-1/2 -translate-y-1/2 bg-card-bg/80 backdrop-blur-md border border-border-main hover:border-primary text-text-main w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 z-10 cursor-pointer'
								aria-label='Previous image'
							>
								<ChevronLeft className='w-6 h-6' />
							</button>
							<button
								onClick={handleNext}
								className='absolute right-3 top-1/2 -translate-y-1/2 bg-card-bg/80 backdrop-blur-md border border-border-main hover:border-primary text-text-main w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 z-10 cursor-pointer'
								aria-label='Next image'
							>
								<ChevronRight className='w-6 h-6' />
							</button>

							<div className='absolute bottom-3 right-3 w-14 text-center bg-card-bg/80 backdrop-blur-md border border-border-main text-text-muted text-xs font-medium py-1.5 rounded-xl shadow-sm pointer-events-none tabular-nums'>
								{currentIndex + 1} / {vehicle.images.length}
							</div>
						</>
					)}
				</div>

				<div className='grid grid-cols-3 gap-4'>
					{vehicle.images.slice(0, 3).map((img, index) => (
						<button
							key={index}
							onClick={() => setSelectedImage(img)}
							className={`relative h-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
								selectedImage === img
									? 'border-primary ring-2 ring-primary/20'
									: 'border-border-main hover:border-border-strong'
							}`}
						>
							<Image
								src={`${BASE_URL}${img}`}
								alt={`Vehicle preview ${index + 1}`}
								fill
								className='object-cover drag-none'
								unoptimized
							/>
						</button>
					))}
				</div>
			</div>

			<div className='flex flex-col gap-6'>
				<div>
					<h2 className='text-xl font-bold mb-4 text-text-main'>
						Technical Specification
					</h2>
					<div className='grid grid-cols-2 gap-4'>
						<SpecCard
							title='Gear Box'
							value={
								vehicle.transmission
									? vehicle.transmission.charAt(0).toUpperCase() +
										vehicle.transmission.slice(1).toLowerCase()
									: ''
							}
							icon={<GearboxIcon />}
						/>
						<SpecCard
							title='Fuel'
							value={
								vehicle.fuelType
									? vehicle.fuelType.charAt(0).toUpperCase() +
										vehicle.fuelType.slice(1).toLowerCase()
									: ''
							}
							icon={<FuelIcon />}
						/>
						<SpecCard
							title='Doors'
							value={vehicle.doors.toString()}
							icon={<DoorsIcon />}
						/>
						<SpecCard
							title='Seats'
							value={vehicle.seats.toString()}
							icon={<SeatIcon />}
						/>
					</div>
				</div>

				{vehicle.description && (
					<div>
						<h2 className='text-xl font-bold mb-2 text-text-main'>
							Description
						</h2>
						<p className='text-sm text-text-muted leading-relaxed bg-card-bg border border-border-main rounded-2xl p-4'>
							{vehicle.description}
						</p>
					</div>
				)}

				<button className='w-full py-4 bg-primary hover:bg-primary-hover text-white font-semibold text-lg rounded-xl shadow-md transition-colors cursor-pointer active:scale-[0.99]'>
					Rent a car
				</button>

				{carFeatures.length > 0 && (
					<div>
						<h2 className='text-xl font-bold mb-4 text-text-main'>
							Car Equipment
						</h2>
						<div className='grid grid-cols-2 gap-y-3 gap-x-6'>
							{carFeatures.map((feature, idx) => (
								<div
									key={idx}
									className='flex items-center gap-3 text-sm text-text-muted'
								>
									<span className='flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold shrink-0'>
										<Check />
									</span>
									<span className='truncate'>{feature}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

function SpecCard({
	title,
	value,
	icon,
}: {
	title: string
	value: string
	icon: React.ReactNode
}) {
	return (
		<div className='flex items-center gap-4 p-4 bg-card-bg border border-border-main rounded-2xl transition-all duration-200 hover:border-primary/50 hover:shadow-sm'>
			<div className='flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0'>
				{icon}
			</div>
			<div className='flex flex-col'>
				<span className='text-xs font-medium text-text-muted uppercase tracking-wider'>
					{title}
				</span>
				<span className='text-base font-semibold text-text-main mt-0.5'>
					{value}
				</span>
			</div>
		</div>
	)
}
