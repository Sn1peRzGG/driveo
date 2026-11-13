'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import RangeSlider from '../RangeSlider'
import FilterSection from './FilterSection'

const DEFAULT_MIN = 0
const DEFAULT_MAX = 1000

export default function VehiclePriceRangeFilter() {
	const { getParam, setMultipleParams, meta } = useVehicles()

	const LIMIT_MIN =
		meta && 'minPrice' in meta && meta.minPrice !== undefined
			? Number(meta.minPrice)
			: DEFAULT_MIN
	const LIMIT_MAX =
		meta && 'maxPrice' in meta && meta.maxPrice !== undefined
			? Number(meta.maxPrice)
			: DEFAULT_MAX

	const rawMin = getParam('minPrice')
	const rawMax = getParam('maxPrice')

	let minPrice =
		rawMin !== null && !isNaN(Number(rawMin)) ? Number(rawMin) : LIMIT_MIN
	let maxPrice =
		rawMax !== null && !isNaN(Number(rawMax)) ? Number(rawMax) : LIMIT_MAX

	minPrice = Math.max(LIMIT_MIN, Math.min(minPrice, LIMIT_MAX))
	maxPrice = Math.max(LIMIT_MIN, Math.min(maxPrice, LIMIT_MAX))

	const isSliderDisabled = LIMIT_MIN === LIMIT_MAX

	const handleSliderCommit = ([minVal, maxVal]: [number, number]) => {
		setMultipleParams({
			minPrice: String(minVal),
			maxPrice: String(maxVal),
		})
	}

	return (
		<FilterSection title='Price Range'>
			<div className='pb-2 px-3'>
				{isSliderDisabled ? (
					<div className='mt-2 h-1 w-full rounded-full bg-gray-200' />
				) : (
					<RangeSlider
						type='price'
						min={LIMIT_MIN}
						max={LIMIT_MAX}
						step={1}
						value={[minPrice, maxPrice]}
						onValueCommitted={handleSliderCommit}
					/>
				)}
			</div>
		</FilterSection>
	)
}
