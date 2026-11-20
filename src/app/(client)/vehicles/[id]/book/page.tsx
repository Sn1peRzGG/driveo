'use client'

import Loading from '@/src/app/loading'
import CalendarInput from '@/src/components/ui/CalendarInput'
import DropdownInput, {
	DropdownOption,
} from '@/src/components/ui/DropdownInput'
import { useBookingQuote, useCreateBooking } from '@/src/hooks/useCreateBooking'
import { useUser } from '@/src/hooks/useUser'
import api, { BASE_URL } from '@/src/lib/api'
import { City } from '@/src/types/city'
import { Vehicle } from '@/src/types/vehicle'
import { useQuery } from '@tanstack/react-query'
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	Car,
	CheckCircle2,
	Loader2,
	MapPin,
	Phone,
	ShieldCheck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { SubmitEvent, useEffect, useMemo, useState } from 'react'

export default function BookVehiclePage() {
	const params = useParams()
	const router = useRouter()
	const vehicleId = params.id as string

	const { data: user, isLoading: isUserLoading } = useUser()
	const { createBookingAsync, isCreating } = useCreateBooking()

	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [selectedReturnCity, setSelectedReturnCity] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [formError, setFormError] = useState<string | null>(null)

	useEffect(() => {
		if (user?.phoneNumber && !phoneNumber) {
			setPhoneNumber(user.phoneNumber)
		}
	}, [user, phoneNumber])

	const { data: vehicle, isLoading: isVehicleLoading } = useQuery<Vehicle>({
		queryKey: ['vehicle', vehicleId],
		queryFn: async () => {
			const { data } = await api.get(`/vehicles/${vehicleId}`)
			return data.data ?? data
		},
		enabled: Boolean(vehicleId),
	})

	const { data: cities = [], isLoading: isCitiesLoading } = useQuery<City[]>({
		queryKey: ['cities'],
		queryFn: async () => {
			const { data } = await api.get('/cities')
			return data.data ?? data
		},
		staleTime: 5 * 60 * 1000,
	})

	const quoteParams = useMemo(
		() => ({
			vehicleId,
			startDate,
			endDate,
			returnCity: selectedReturnCity || undefined,
		}),
		[vehicleId, startDate, endDate, selectedReturnCity],
	)

	const {
		data: quote,
		isLoading: isQuoteLoading,
		isFetching: isQuoteFetching,
		isError: isQuoteError,
		error: quoteError,
		refetch: refetchQuote,
	} = useBookingQuote(quoteParams, Boolean(vehicle))

	useEffect(() => {
		if (quote?.pickupCity && !selectedReturnCity) {
			setSelectedReturnCity(quote.pickupCity)
		}
	}, [quote?.pickupCity, selectedReturnCity])

	const cityOptions: DropdownOption[] = useMemo(
		() =>
			cities.map(city => ({
				label: city.name,
				value: city._id,
			})),
		[cities],
	)

	const brandName =
		typeof vehicle?.brand === 'object' ? vehicle.brand?.name : ''
	const modelName =
		typeof vehicle?.model === 'object' ? vehicle.model?.name : ''
	const fullName = `${brandName} ${modelName}`.trim() || 'Vehicle'
	const imageSrc = vehicle?.images?.[0]
		? `${BASE_URL}${vehicle.images[0]}`
		: null

	const dateRangeValid =
		Boolean(startDate) &&
		Boolean(endDate) &&
		new Date(`${endDate}T00:00:00.000Z`).getTime() >=
			new Date(`${startDate}T00:00:00.000Z`).getTime()

	const quoteIsReady =
		Boolean(quote) &&
		!isQuoteLoading &&
		!isQuoteFetching &&
		dateRangeValid &&
		Boolean(quote?.pickupCity)

	const handleStartDateChange = (value: string) => {
		setFormError(null)
		setStartDate(value)
	}

	const handleEndDateChange = (value: string) => {
		setFormError(null)
		setEndDate(value)
	}

	const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()
		setFormError(null)

		if (!startDate || !endDate || !phoneNumber.trim()) {
			setFormError('Please complete all required fields.')
			return
		}

		if (!dateRangeValid) {
			setFormError('The end date cannot be earlier than the start date.')
			return
		}

		if (!quote?.pickupCity || !quote.returnCity) {
			setFormError('Please wait for the booking details to finish loading.')
			return
		}

		if (!quote.available) {
			setFormError(
				quote.error ||
					'This vehicle is not available for the selected dates and route.',
			)
			return
		}

		try {
			await createBookingAsync({
				vehicleId,
				startDate,
				endDate,
				pickupCity: quote.pickupCity,
				returnCity: quote.returnCity,
				phoneNumber: phoneNumber.trim(),
			})
			router.push('/account/bookings')
		} catch (error: any) {
			const message = error?.response?.data?.message
			setFormError(
				Array.isArray(message)
					? message.join(', ')
					: message || 'Failed to create booking. Please try again.',
			)
		}
	}

	if (isUserLoading || isVehicleLoading) return <Loading />
	if (!vehicle) return null

	const categoryName =
		typeof vehicle.category === 'object'
			? vehicle.category?.name
			: vehicle.category

	const quoteErrorMessage =
		(quoteError as any)?.response?.data?.message ||
		'Unable to calculate availability. Please try again.'

	return (
		<div className='container-responsive mx-auto max-w-5xl px-4 py-10 font-work-sans'>
			<Link
				href={`/vehicles/${vehicleId}`}
				className='group mb-6 inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-primary'
			>
				<ArrowLeft
					size={16}
					className='transition-transform group-hover:-translate-x-1'
				/>
				Back to Vehicle
			</Link>

			<div className='mb-8'>
				<h1 className='text-3xl font-extrabold tracking-tight text-text-main'>
					Complete Your Booking
				</h1>
				<p className='mt-1 text-sm text-text-muted'>
					Choose your rental dates and return location. Availability and pricing
					are checked against the vehicle&apos;s booking schedule.
				</p>
			</div>

			{formError && (
				<div className='mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500'>
					<AlertCircle size={20} className='shrink-0' />
					<span>{formError}</span>
				</div>
			)}

			<div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-12'>
				<form
					onSubmit={handleSubmit}
					className='space-y-6 rounded-2xl border border-border-main bg-card-bg p-6 shadow-lg backdrop-blur-xl sm:p-8 lg:col-span-7'
				>
					<section className='space-y-4'>
						<h2 className='flex items-center gap-2 text-lg font-bold text-text-main'>
							<Calendar size={18} className='text-primary' />
							Rental Dates
						</h2>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<div>
								<label className='mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted'>
									Start Date
								</label>
								<CalendarInput
									label='Select start date'
									selectedDate={startDate}
									onSelectDate={handleStartDateChange}
								/>
							</div>
							<div>
								<label className='mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted'>
									End Date
								</label>
								<CalendarInput
									label='Select end date'
									selectedDate={endDate}
									onSelectDate={handleEndDateChange}
								/>
							</div>
						</div>
						<p className='text-xs text-text-muted'>
							The selected end date is included in the rental period.
						</p>
					</section>

					<section className='space-y-4 border-t border-border-main pt-4'>
						<h2 className='flex items-center gap-2 text-lg font-bold text-text-main'>
							<MapPin size={18} className='text-primary' />
							Locations
						</h2>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<div>
								<label className='mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted'>
									Pickup City
								</label>
								<DropdownInput
									label='Select rental dates'
									options={cityOptions}
									selected={quote?.pickupCity || ''}
									onSelect={() => {}}
									disabled
								/>
								<p className='mt-1 text-xs text-text-muted'>
									Automatically determined from the vehicle schedule.
								</p>
							</div>
							<div>
								<label className='mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted'>
									Return City
								</label>
								<DropdownInput
									label='Select return city'
									options={cityOptions}
									selected={selectedReturnCity || quote?.pickupCity || ''}
									onSelect={value => {
										setFormError(null)
										setSelectedReturnCity(value)
									}}
								/>
								{isCitiesLoading && (
									<p className='mt-1 text-xs text-text-muted'>
										Loading cities...
									</p>
								)}
							</div>
						</div>

						{quote?.nextBooking && (
							<div className='rounded-xl border border-border-main bg-ui-hover/60 p-3 text-sm'>
								<p className='font-semibold text-text-main'>
									Next scheduled booking
								</p>
								<p className='mt-1 text-text-muted'>
									{new Date(quote.nextBooking.startDate).toLocaleDateString()} ·
									Pickup in {quote.nextBooking.pickupCityName}
								</p>
								<p className='mt-1 text-xs text-text-muted'>
									Your return city must match this booking&apos;s pickup city.
								</p>
							</div>
						)}

						{quote?.error && (
							<div className='flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-600'>
								<AlertCircle size={16} className='mt-0.5 shrink-0' />
								<span>{quote.error}</span>
							</div>
						)}
					</section>

					<section className='space-y-4 border-t border-border-main pt-4'>
						<h2 className='flex items-center gap-2 text-lg font-bold text-text-main'>
							<Phone size={18} className='text-primary' />
							Contact Information
						</h2>
						<div>
							<label className='mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted'>
								Phone Number
							</label>
							<input
								type='tel'
								value={phoneNumber}
								onChange={event => setPhoneNumber(event.target.value)}
								required
								autoComplete='tel'
								placeholder='+49 171 1234567'
								className='h-12 w-full rounded-xl border border-border-main bg-main-bg px-4 text-[15px] text-text-main transition-colors focus:border-primary focus:outline-none'
							/>
						</div>
					</section>

					{isQuoteError && (
						<div className='flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500'>
							<span>{quoteErrorMessage}</span>
							<button
								type='button'
								onClick={() => refetchQuote()}
								className='font-bold underline'
							>
								Retry
							</button>
						</div>
					)}

					<button
						type='submit'
						disabled={
							isCreating ||
							isQuoteLoading ||
							isQuoteFetching ||
							!quoteIsReady ||
							!quote?.available ||
							!phoneNumber.trim()
						}
						className='mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50'
					>
						{isCreating ? (
							<>
								<Loader2 size={20} className='animate-spin' />
								Processing Booking...
							</>
						) : isQuoteLoading || isQuoteFetching ? (
							<>
								<Loader2 size={20} className='animate-spin' />
								Checking Availability...
							</>
						) : (
							'Confirm & Place Booking'
						)}
					</button>
				</form>

				<aside className='space-y-5 rounded-2xl border border-border-main bg-card-bg p-6 shadow-lg backdrop-blur-xl sm:p-7 lg:sticky lg:top-6 lg:col-span-5'>
					<h2 className='flex items-center justify-between border-b border-border-main pb-4 text-lg font-bold text-text-main'>
						<span>Rental Summary</span>
						<ShieldCheck size={20} className='text-primary' />
					</h2>

					<div className='relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-border-main bg-main-bg'>
						{imageSrc ? (
							<Image
								src={imageSrc}
								alt={fullName}
								fill
								className='object-cover transition-transform duration-300 hover:scale-105'
								unoptimized
							/>
						) : (
							<Car size={36} className='text-text-subtle' />
						)}
					</div>

					<div>
						<h3 className='text-lg font-extrabold text-text-main'>
							{fullName}
						</h3>
						<p className='mt-0.5 text-xs font-medium uppercase tracking-wider text-text-muted'>
							{categoryName}
						</p>
					</div>

					<div className='space-y-3 border-t border-border-main pt-4 text-sm text-text-muted'>
						<div className='flex items-center justify-between'>
							<span>Rate per day:</span>
							<span className='font-bold text-text-main'>
								${(quote?.pricePerDay ?? vehicle.pricePerDay ?? 0).toFixed(2)}
							</span>
						</div>
						<div className='flex items-center justify-between'>
							<span>Rental duration:</span>
							<span className='font-bold text-text-main'>
								{quote?.rentalDays ?? '—'}{' '}
								{quote?.rentalDays === 1 ? 'day' : 'days'}
							</span>
						</div>
						<div className='flex items-center justify-between'>
							<span>Rental subtotal:</span>
							<span className='font-bold text-text-main'>
								${(quote?.rentalSubtotal ?? 0).toFixed(2)}
							</span>
						</div>
						{quote?.isOneWay && (
							<div className='flex items-center justify-between font-medium text-primary'>
								<span>One-way fee:</span>
								<span className='font-bold'>${quote.oneWayFee.toFixed(2)}</span>
							</div>
						)}
					</div>

					<div className='flex items-center justify-between rounded-xl border-t border-border-main bg-ui-hover/50 p-4 pt-4'>
						<span className='text-base font-bold text-text-main'>
							Estimated Total:
						</span>
						<span className='text-2xl font-black text-primary'>
							${(quote?.totalPrice ?? 0).toFixed(2)}
						</span>
					</div>

					{quote?.available && (
						<p className='flex items-center gap-2 text-xs font-medium text-green-600'>
							<CheckCircle2 size={15} />
							Vehicle and route are currently available.
						</p>
					)}
					{!quote && dateRangeValid && (
						<p className='text-xs text-text-muted'>
							Choose your dates to calculate availability and the final
							estimated price.
						</p>
					)}
				</aside>
			</div>
		</div>
	)
}
