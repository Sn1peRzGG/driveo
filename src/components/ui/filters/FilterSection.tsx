interface FilterSectionProps {
	title: string
	children: React.ReactNode
}

export default function FilterSection({ title, children }: FilterSectionProps) {
	return (
		<div className='border-b border-white/10 pb-4 last:border-0 last:pb-0'>
			<h4 className='mb-2 select-none text-[11px] font-bold uppercase tracking-wider text-text-muted px-1'>
				{title}
			</h4>
			<div className='px-0.5'>{children}</div>
		</div>
	)
}
