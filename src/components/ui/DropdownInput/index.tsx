'use client'

import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface DropdownInputProps {
	label: string
	options: string[]
	selected: string
	onSelect: (value: string) => void
}

export default function DropdownInput({
	label,
	options = [],
	selected,
	onSelect,
}: DropdownInputProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const dropdownRef = useRef<HTMLDivElement>(null)

	const filteredOptions = options.filter(item =>
		item.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div className='relative w-full' ref={dropdownRef}>
			<div
				onClick={() => setIsOpen(!isOpen)}
				className='bg-main-bg rounded-xl h-10 text-[16px] font-work-sans font-normal text-text-main px-4 py-2 flex items-center justify-between cursor-pointer border border-border-main hover:border-border-strong transition-all'
			>
				<span className={selected ? 'text-text-main' : 'text-text-subtle'}>
					{selected || label}
				</span>
				<ChevronDown
					className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
				/>
			</div>

			<div
				className={`absolute top-12 left-0 w-full bg-card-bg border border-border-main rounded-xl shadow-xl z-50 overflow-hidden flex flex-col transition-all duration-200 origin-top ${
					isOpen
						? 'opacity-100 scale-100 pointer-events-auto'
						: 'opacity-0 scale-95 pointer-events-none'
				}`}
			>
				<div className='p-2 border-b border-border-main flex items-center gap-2 bg-main-bg'>
					<Search className='w-4 h-4 text-text-muted ml-1' />
					<input
						type='text'
						placeholder={`Search ${label.toLowerCase()}...`}
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='w-full bg-transparent text-text-main text-sm outline-none font-work-sans'
						autoFocus
					/>
				</div>
				<div className='max-h-48 overflow-y-auto'>
					{filteredOptions.length > 0 ? (
						filteredOptions.map((option, index) => (
							<div
								key={index}
								onClick={() => {
									onSelect(option)
									setIsOpen(false)
									setSearchQuery('')
								}}
								className='px-4 py-2.5 text-sm text-text-main hover:bg-ui-hover cursor-pointer font-work-sans transition-colors'
							>
								{option}
							</div>
						))
					) : (
						<div className='px-4 py-3 text-sm text-text-subtle text-center font-work-sans'>
							No results found
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
