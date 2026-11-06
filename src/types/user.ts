import { Vehicle } from './vehicle'

export type UserRole = 'USER' | 'ADMIN' | 'OWNER'

export interface User {
	_id: string
	email: string
	firstName: string
	lastName: string
	phoneNumber: string
	city: string
	address: string
	role: UserRole
	avatarUrl: string
	savedVehicles: Array<string | Vehicle>
	createdAt: string
	updatedAt: string
}
