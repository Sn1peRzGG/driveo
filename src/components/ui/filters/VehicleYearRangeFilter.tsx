'use client'

import { useVehicles } from '@/src/hooks/useVehicles'
import RangeSlider from '../RangeSlider'
import FilterSection from './FilterSection'

const DEFAULT_MIN_YEAR = 2000
const DEFAULT_MAX_YEAR = new Date().getFullYear()

export default function VehicleYearRangeFilter() {
	const { getParam, setMultipleParams, meta } = useVehicles()

	const LIMIT_MIN =
		meta && 'minYear' in meta && meta.minYear !== undefined
			? Number(meta.minYear)
			: DEFAULT_MIN_YEAR
	const LIMIT_MAX =
		meta && 'maxYear' in meta && meta.maxYear !== undefined
			? Number(meta.maxYear)
			: DEFAULT_MAX_YEAR

	const rawMin = getParam('minYear')
	const rawMax = getParam('maxYear')

	let minYear =
		rawMin !== null && !isNaN(Number(rawMin)) ? Number(rawMin) : LIMIT_MIN
	let maxYear =
		rawMax !== null && !isNaN(Number(rawMax)) ? Number(rawMax) : LIMIT_MAX

	minYear = Math.max(LIMIT_MIN, Math.min(minYear, LIMIT_MAX))
	maxYear = Math.max(LIMIT_MIN, Math.min(maxYear, LIMIT_MAX))

	const isSliderDisabled = LIMIT_MIN === LIMIT_MAX

	const handleSliderCommit = ([minVal, maxVal]: [number, number]) => {
		setMultipleParams({
			minYear: String(minVal),
			maxYear: String(maxVal),
		})
	}

	return (
		<FilterSection title='Year of Production'>
			<div className='pb-2'>
				{isSliderDisabled ? (
					<div className='mt-2 h-1 w-full rounded-full bg-white/10' />
				) : (
					<RangeSlider
						type='year'
						min={LIMIT_MIN}
						max={LIMIT_MAX}
						step={1}
						value={[minYear, maxYear]}
						onValueCommitted={handleSliderCommit}
					/>
				)}
			</div>
		</FilterSection>
	)
}
