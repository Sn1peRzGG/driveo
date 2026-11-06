import { City } from './city'

export interface OneWayFee {
	_id: string
	originCity: string | City
	destinationCity: string | City
	fee: number
	createdAt: string
	updatedAt: string
}
