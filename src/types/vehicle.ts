import { Category } from './category'
import { City } from './city'

export type VehicleTransmission = 'AUTOMATIC' | 'MANUAL'
export type VehicleFuelType = 'PETROL' | 'DIESEL' | 'HYBRID' | 'ELECTRIC'

export interface Vehicle {
	_id: string
	brand: string
	model: string
	year: number
	description: string
	images: string[]
	category: string | Category
	city: string | City
	pricePerDay: number
	seats: number
	transmission: VehicleTransmission
	fuelType: VehicleFuelType
	doors: number
	type: string
	features: string[]
	isAvailable: boolean
	isDeleted: boolean
	createdAt: string
	updatedAt: string
}

export interface VehicleMetaOptions {
	brands: string[]
	categories: { _id: string; name: string }[]
	cities: { _id: string; name: string }[]
	transmissions: string[]
	fuelTypes: string[]
	seats: number[]
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
		minYear: number
		maxYear: number
		options: VehicleMetaOptions
	}
}
