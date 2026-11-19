import { City } from './city'

export interface OneWayFee {
	_id: string
	originCity: City
	destinationCity: City
	fee: number
	createdAt: string
	updatedAt: string
}
