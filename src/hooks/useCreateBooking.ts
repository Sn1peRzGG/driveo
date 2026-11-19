'use client'

import api from '@/src/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export interface CreateBookingPayload {
	vehicleId: string
	startDate: string
	endDate: string
	pickupCity: string
	returnCity: string
	phoneNumber: string
}

export interface BookingQuote {
	available: boolean
	pickupCity: string
	pickupCityName: string
	returnCity: string
	returnCityName: string
	rentalDays: number
	pricePerDay: number
	rentalSubtotal: number
	isOneWay: boolean
	oneWayFee: number
	totalPrice: number
	nextBooking: {
		startDate: string
		pickupCity: string
		pickupCityName: string
	} | null
	error: string | null
}

interface BookingQuoteParams {
	vehicleId: string
	startDate: string
	endDate: string
	returnCity?: string
}

export function useBookingQuote(params: BookingQuoteParams, enabled = true) {
	return useQuery<BookingQuote, AxiosError>({
		queryKey: [
			'booking-quote',
			params.vehicleId,
			params.startDate,
			params.endDate,
			params.returnCity ?? '',
		],
		queryFn: async () => {
			const { data } = await api.get('/bookings/quote', {
				params: {
					vehicleId: params.vehicleId,
					startDate: params.startDate,
					endDate: params.endDate,
					...(params.returnCity ? { returnCity: params.returnCity } : {}),
				},
			})
			return data.data ?? data
		},
		enabled:
			enabled &&
			Boolean(params.vehicleId) &&
			Boolean(params.startDate) &&
			Boolean(params.endDate),
		staleTime: 15_000,
		retry: 1,
	})
}

export function useCreateBooking() {
	const queryClient = useQueryClient()

	const bookingMutation = useMutation<
		any,
		AxiosError<any>,
		CreateBookingPayload
	>({
		mutationFn: async bookingData => {
			const { data } = await api.post('/bookings', bookingData)
			return data.data ?? data
		},
		onSuccess: async () => {
			toast.success('Booking created successfully!')
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['user-bookings'] }),
				queryClient.invalidateQueries({ queryKey: ['user-me'] }),
				queryClient.invalidateQueries({ queryKey: ['booking-quote'] }),
				queryClient.invalidateQueries({ queryKey: ['vehicle'] }),
			])
		},
		onError: error => {
			const message =
				error.response?.data?.message ||
				'Failed to create booking. Please try again.'
			toast.error(Array.isArray(message) ? message.join(', ') : message)
		},
	})

	return {
		createBooking: bookingMutation.mutate,
		createBookingAsync: bookingMutation.mutateAsync,
		isCreating: bookingMutation.isPending,
		error: bookingMutation.error,
		isError: bookingMutation.isError,
		reset: bookingMutation.reset,
	}
}
