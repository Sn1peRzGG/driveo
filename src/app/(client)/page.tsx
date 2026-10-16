'use client'

import HeroSection from '@/src/components/HeroSection'
import InfoSection from '@/src/components/InfoSection'
import CalendarInput from '@/src/components/ui/CalendarInput'
import DropdownInput from '@/src/components/ui/DropdownInput'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
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
		<>
			<div className='w-full flex flex-col items-center px-4'>
				<div className='container-responsive'>
					<HeroSection />
					<InfoSection />
				</div>
			</div>
		</>
	)
}
