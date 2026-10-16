'use client'

import CalendarInput from '@/src/components/ui/CalendarInput'
import DropdownInput from '@/src/components/ui/DropdownInput'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function HeroSection() {
	const [carType, setCarType] = useState<string>('')
	const [placeOfRental, setPlaceOfRental] = useState<string>('')
	const [placeOfReturn, setPlaceOfReturn] = useState<string>('')
	const [rentalDate, setRentalDate] = useState<string>('')
	const [returnDate, setReturnDate] = useState<string>('')

	const carTypes = ['Sedan', 'SUV', 'Minivan', 'Cabriolet', 'Pickup']
	const locations = [
		'New York - JFK Airport',
		'Los Angeles - LAX',
		"Chicago - O'Hare",
		'Miami International',
		'San Francisco - SFO',
	]

	const handleBooking = () => {
		alert(
			`Booking Details:\n- Car Type: ${carType || 'Not selected'}\n- Pickup: ${placeOfRental || 'Not selected'}\n- Return: ${placeOfReturn || 'Not selected'}\n- Rental Date: ${rentalDate || 'Not selected'}\n- Return Date: ${returnDate || 'Not selected'}`,
		)
	}

	return (
		<div className='rounded-[30px] xl:rounded-[40px] h-auto xl:h-165 bg-primary relative p-6 sm:p-10 xl:p-20'>
			<Image
				src='/skid_marks.png'
				alt='Skid Marks'
				fill
				style={{ objectFit: 'cover' }}
				className='z-0 pointer-events-none rounded-[30px] xl:rounded-[40px] overflow-hidden'
				loading='eager'
			/>

			<Image
				src='/explore_cars.png'
				alt='Explore Cars'
				width={700}
				height={400}
				className='absolute bottom-0 left-1/2 -translate-x-1/2 xl:translate-x-0 xl:left-1/3 w-3/4 xl:w-1/2 h-auto object-cover z-0 pointer-events-none blur-sm opacity-60 xl:opacity-100'
			/>

			<div className='flex flex-col xl:flex-row items-center justify-between h-full relative z-10 gap-12 xl:gap-0'>
				<div className='h-full w-full xl:w-[60%] pt-6 xl:pt-22 relative z-10 font-work-sans text-white flex flex-col gap-5 xl:gap-7 text-center xl:text-left items-center xl:items-start'>
					<h1 className='font-bold text-4xl sm:text-5xl xl:text-6xl max-w-full xl:max-w-4/5 leading-tight'>
						Experience the road like never before
					</h1>
					<p className='font-normal text-[15px] xl:text-[16px] max-w-full xl:max-w-2/3'>
						Choose from our fleet of top-tier cars tailored for any travel
						style. Enjoy a seamless rental experience with easy pickup and 24/7
						support.
					</p>
					<Link
						href='/vehicles'
						className='h-10 w-40 cursor-pointer px-7 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl flex items-center justify-center font-semibold text-[16px] transition-all duration-300 font-inter'
					>
						View all cars
					</Link>
				</div>

				<div className='h-full w-full xl:w-1/3 bg-card-bg text-text-main rounded-[20px] shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-between gap-5 relative z-10'>
					<h2 className='font-work-sans font-semibold text-[24px] xl:text-[28px] text-center'>
						Book your car
					</h2>
					<div className='w-full flex flex-col gap-4 xl:gap-5 overflow-visible'>
						<DropdownInput
							label='Car type'
							options={carTypes}
							selected={carType}
							onSelect={setCarType}
						/>
						<DropdownInput
							label='Place of rental'
							options={locations}
							selected={placeOfRental}
							onSelect={setPlaceOfRental}
						/>
						<DropdownInput
							label='Place of return'
							options={locations}
							selected={placeOfReturn}
							onSelect={setPlaceOfReturn}
						/>
						<CalendarInput
							label='Rental date'
							selectedDate={rentalDate}
							onSelectDate={setRentalDate}
						/>
						<CalendarInput
							label='Return date'
							selectedDate={returnDate}
							onSelectDate={setReturnDate}
						/>
					</div>
					<button
						className='w-full rounded-xl bg-accent hover:bg-accent-hover text-white font-inter font-semibold text-[16px] transition-all duration-300 px-7 py-3 cursor-pointer'
						onClick={handleBooking}
					>
						Book now
					</button>
				</div>
			</div>
		</div>
	)
}
