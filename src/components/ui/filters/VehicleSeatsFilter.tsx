'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import FilterButtonList from './FilterButtonList'
import FilterSection from './FilterSection'

export default function VehicleSeatsFilter() {
	const { getParam, setParam, meta } = useVehicles()
	const currentSeats = getParam('seats') || 'all'

	const options = (meta?.options?.seats || []).map(s => ({
		id: String(s),
		label: `${s} Seats`,
	}))

	return (
		<FilterSection title='Seats'>
			<FilterButtonList
				options={options}
				currentValue={currentSeats}
				onChange={val => setParam('seats', val)}
				allLabel='Any Capacity'
			/>
		</FilterSection>
	)
}
