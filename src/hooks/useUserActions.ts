'use client'

import { useUser } from '@/src/hooks/useUser'
import { User } from '@/src/types/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'

type LoadingState = Record<string, 'saved' | 'booking' | 'cancel' | 'checkout'>

export interface CreateBookingPayload {
	vehicleId: string
	startDate: string
	endDate: string
	pickupCity: string
	returnCity: string
	phoneNumber: string
}

export function useUserActions() {
	const queryClient = useQueryClient()

	const { data: user, isLoading } = useUser() as {
		data: User
		isLoading: boolean
	}

	const [loadingStates, setLoadingStates] = useState<LoadingState>({})

	const toggleSavedMutation = useMutation({
		mutationFn: async (vehicleId: string) => {
			const { data } = await api.post(`/users/saved/${vehicleId}`)
			return data.data
		},
		onSuccess: newSavedVehicles => {
			queryClient.setQueryData(['user-me'], (oldUser: User) => {
				if (!oldUser) return oldUser
				return { ...oldUser, savedVehicles: newSavedVehicles }
			})
		},
	})

	const createBookingMutation = useMutation({
		mutationFn: async (bookingData: CreateBookingPayload) => {
			const { data } = await api.post('/bookings', bookingData)
			return data.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-bookings'] })
			queryClient.invalidateQueries({ queryKey: ['user-me'] })
		},
	})

	const cancelBookingMutation = useMutation({
		mutationFn: async (bookingId: string) => {
			const { data } = await api.patch(`/bookings/${bookingId}/cancel`)
			return data.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-bookings'] })
		},
	})

	const setLoading = useCallback(
		(id: string, state: LoadingState[string] | null) => {
			setLoadingStates(prev => {
				if (prev[id] === state) return prev
				const next = { ...prev }
				if (state) next[id] = state
				else delete next[id]
				return next
			})
		},
		[],
	)

	const isInSaved = (vehicleId: string) =>
		Array.isArray(user?.savedVehicles) &&
		user.savedVehicles.some(item => {
			if (typeof item === 'string') return item === vehicleId
			return String(item?._id) === vehicleId
		})

	const toggleSaved = useCallback(
		(vehicleId: string) => {
			if (!user) return toast.error('Please login')

			const key = vehicleId
			setLoading(key, 'saved')

			const isItemSaved = isInSaved(vehicleId)

			toggleSavedMutation.mutate(vehicleId, {
				onSettled: () => setLoading(key, null),
				onSuccess: () =>
					toast.success(
						isItemSaved
							? 'Removed from saved vehicles'
							: 'Added to saved vehicles',
					),
				onError: (error: any) => {
					const errorMsg =
						error?.response?.data?.message || 'Failed to update saved vehicles'
					toast.error(errorMsg)
				},
			})
		},
		[user, isInSaved, toggleSavedMutation, setLoading],
	)

	const createBooking = useCallback(
		async (bookingData: CreateBookingPayload) => {
			if (!user) return toast.error('Please login')

			const key = 'checkout_process'
			setLoading(key, 'booking')

			return new Promise((resolve, reject) => {
				createBookingMutation.mutate(bookingData, {
					onSettled: () => setLoading(key, null),
					onSuccess: data => {
						toast.success('Booking placed successfully!')
						resolve(data)
					},
					onError: (error: any) => {
						const errorMsg =
							error?.response?.data?.message || 'Failed to place booking'
						toast.error(errorMsg)
						reject(error)
					},
				})
			})
		},
		[user, createBookingMutation, setLoading],
	)

	const cancelBooking = useCallback(
		async (bookingId: string) => {
			if (!user) return toast.error('Please login')

			setLoading(bookingId, 'cancel')

			return new Promise((resolve, reject) => {
				cancelBookingMutation.mutate(bookingId, {
					onSettled: () => setLoading(bookingId, null),
					onSuccess: data => {
						toast.success('Booking cancelled successfully')
						resolve(data)
					},
					onError: (error: any) => {
						const errorMsg =
							error?.response?.data?.message || 'Failed to cancel booking'
						toast.error(errorMsg)
						reject(error)
					},
				})
			})
		},
		[user, cancelBookingMutation, setLoading],
	)

	return {
		user,
		isLoading,
		loadingStates,
		isInSaved,
		toggleSaved,
		createBooking,
		cancelBooking,
	}
}
