'use client'

import api from '@/src/lib/api'
import type { Category } from '@/src/types/category'
import type { City } from '@/src/types/city'
import type { Vehicle, VehicleMetaOptions } from '@/src/types/vehicle'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export type SortOption =
	'default' | 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc'

interface SearchResult {
	data: Vehicle[]
	meta: {
		total: number
		page: number
		limit: number
		pages: number
		minPrice: number
		maxPrice: number
		minYear: number
		maxYear: number
		options: VehicleMetaOptions
	}
}

export function useVehicles() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const brand = searchParams.get('brand') || 'all'
	const category = searchParams.get('category') || 'all'
	const city = searchParams.get('city') || 'all'
	const returnCity = searchParams.get('returnCity') || ''
	const rentalDate = searchParams.get('rentalDate') || ''
	const returnDate = searchParams.get('returnDate') || ''
	const minYear = searchParams.get('minYear') || ''
	const maxYear = searchParams.get('maxYear') || ''
	const minPriceParam = searchParams.get('minPrice') || ''
	const maxPriceParam = searchParams.get('maxPrice') || ''
	const seats = searchParams.get('seats') || 'all'
	const transmissionParam = searchParams.get('transmission') || 'all'
	const fuelTypeParam = searchParams.get('fuelType') || 'all'
	const isAvailable = searchParams.get('isAvailable') || ''
	const searchQuery = searchParams.get('search') || ''

	const pageParam = searchParams.get('page')
	const page = pageParam ? parseInt(pageParam, 10) || 1 : 1

	const limitParam = searchParams.get('limit')
	const limit = limitParam ? parseInt(limitParam, 10) || 20 : 20

	const sortBy = (searchParams.get('sortBy') as SortOption) || 'default'

	const setMultipleParams = (entries: Record<string, string | null>) => {
		const params = new URLSearchParams(searchParams.toString())
		let shouldResetPage = false

		Object.entries(entries).forEach(([key, value]) => {
			if (
				value === null ||
				value === '' ||
				value === 'all' ||
				value === 'All Categories' ||
				value === 'default' ||
				(key === 'page' && value === '1') ||
				(key === 'limit' && value === '20')
			) {
				params.delete(key)
			} else {
				params.set(key, value)
			}

			if (key !== 'page' && key !== 'limit') {
				shouldResetPage = true
			}
		})

		if (shouldResetPage) {
			params.delete('page')
		}

		router.push(`${pathname}?${params.toString()}`, { scroll: false })
	}

	const setParam = (key: string, value: string | null) => {
		setMultipleParams({ [key]: value })
	}

	const setPage = (newPageOrFn: number | ((prev: number) => number)) => {
		const targetPage =
			typeof newPageOrFn === 'function' ? newPageOrFn(page) : newPageOrFn
		setParam('page', targetPage.toString())
	}

	const setLimit = (newLimit: number) => {
		setMultipleParams({ limit: newLimit.toString(), page: '1' })
	}

	const setSortBy = (option: SortOption) => {
		setMultipleParams({ sortBy: option, page: '1' })
	}

	const resetFilters = () => {
		const newParams = new URLSearchParams()
		if (searchQuery) newParams.set('search', searchQuery)
		router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
	}

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
			brand,
			category,
			city,
			returnCity,
			rentalDate,
			returnDate,
			minYear,
			maxYear,
			minPriceParam,
			maxPriceParam,
			seats,
			transmissionParam,
			fuelTypeParam,
			isAvailable,
			page,
			limit,
			sortBy,
			searchQuery,
		],
		queryFn: async () => {
			const response = await api.get('/vehicles/search', {
				params: {
					brand: brand === 'all' ? undefined : brand,
					category: category === 'all' ? undefined : category,
					city: city === 'all' ? undefined : city,
					returnCity: returnCity || undefined,
					rentalDate: rentalDate || undefined,
					returnDate: returnDate || undefined,
					minYear: minYear || undefined,
					maxYear: maxYear || undefined,
					minPrice: minPriceParam || undefined,
					maxPrice: maxPriceParam || undefined,
					seats: seats === 'all' ? undefined : seats,
					transmission:
						transmissionParam === 'all' ? undefined : transmissionParam,
					fuelType: fuelTypeParam === 'all' ? undefined : fuelTypeParam,
					isAvailable: isAvailable || undefined,
					search: searchQuery || undefined,
					page,
					limit,
					sortBy: sortBy === 'default' ? undefined : sortBy,
				},
			})

			return response.data.data
		},
		placeholderData: previousData => previousData,
	})

	const vehicles = Array.isArray(data?.data) ? data.data : []

	const categoryName =
		category === 'all'
			? 'All Categories'
			: categories.find(item => item._id === category)?.name || 'Category'

	const cityName = cities.find(item => item._id === city)?.name
	const returnCityName = cities.find(item => item._id === returnCity)?.name

	return {
		vehicles,
		meta: data?.meta,
		isLoading,
		error,
		page,
		setPage,
		limit,
		setLimit,
		sortBy,
		setSortBy,
		searchQuery,
		categoryName,
		cityName,
		returnCityName,
		brand,
		seats,
		isAvailable,
		minYear,
		maxYear,
		rentalDate,
		returnDate,
		getParam: (key: string) => searchParams.get(key),
		setParam,
		setMultipleParams,
		resetFilters,
	}
}
