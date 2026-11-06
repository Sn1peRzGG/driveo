'use client'

import api from '@/src/lib/api'
import type { Category } from '@/src/types/category'
import type { City } from '@/src/types/city'
import type { Vehicle } from '@/src/types/vehicle'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export type SortOption = 'default' | 'price-asc' | 'price-desc'

interface SearchResult {
	data: Vehicle[]
	meta: {
		total: number
		page: number
		limit: number
		pages: number
		minPrice: number
		maxPrice: number
	}
}

export function useVehicles() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const category = searchParams.get('category') ?? ''
	const city = searchParams.get('city') ?? ''
	const returnCity = searchParams.get('returnCity') ?? ''
	const rentalDate = searchParams.get('rentalDate') ?? ''
	const returnDate = searchParams.get('returnDate') ?? ''

	const page = Math.max(1, Number(searchParams.get('page')) || 1)
	const limit = Math.min(
		100,
		Math.max(1, Number(searchParams.get('limit')) || 20),
	)

	const sortParam = searchParams.get('sortBy')
	const sortBy: SortOption =
		sortParam === 'price-asc' || sortParam === 'price-desc'
			? sortParam
			: 'default'

	const { data: categories = [] } = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: async () => (await api.get('/categories')).data.data,
		staleTime: 1000 * 60 * 10,
	})

	const { data: cities = [] } = useQuery<City[]>({
		queryKey: ['cities'],
		queryFn: async () => (await api.get('/cities')).data.data,
		staleTime: 1000 * 60 * 10,
	})

	const { data, isLoading, error } = useQuery<SearchResult>({
		queryKey: [
			'vehicles',
			category,
			city,
			rentalDate,
			returnDate,
			page,
			limit,
			sortBy,
		],
		queryFn: async () => {
			const response = await api.get('/vehicles/search', {
				params: {
					category: category || undefined,
					city: city || undefined,
					rentalDate: rentalDate || undefined,
					returnDate: returnDate || undefined,
					page,
					limit,
					sortBy: sortBy === 'default' ? undefined : sortBy,
				},
			})

			return response.data.data
		},
		placeholderData: previousData => previousData,
	})

	const categoryName = categories.find(item => item._id === category)?.name
	const cityName = cities.find(item => item._id === city)?.name
	const returnCityName = cities.find(item => item._id === returnCity)?.name

	return {
		vehicles: data?.data ?? [],
		meta: data?.meta,
		isLoading,
		error,
		categoryName,
		cityName,
		returnCityName,
		rentalDate,
		returnDate,
	}
}
