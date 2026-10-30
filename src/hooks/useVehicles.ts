'use client'

import api from '@/src/lib/api'
import { CategoryType } from '@/src/types/category'
import { PaginatedVehicles } from '@/src/types/vehicle'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export type SortOption = 'default' | 'price-asc' | 'price-desc'

export function useVehicles() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const category = searchParams.get('category') || ''
	const city = searchParams.get('city') || ''
	const returnCity = searchParams.get('returnCity') || ''
	const rentalDate = searchParams.get('rentalDate') || ''
	const returnDate = searchParams.get('returnDate') || ''

	const pageParam = searchParams.get('page')
	const page = pageParam ? parseInt(pageParam, 10) || 1 : 1

	const limitParam = searchParams.get('limit')
	const limit = limitParam ? parseInt(limitParam, 10) || 20 : 20

	const sortBy = (searchParams.get('sortBy') as SortOption) || 'default'

	const { data: categories = [] } = useQuery<CategoryType[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await api.get('/categories')
			return res.data
		},
		staleTime: 1000 * 60 * 10,
	})

	const { data, isLoading, error } = useQuery<PaginatedVehicles>({
		queryKey: [
			'vehicles',
			category,
			city,
			returnCity,
			rentalDate,
			returnDate,
			page,
			limit,
			sortBy,
		],
		queryFn: async () => {
			const res = await api.get('/vehicles/search', {
				params: {
					category: category || undefined,
					city: city || undefined,
					page,
					limit,
					sortBy: sortBy === 'default' ? undefined : sortBy,
				},
			})
			return res.data
		},
		placeholderData: previousData => previousData,
	})

	const vehicles = Array.isArray(data?.data) ? data.data : []

	const categoryName = categories.find(cat => cat._id === category)?.name

	return {
		vehicles,
		meta: data?.meta,
		isLoading,
		error,
		categoryName,
		city,
		returnCity,
		rentalDate,
		returnDate,
	}
}
