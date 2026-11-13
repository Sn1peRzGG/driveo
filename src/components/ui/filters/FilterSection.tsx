'use client'

import { useState } from 'react'

interface FilterSectionProps {
	title: string
	children: React.ReactNode
}

export default function FilterSection({ title, children }: FilterSectionProps) {
	const [isOpen, setIsOpen] = useState(true)

	return (
		<div className='border-b border-white/10 pb-4 last:border-0 last:pb-0'>
			<button
				type='button'
				onClick={() => setIsOpen(!isOpen)}
				className='w-full flex items-center justify-between mb-2 px-1 text-left cursor-pointer group select-none'
			>
				<h4 className='text-[11px] font-bold uppercase tracking-wider text-text-muted group-hover:text-text-main transition-colors'>
					{title}
				</h4>
				<div
					className={`w-6 h-6 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
				>
					<svg
						className='w-3 h-3 text-text-muted'
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
				</div>
			</button>
			<div
				className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
			>
				<div className='overflow-hidden'>
					<div className='px-0.5'>{children}</div>
				</div>
			</div>
		</div>
	)
}
