'use client'

import { BASE_URL } from '@/src/lib/api'
import { Vehicle } from '@/src/types/vehicle'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { DoorsIcon, FuelIcon, GearboxIcon, SeatIcon } from '../VehicleIcons'
import { useUserActions } from '@/src/hooks/useUserActions'

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
	const [activeSpec, setActiveSpec] = useState<string | null>(null)
	const specsRef = useRef<HTMLDivElement>(null)
	const { loadingStates, isInSaved, toggleSaved } = useUserActions()

	const isSaved = isInSaved(vehicle._id)
	const isSaving = loadingStates[vehicle._id] === 'saved'

	const fullName = `${vehicle.brand.name} ${vehicle.model.name}`
	const detailHref = `/vehicles/${vehicle._id}`

	const transmissionText = vehicle.transmission
		? vehicle.transmission.charAt(0) +
			vehicle.transmission.slice(1).toLowerCase()
		: 'N/A'
	const fuelText = vehicle.fuelType
		? vehicle.fuelType.charAt(0) + vehicle.fuelType.slice(1).toLowerCase()
		: 'N/A'

	const specs = [
		{
			id: 'transmission',
			label: transmissionText,
			icon: <GearboxIcon />,
			aria: `Transmission: ${transmissionText}`,
		},
		{
			id: 'fuel',
			label: fuelText,
			icon: <FuelIcon />,
			aria: `Fuel type: ${fuelText}`,
		},
		{
			id: 'doors',
			label: `${vehicle.doors} doors`,
			icon: <DoorsIcon />,
			aria: `${vehicle.doors} doors`,
		},
		{
			id: 'seats',
			label: `${vehicle.seats} seats`,
			icon: <SeatIcon />,
			aria: `${vehicle.seats} seats`,
		},
	]

	useEffect(() => {
		if (!activeSpec) return

		const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
			if (specsRef.current && !specsRef.current.contains(e.target as Node)) {
				setActiveSpec(null)
			}
		}

		document.addEventListener('mousedown', handleOutsideClick)
		document.addEventListener('touchstart', handleOutsideClick)
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
			document.removeEventListener('touchstart', handleOutsideClick)
		}
	}, [activeSpec])

	const handleToggleSaved = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		toggleSaved(vehicle._id)
	}

	const handleSpecClick = (e: React.MouseEvent, id: string) => {
		e.preventDefault()
		e.stopPropagation()
		setActiveSpec(prev => (prev === id ? null : id))
	}

	return (
		<article
			key={vehicle._id}
			className='relative bg-card-bg backdrop-blur-xl border border-border-main rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 font-work-sans group z-0 hover:z-40 focus-within:z-40'
		>
			<div>
				{vehicle.images[0] && (
					<Link
						href={detailHref}
						aria-label={`View details for ${fullName}`}
						className='block relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-main-bg border border-border-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
					>
						<Image
							src={`${BASE_URL}${vehicle.images[0]}`}
							alt={fullName}
							fill
							loading='eager'
							className='object-contain p-3 transition-transform duration-500 group-hover:scale-105 select-none'
							unoptimized
						/>
					</Link>
				)}

				<div className='flex items-start justify-between gap-3 mt-4'>
					<div className='min-w-0 flex-1'>
						<Link
							href={detailHref}
							title={fullName}
							className='block focus-visible:outline-none focus-visible:underline'
						>
							<h2 className='text-base sm:text-lg font-bold text-text-main truncate hover:text-primary transition-colors select-text'>
								{fullName}
							</h2>
						</Link>

						<p className='text-xs sm:text-sm text-text-muted truncate mt-0.5 select-text'>
							{typeof vehicle.category === 'string'
								? vehicle.category
								: vehicle.category?.name || 'N/A'}
						</p>
					</div>

					<div className='flex flex-col items-end shrink-0 select-text'>
						<span className='text-base sm:text-lg font-bold text-primary leading-tight'>
							${vehicle.pricePerDay}
						</span>
						<span className='text-[11px] text-text-muted'>per day</span>
					</div>
				</div>

				<div
					ref={specsRef}
					className='mt-5 grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-ui-hover border border-border-main'
				>
					{specs.map(spec => {
						const isOpen = activeSpec === spec.id
						return (
							<button
								key={spec.id}
								type='button'
								onClick={e => handleSpecClick(e, spec.id)}
								onMouseLeave={() => {
									if (activeSpec === spec.id) setActiveSpec(null)
								}}
								aria-label={spec.aria}
								aria-expanded={isOpen}
								className={`relative flex items-center justify-center group/tip py-2 rounded-lg border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
									isOpen
										? 'bg-primary/15 border-primary/30 text-primary'
										: 'bg-card-bg hover:bg-primary/15 border-transparent hover:border-primary/30 text-text-muted hover:text-primary'
								}`}
							>
								<span className='transition-colors'>{spec.icon}</span>

								<span
									role='tooltip'
									className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card-bg text-text-main text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-xl border border-border-main whitespace-nowrap z-50 transition-all duration-200 pointer-events-none ${
										isOpen
											? 'opacity-100 scale-100'
											: 'opacity-0 scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100 group-focus-visible/tip:opacity-100 group-focus-visible/tip:scale-100'
									}`}
								>
									{spec.label}
								</span>
							</button>
						)
					})}
				</div>
			</div>

			<div className='mt-5 flex items-center gap-2'>
				<Link
					href={detailHref}
					className='flex-1 py-3 flex items-center justify-center bg-primary hover:bg-primary-hover active:scale-[0.98] rounded-xl text-card-bg transition-all font-inter font-semibold text-sm shadow-md shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'
				>
					View Details
				</Link>

				<button
					type='button'
					onClick={handleToggleSaved}
					disabled={isSaving}
					aria-label={isSaved ? 'Remove from saved' : 'Add to saved'}
					aria-pressed={isSaved}
					className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 ${
						isSaved
							? 'bg-primary/15 border-primary/40 text-primary'
							: 'bg-ui-hover hover:bg-ui-active border-border-main text-text-muted hover:text-primary'
					}`}
				>
					<Heart
						className={`w-5 h-5 transition-transform duration-200 ${
							isSaved ? 'fill-primary scale-110' : ''
						} ${isSaving ? 'animate-pulse' : ''}`}
					/>
				</button>
			</div>
		</article>
	)
}
