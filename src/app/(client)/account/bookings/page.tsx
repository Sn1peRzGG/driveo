'use client'

import {
	bookingStatusMeta,
	bookingStatusStyles,
} from '@/constants/bookingStatus'
import Loading from '@/src/app/loading'
import BookingStatusBadge from '@/src/components/ui/BookingStatusBadge'
import ConfirmModal from '@/src/components/ui/ConfirmModal'
import api, { BASE_URL } from '@/src/lib/api'
import { Booking, BookingStatus } from '@/src/types/booking'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, Car, Loader2, MapPin, XCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function UserBookingsPage() {
	const queryClient = useQueryClient()

	const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)

	const { data: bookings = [], isLoading } = useQuery<Booking[]>({
		queryKey: ['user-bookings'],
		queryFn: async () => {
			const { data } = await api.get('/bookings/my')
			return data.data
		},
	})

	const cancelMutation = useMutation({
		mutationFn: async (bookingId: string) => {
			const { data } = await api.patch(`/bookings/${bookingId}/cancel`)
			return data.data
		},
		onSuccess: () => {
			toast.success('Booking cancelled successfully')
			queryClient.invalidateQueries({ queryKey: ['user-bookings'] })
			setBookingToCancel(null)
		},
		onError: (error: any) => {
			const errorMsg =
				error?.response?.data?.message || 'Failed to cancel booking'
			toast.error(errorMsg)
		},
	})

	if (isLoading) return <Loading />

	const safeBookings = Array.isArray(bookings) ? bookings : []

	const handleConfirmCancel = () => {
		if (bookingToCancel) {
			cancelMutation.mutate(bookingToCancel)
		}
	}

	const getStatusBadge = (status: BookingStatus) => {
		const style =
			bookingStatusStyles[status] ??
			'bg-ui-hover text-text-muted border-border-main'
		const meta = bookingStatusMeta[status]
		const Icon = meta?.icon

		return (
			<span
				className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${style}`}
			>
				{Icon && <Icon size={13} />}
				{meta?.label ?? status}
			</span>
		)
	}

	return (
		<div className='container-responsive p-6 max-w-5xl mx-auto'>
			<h1 className='text-3xl font-extrabold mb-8 tracking-tight text-text-main'>
				My Bookings
			</h1>

			{safeBookings.length > 0 ? (
				<div className='overflow-x-auto rounded-xl border border-border-main shadow-sm bg-card-bg'>
					<table className='w-full text-text-muted border-collapse table-fixed min-w-212.5'>
						<thead>
							<tr className='bg-ui-hover text-[14px] font-semibold text-text-muted uppercase tracking-wider border-b border-border-main'>
								<th className='py-4 pl-6 text-left w-[32%]'>Vehicle</th>
								<th className='py-4 text-center w-[38%]'>Rental Period</th>
								<th className='py-4 text-center w-[12%]'>Total</th>
								<th className='py-4 text-center pr-4 w-[18%]'>Actions</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-border-main'>
							{safeBookings.map(booking => {
								const vehicle = booking.vehicle || {}

								const brandName =
									typeof vehicle.brand === 'object' ? vehicle.brand?.name : ''

								const modelName =
									typeof vehicle.model === 'object' ? vehicle.model?.name : ''

								const fullName = `${brandName} ${modelName}`.trim() || 'Vehicle'

								const categoryName =
									typeof vehicle.category === 'object'
										? vehicle.category?.name
										: ''

								const imageSrc = vehicle.images?.[0]
									? `${BASE_URL}${vehicle.images[0]}`
									: null

								const pickupCityName =
									typeof booking.pickupCity === 'object'
										? booking.pickupCity?.name
										: 'City'

								const returnCityName =
									typeof booking.returnCity === 'object'
										? booking.returnCity?.name
										: 'City'

								const startDateFormatted = new Date(
									booking.startDate,
								).toLocaleDateString()

								const endDateFormatted = new Date(
									booking.endDate,
								).toLocaleDateString()

								const canCancel =
									booking.status === 'PENDING' || booking.status === 'CONFIRMED'

								const isCancelling =
									cancelMutation.isPending &&
									cancelMutation.variables === booking._id

								return (
									<tr
										key={booking._id}
										className='hover:bg-ui-hover/30 transition-colors'
									>
										<td className='py-5 px-6'>
											<div className='flex flex-row items-center overflow-hidden'>
												<div className='relative w-20 h-14 border border-border-main rounded-lg overflow-hidden bg-main-bg shrink-0 shadow-sm flex items-center justify-center'>
													{imageSrc ? (
														<Image
															src={imageSrc}
															alt={fullName}
															fill
															className='object-contain p-1.5 pointer-events-none'
															unoptimized
														/>
													) : (
														<Car className='w-6 h-6 text-text-subtle' />
													)}
												</div>

												<div className='ml-4 min-w-0 flex-1'>
													<Link
														href={`/vehicles/${vehicle._id}`}
														className='font-semibold text-text-main truncate block hover:text-primary transition-colors'
													>
														{fullName}
													</Link>

													{categoryName && (
														<p className='text-xs text-text-muted truncate mt-0.5'>
															{categoryName}
														</p>
													)}

													<div className='mt-1'>
														<BookingStatusBadge status={booking.status} />
													</div>
												</div>
											</div>
										</td>

										<td className='py-5 px-3 text-center'>
											<div className='flex flex-col items-center gap-1.5'>
												<div className='flex items-center gap-1.5 text-sm font-semibold text-text-main tabular-nums'>
													<Calendar
														size={14}
														className='text-primary shrink-0'
													/>
													{startDateFormatted} — {endDateFormatted}
												</div>

												<div className='flex items-center justify-center gap-1.5 text-xs text-text-muted'>
													<MapPin size={13} className='text-primary shrink-0' />
													<span className='truncate'>
														{pickupCityName} → {returnCityName}
													</span>
												</div>
											</div>
										</td>

										<td className='py-5 text-center tabular-nums font-semibold text-text-main'>
											${booking.totalPrice?.toFixed(2)}
											<span className='text-xs font-normal text-text-muted block'>
												total
											</span>
										</td>

										<td className='py-5 text-center'>
											<div className='flex items-center justify-center gap-2'>
												<Link
													href={`/vehicles/${vehicle._id}`}
													className='p-2 rounded-lg border text-text-subtle border-border-main bg-card-bg hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 active:scale-95 shadow-sm'
													title='View Vehicle'
												>
													<Car size={16} />
												</Link>

												{canCancel && (
													<button
														type='button'
														disabled={isCancelling}
														onClick={() => setBookingToCancel(booking._id)}
														className={`p-2 rounded-lg border transition-all duration-200 ${
															isCancelling
																? 'text-accent border-accent/20 bg-accent/10 opacity-70 cursor-not-allowed'
																: 'text-text-subtle border-border-main bg-card-bg hover:text-accent hover:border-accent/30 hover:bg-accent/5 cursor-pointer active:scale-95 shadow-sm'
														}`}
														title='Cancel Booking'
													>
														{isCancelling ? (
															<Loader2 size={16} className='animate-spin' />
														) : (
															<XCircle size={16} />
														)}
													</button>
												)}
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			) : (
				<div className='border-2 border-dashed border-border-main rounded-2xl py-24 px-4 text-center max-w-md mx-auto mt-12 bg-card-bg shadow-sm'>
					<div className='mx-auto w-16 h-16 bg-ui-hover rounded-full flex items-center justify-center text-text-subtle mb-4 shadow-sm'>
						<Car size={28} />
					</div>

					<h3 className='text-lg font-bold text-text-main mb-1'>
						No bookings yet
					</h3>

					<p className='text-text-muted text-sm mb-6 max-w-xs mx-auto'>
						You haven&apos;t made any vehicle bookings yet. Browse our fleet and
						find the perfect car for your next trip.
					</p>

					<Link
						href='/vehicles'
						className='inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-semibold text-sm py-2.5 px-6 rounded-xl transition-all shadow-sm active:scale-95'
					>
						Explore Fleet
					</Link>
				</div>
			)}

			<ConfirmModal
				isOpen={Boolean(bookingToCancel)}
				isLoading={cancelMutation.isPending}
				title='Cancel Booking'
				description='Are you sure you want to cancel this booking? This action cannot be undone.'
				confirmText='Yes, Cancel'
				cancelText='Keep Booking'
				variant='danger'
				onClose={() => setBookingToCancel(null)}
				onConfirm={handleConfirmCancel}
			/>
		</div>
	)
}
