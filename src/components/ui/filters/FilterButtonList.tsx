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
}

export default function FilterButtonList({
	options,
	currentValue,
	onChange,
	allLabel = 'All',
	maxHeight = 'max-h-48',
	isLoading = false,
}: FilterButtonListProps) {
	return (
		<div className={`space-y-1 overflow-y-auto pr-1 text-sm ${maxHeight}`}>
			<button
				type='button'
				onClick={() => onChange('all')}
				className={`w-full cursor-pointer rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
					currentValue === 'all' || currentValue === ''
						? 'bg-primary/20 font-bold text-primary'
						: 'text-text-muted hover:bg-white/5 hover:text-text-main'
				}`}
			>
				{allLabel}
			</button>

			{isLoading ? (
				<div className='animate-pulse px-2.5 py-1.5 text-xs text-text-subtle'>
					Loading...
				</div>
			) : (
				options.map(option => (
					<button
						key={option.id}
						type='button'
						onClick={() => onChange(option.id)}
						className={`w-full cursor-pointer rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
							currentValue === option.id
								? 'bg-primary/20 font-bold text-primary'
								: 'text-text-muted hover:bg-white/5 hover:text-text-main'
						}`}
					>
						{option.label}
					</button>
				))
			)}
		</div>
	)
}
