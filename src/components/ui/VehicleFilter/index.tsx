'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import { RotateCcw } from 'lucide-react'
import VehicleBrandFilter from '../filters/VehicleBrandFilter'
import VehicleCategoryFilter from '../filters/VehicleCategoryFilter'
import VehicleCityFilter from '../filters/VehicleCityFilter'
import VehicleFuelTypeFilter from '../filters/VehicleFuelTypeFilter'
import VehiclePriceRangeFilter from '../filters/VehiclePriceRangeFilter'
import VehicleSeatsFilter from '../filters/VehicleSeatsFilter'
import VehicleTransmissionFilter from '../filters/VehicleTransmissionFilter'
import VehicleYearRangeFilter from '../filters/VehicleYearRangeFilter'

export default function VehicleFilter() {
	const { resetFilters } = useVehicles()

	return (
		<div className='font-work-sans bg-card-bg w-full max-h-[calc(100vh-200px)] overflow-y-auto space-y-6 rounded-xl border border-border-main p-4 shadow-sm pr-2'>
			<div className='sticky top-0 z-10 flex items-center justify-between rounded-lg border border-border-main/50 bg-card-bg/90 px-3 py-2 backdrop-blur-md shadow-xs'>
				<h3 className='text-sm font-bold uppercase tracking-wider text-text-main'>
					Filters
				</h3>

				<button
					type='button'
					onClick={resetFilters}
					className='group flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-text-muted transition-all duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer'
					title='Reset all filters'
				>
					<RotateCcw size={14} />
					<span>Reset</span>
				</button>
			</div>

			<VehicleCategoryFilter />
			<VehicleCityFilter />
			<VehicleBrandFilter />
			<VehiclePriceRangeFilter />
			<VehicleYearRangeFilter />
			<VehicleTransmissionFilter />
			<VehicleFuelTypeFilter />
			<VehicleSeatsFilter />
		</div>
	)
}
