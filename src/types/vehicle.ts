import { Category } from './category'
import { City } from './city'

export interface Vehicle {
	_id: string
	brand: string
	model: string
	description: string
	image: string
	category: string | Category
	city: string | City
	pricePerDay: number
	seats: number
	type: string
	isAvailable: boolean
	isDeleted: boolean
	createdAt: string
	updatedAt: string
}

export interface PaginatedVehicles {
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
