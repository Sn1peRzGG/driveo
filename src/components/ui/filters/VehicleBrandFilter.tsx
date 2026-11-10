'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import FilterButtonList from './FilterButtonList'
import FilterSection from './FilterSection'

export default function VehicleBrandFilter() {
	const { getParam, setParam, meta } = useVehicles()
	const currentBrand = getParam('brand') || 'all'

	const options = (meta?.options?.brands || []).map(brand => ({
		id: brand,
		label: brand,
	}))

	return (
		<FilterSection title='Brand'>
			<FilterButtonList
				options={options}
				currentValue={currentBrand}
				onChange={val => setParam('brand', val)}
				allLabel='All Brands'
			/>
		</FilterSection>
	)
}
