'use client'

import { useState } from 'react'

interface Option {
	id: string
	label: string
}

interface FilterButtonListProps {
	options: Option[]
	currentValue: string
	onChange: (value: string) => void
	allLabel?: string
	maxHeight?: string
	isLoading?: boolean
	limit?: number
}

export default function FilterButtonList({
	options,
	currentValue,
	onChange,
	allLabel = 'All',
	maxHeight = 'max-h-48',
	isLoading = false,
	limit = 5,
}: FilterButtonListProps) {
	const [showAll, setShowAll] = useState(false)

	const selectedValues =
		!currentValue || currentValue === 'all'
			? []
			: currentValue
					.split(',')
					.map(v => v.trim())
					.filter(Boolean)

	const isAllChecked =
		selectedValues.length === 0 || currentValue === 'all' || currentValue === ''

	const handleAllChange = () => {
		onChange('all')
	}

	const handleOptionChange = (id: string) => {
		let updated: string[]
		if (selectedValues.includes(id)) {
			updated = selectedValues.filter(v => v !== id)
		} else {
			updated = [...selectedValues, id]
		}
		onChange(updated.length === 0 ? 'all' : updated.join(','))
	}

	const visibleOptions = options.slice(0, limit)
	const hiddenOptions = options.slice(limit)
	const hiddenCount = hiddenOptions.length

	return (
		<div className={`space-y-2.5 overflow-y-auto pr-1 text-sm ${maxHeight}`}>
			<label className='flex items-center gap-3 cursor-pointer group select-none'>
				<div className='relative flex items-center justify-center'>
					<input
						type='checkbox'
						checked={isAllChecked}
						onChange={handleAllChange}
						className='peer sr-only'
					/>
					<div
						className='w-4 h-4 rounded border border-border-strong bg-card-bg transition-all duration-200 
						peer-checked:bg-primary peer-checked:border-primary
						group-hover:border-border-strong peer-focus-visible:ring-2 peer-focus-visible:ring-text-main/20'
					/>
					<svg
						className='absolute w-2.5 h-2.5 text-white scale-0 transition-transform duration-200 peer-checked:scale-100 pointer-events-none'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={3.5}
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M4.5 12.75l6 6 9-13.5'
						/>
					</svg>
				</div>
				<span
					className={`text-sm transition-colors duration-200 group-hover:text-text-main ${
						isAllChecked ? 'font-semibold text-text-main' : 'text-text-muted'
					}`}
				>
					{allLabel}
				</span>
			</label>

			{isLoading ? (
				<div className='animate-pulse px-2.5 py-1.5 text-xs text-text-subtle'>
					Loading...
				</div>
			) : (
				<>
					{visibleOptions.map(option => {
						const isChecked = selectedValues.includes(option.id)
						return (
							<label
								key={option.id}
								className='flex items-center gap-3 cursor-pointer group select-none'
							>
								<div className='relative flex items-center justify-center'>
									<input
										type='checkbox'
										checked={isChecked}
										onChange={() => handleOptionChange(option.id)}
										className='peer sr-only'
									/>
									<div
										className='w-4 h-4 rounded border border-border-strong bg-card-bg transition-all duration-200 
										peer-checked:bg-primary peer-checked:border-primary
										group-hover:border-border-strong peer-focus-visible:ring-2 peer-focus-visible:ring-text-main/20'
									/>
									<svg
										className='absolute w-2.5 h-2.5 text-white scale-0 transition-transform duration-200 peer-checked:scale-100 pointer-events-none'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										strokeWidth={3.5}
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M4.5 12.75l6 6 9-13.5'
										/>
									</svg>
								</div>
								<span
									className={`text-sm transition-colors duration-200 group-hover:text-text-main ${
										isChecked
											? 'font-semibold text-text-main'
											: 'text-text-muted'
									}`}
								>
									{option.label}
								</span>
							</label>
						)
					})}

					{hiddenCount > 0 && (
						<>
							<div
								className={`grid transition-all duration-300 ease-in-out ${showAll ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
							>
								<div className='overflow-hidden space-y-2.5 pt-2.5'>
									{hiddenOptions.map(option => {
										const isChecked = selectedValues.includes(option.id)
										return (
											<label
												key={option.id}
												className='flex items-center gap-3 cursor-pointer group select-none'
											>
												<div className='relative flex items-center justify-center'>
													<input
														type='checkbox'
														checked={isChecked}
														onChange={() => handleOptionChange(option.id)}
														className='peer sr-only'
													/>
													<div
														className='w-4 h-4 rounded border border-border-strong bg-card-bg transition-all duration-200 
														peer-checked:bg-primary peer-checked:border-primary
														group-hover:border-border-strong peer-focus-visible:ring-2 peer-focus-visible:ring-text-main/20'
													/>
													<svg
														className='absolute w-2.5 h-2.5 text-white scale-0 transition-transform duration-200 peer-checked:scale-100 pointer-events-none'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'
														strokeWidth={3.5}
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															d='M4.5 12.75l6 6 9-13.5'
														/>
													</svg>
												</div>
												<span
													className={`text-sm transition-colors duration-200 group-hover:text-text-main ${
														isChecked
															? 'font-semibold text-text-main'
															: 'text-text-muted'
													}`}
												>
													{option.label}
												</span>
											</label>
										)
									})}
								</div>
							</div>

							<button
								type='button'
								onClick={() => setShowAll(!showAll)}
								className='flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-2 cursor-pointer select-none'
							>
								<span>
									{showAll ? 'Show less' : `Show ${hiddenCount} more`}
								</span>
								<svg
									className={`w-3 h-3 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
									strokeWidth={2.5}
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M19 9l-7 7-7-7'
									/>
								</svg>
							</button>
						</>
					)}
				</>
			)}
		</div>
	)
}
