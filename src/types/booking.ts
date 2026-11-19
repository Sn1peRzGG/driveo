import { City } from './city'
import { User } from './user'
import { Vehicle } from './vehicle'

export type BookingStatus =
	'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
export interface Booking {
	_id: string
	user: User
	vehicle: Vehicle
	startDate: string
	endDate: string
	pickupCity: City
	returnCity: City
	totalPrice: number
	oneWayFee: number
	status: BookingStatus
	phoneNumber: string
	createdAt: string
	updatedAt: string
}
