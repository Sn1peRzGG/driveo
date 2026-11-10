'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import FilterButtonList from './FilterButtonList'
import FilterSection from './FilterSection'

export default function VehicleFuelTypeFilter() {
	const { getParam, setParam, meta } = useVehicles()
	const currentFuelType = getParam('fuelType') || 'all'

	const options = (meta?.options?.fuelTypes || []).map(f => ({
		id: f,
		label: f.charAt(0) + f.slice(1).toLowerCase(),
	}))

	return (
		<FilterSection title='Fuel Type'>
			<FilterButtonList
				options={options}
				currentValue={currentFuelType}
				onChange={val => setParam('fuelType', val)}
				allLabel='All Fuel Types'
			/>
		</FilterSection>
	)
}
