import { CategoryType } from './category'

export type VehicleType = {
	_id: string
	brand: string
	model: string
	description: string
	image: string
	category: CategoryType
	pricePerDay: number
	seats: number
	city: string
	type: string
	isAvailable: boolean
	isDeleted: boolean
	createdAt: string
	updatedAt: string
}

export interface PaginatedVehicles {
	data: VehicleType[]
	meta: {
		total: number
		page: number
		limit: number
		pages: number
	}
}
