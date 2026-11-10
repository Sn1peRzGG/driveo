'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import FilterButtonList from './FilterButtonList'
import FilterSection from './FilterSection'

export default function VehicleCityFilter() {
	const { getParam, setParam, meta } = useVehicles()
	const currentCity = getParam('city') || 'all'

	const options = (meta?.options?.cities || []).map(city => ({
		id: city._id,
		label: city.name,
	}))

	return (
		<FilterSection title='City'>
			<FilterButtonList
				options={options}
				currentValue={currentCity}
				onChange={val => setParam('city', val)}
				allLabel='All Cities'
			/>
		</FilterSection>
	)
}
