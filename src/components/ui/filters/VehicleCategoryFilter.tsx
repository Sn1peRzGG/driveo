'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import FilterButtonList from './FilterButtonList'
import FilterSection from './FilterSection'

export default function VehicleCategoryFilter() {
	const { getParam, setParam, meta } = useVehicles()
	const currentCategory = getParam('category') || 'all'

	const options = (meta?.options?.categories || []).map(category => ({
		id: category._id,
		label: category.name,
	}))

	return (
		<FilterSection title='Categories'>
			<FilterButtonList
				options={options}
				currentValue={currentCategory}
				onChange={val => setParam('category', val)}
				allLabel='All Categories'
			/>
		</FilterSection>
	)
}
