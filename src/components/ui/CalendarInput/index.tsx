'use client'

import {
	Calendar as CalendarIcon,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface CalendarInputProps {
	label: string
	selectedDate: string
	onSelectDate: (date: string) => void
}

export default function CalendarInput({
	label,
	selectedDate,
	onSelectDate,
}: CalendarInputProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [currentMonth, setCurrentMonth] = useState(new Date())
	const calendarRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				calendarRef.current &&
				!calendarRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const getDaysInMonth = (year: number, month: number) =>
		new Date(year, month + 1, 0).getDate()

	const getFirstDayOfMonth = (year: number, month: number) => {
		const day = new Date(year, month, 1).getDay()
		return day === 0 ? 6 : day - 1
	}

	const year = currentMonth.getFullYear()
	const month = currentMonth.getMonth()
	const daysInMonth = getDaysInMonth(year, month)
	const firstDay = getFirstDayOfMonth(year, month)

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const handleDateSelect = (day: number) => {
		const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
		onSelectDate(formattedDate)
		setIsOpen(false)
	}

	return (
		<div className='relative w-full' ref={calendarRef}>
			<div
				onClick={() => setIsOpen(!isOpen)}
				className='bg-main-bg rounded-xl h-10 text-[16px] font-work-sans font-normal text-text-main px-4 py-2 flex items-center justify-between cursor-pointer border border-border-main hover:border-border-strong transition-all'
			>
				<span className={selectedDate ? 'text-text-main' : 'text-text-subtle'}>
					{selectedDate || label}
				</span>
				<CalendarIcon className='w-4 h-4 text-text-muted' />
			</div>

			<div
				className={`absolute top-12 left-0 w-72 bg-card-bg border border-border-main rounded-xl shadow-2xl z-50 p-4 font-work-sans transition-all duration-200 origin-top ${
					isOpen
						? 'opacity-100 scale-100 pointer-events-auto'
						: 'opacity-0 scale-95 pointer-events-none'
				}`}
			>
				<div className='flex items-center justify-between mb-4'>
					<button
						type='button'
						onClick={e => {
							e.stopPropagation()
							setCurrentMonth(new Date(year, month - 1, 1))
						}}
						className='p-1 hover:bg-ui-hover rounded-lg text-text-main font-bold cursor-pointer transition-colors'
					>
						<ChevronLeft />
					</button>
					<span className='font-semibold text-[15px] text-text-main'>
						{monthNames[month]} {year}
					</span>
					<button
						type='button'
						onClick={e => {
							e.stopPropagation()
							setCurrentMonth(new Date(year, month + 1, 1))
						}}
						className='p-1 hover:bg-ui-hover rounded-lg text-text-main font-bold cursor-pointer transition-colors'
					>
						<ChevronRight />
					</button>
				</div>

				<div className='grid grid-cols-7 gap-1 text-center mb-2'>
					{dayNames.map(d => (
						<span key={d} className='text-[12px] font-medium text-text-muted'>
							{d}
						</span>
					))}
				</div>

				<div className='grid grid-cols-7 gap-1'>
					{Array.from({ length: firstDay }).map((_, index) => (
						<div key={`empty-${index}`} />
					))}
					{Array.from({ length: daysInMonth }).map((_, index) => {
						const day = index + 1
						const dateObj = new Date(year, month, day)
						dateObj.setHours(0, 0, 0, 0)

						const isPastDate = dateObj < today
						const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
						const isSelected = selectedDate === formattedDate

						return (
							<button
								key={day}
								type='button'
								disabled={isPastDate}
								onClick={e => {
									e.stopPropagation()
									if (!isPastDate) handleDateSelect(day)
								}}
								className={`h-8 w-8 rounded-lg text-[13px] flex items-center justify-center transition-colors ${
									isPastDate
										? 'text-text-subtle/30 cursor-not-allowed bg-transparent'
										: isSelected
											? 'bg-primary text-white font-semibold cursor-pointer'
											: 'text-text-main hover:bg-ui-hover cursor-pointer'
								}`}
							>
								{day}
							</button>
						)
					})}
				</div>
			</div>
		</div>
	)
}
