'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import FilterButtonList from './FilterButtonList'
import FilterSection from './FilterSection'

export default function VehicleTransmissionFilter() {
	const { getParam, setParam, meta } = useVehicles()
	const currentTransmission = getParam('transmission') || 'all'

	const options = (meta?.options?.transmissions || []).map(t => ({
		id: t,
		label: t.charAt(0) + t.slice(1).toLowerCase(),
	}))

	return (
		<FilterSection title='Transmission'>
			<FilterButtonList
				options={options}
				currentValue={currentTransmission}
				onChange={val => setParam('transmission', val)}
				allLabel='All Transmissions'
			/>
		</FilterSection>
	)
}
