'use client'

import CalendarInput from '@/src/components/ui/CalendarInput'
import DropdownInput, {
	DropdownOption,
} from '@/src/components/ui/DropdownInput'
import api from '@/src/lib/api'
import { Category } from '@/src/types/category'
import { City } from '@/src/types/city'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function HeroSection() {
	const router = useRouter()

	const [carType, setCarType] = useState<string>('')
	const [placeOfRental, setPlaceOfRental] = useState<string>('')
	const [placeOfReturn, setPlaceOfReturn] = useState<string>('')
	const [rentalDate, setRentalDate] = useState<string>('')
	const [returnDate, setReturnDate] = useState<string>('')

	const { data: categories = [] } = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await api.get('/categories')
			return res.data.data
		},
		staleTime: 1000 * 60 * 10,
	})

	const { data: locations = [] } = useQuery<City[]>({
		queryKey: ['vehicle-cities'],
		queryFn: async () => {
			const res = await api.get('/cities')
			return res.data.data
		},
		staleTime: 1000 * 60 * 10,
	})

	const categoryOptions: DropdownOption[] = categories.map(cat => ({
		label: cat.name,
		value: cat._id,
	}))

	const cityOptions: DropdownOption[] = locations.map(city => ({
		label: city.name,
		value: city._id,
	}))

	const handleSearch = () => {
		if (!placeOfRental || !rentalDate || !returnDate) {
			toast.error('Please fill in all required fields.')
			return
		}

		if (rentalDate >= returnDate) {
			toast.error('Return date must be after rental date.')
			return
		}

		const params = new URLSearchParams()

		if (carType) params.set('category', carType)
		params.set('city', placeOfRental)

		if (placeOfReturn) params.set('returnCity', placeOfReturn)

		params.set('rentalDate', rentalDate)
		params.set('returnDate', returnDate)

		router.push(`/vehicles?${params.toString()}`)
	}

	return (
		<div className='rounded-[30px] xl:rounded-[40px] h-auto xl:h-165 bg-primary relative p-6 sm:p-10 xl:p-20 shadow-lg transition-colors duration-200'>
			<Image
				src='/skid_marks.png'
				alt='Skid Marks'
				fill
				style={{ objectFit: 'cover' }}
				className='z-0 pointer-events-none rounded-[30px] xl:rounded-[40px]'
				loading='eager'
			/>

			<Image
				src='/explore_cars.png'
				alt='Explore Cars'
				loading='eager'
				width={700}
				height={400}
				className='absolute bottom-0 left-1/2 -translate-x-1/2 xl:translate-x-0 xl:left-1/3 w-3/4 xl:w-1/2 h-auto object-cover z-0 pointer-events-none blur-sm'
			/>

			<div className='flex flex-col xl:flex-row items-center justify-between h-full relative z-10 gap-12 xl:gap-0'>
				<div className='h-full w-full xl:w-[60%] pt-6 xl:pt-22 relative z-10 font-work-sans text-white flex flex-col gap-5 xl:gap-7 text-center xl:text-left items-center xl:items-start'>
					<h1 className='font-bold text-4xl sm:text-5xl xl:text-6xl max-w-full xl:max-w-4/5 leading-tight'>
						Experience the road like never before
					</h1>
					<p className='font-normal text-[15px] xl:text-[16px] max-w-full xl:max-w-2/3 text-white/90'>
						Choose from our fleet of top-tier cars tailored for any travel
						style. Enjoy a seamless rental experience with easy pickup and 24/7
						support.
					</p>
					<Link
						href='/vehicles'
						className='h-10 w-40 cursor-pointer px-7 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl flex items-center justify-center font-semibold text-[16px] transition-colors duration-200 font-inter shadow-md'
					>
						View all cars
					</Link>
				</div>

				<div className='h-full w-full xl:w-1/3 bg-card-bg text-text-main rounded-[20px] shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-between gap-5 relative z-10 border border-border-main transition-colors duration-200'>
					<h2 className='font-work-sans font-semibold text-[24px] xl:text-[28px] text-center text-main'>
						Book your car
					</h2>
					<div className='w-full flex flex-col gap-4 xl:gap-5 overflow-visible'>
						<div className='relative z-50'>
							<DropdownInput
								label='Car type'
								options={categoryOptions}
								selected={carType}
								onSelect={setCarType}
							/>
						</div>
						<div className='relative z-40'>
							<DropdownInput
								label='Place of rental'
								options={cityOptions}
								selected={placeOfRental}
								onSelect={setPlaceOfRental}
							/>
						</div>
						<div className='relative z-30'>
							<DropdownInput
								label='Place of return'
								options={cityOptions}
								selected={placeOfReturn}
								onSelect={setPlaceOfReturn}
							/>
						</div>
						<div className='relative z-20'>
							<CalendarInput
								label='Rental date'
								selectedDate={rentalDate}
								onSelectDate={setRentalDate}
							/>
						</div>
						<div className='relative z-10'>
							<CalendarInput
								label='Return date'
								selectedDate={returnDate}
								onSelectDate={setReturnDate}
							/>
						</div>
					</div>
					<button
						type='button'
						className='w-full rounded-xl bg-accent hover:bg-accent-hover text-white font-inter font-semibold text-[16px] transition-colors duration-200 px-7 py-3 cursor-pointer shadow-md mt-2'
						onClick={handleSearch}
					>
						Book now
					</button>
				</div>
			</div>
		</div>
	)
}
