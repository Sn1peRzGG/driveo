import { City } from './city'
import { User } from './user'
import { Vehicle } from './vehicle'

export type BookingStatus =
	'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface Booking {
	_id: string
	user: string | User
	vehicle: string | Vehicle
	startDate: string
	endDate: string
	pickupCity: string | City
	returnCity: string | City
	totalPrice: number
	oneWayFee: number
	status: BookingStatus
	phoneNumber: string
	createdAt: string
	updatedAt: string
}
