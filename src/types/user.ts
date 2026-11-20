import { Vehicle } from './vehicle'

export type UserRole = 'USER' | 'ADMIN' | 'FLEET_ADMIN' | 'SYSADMIN' | 'OWNER'

export interface User {
	_id: string
	email: string
	firstName: string
	lastName: string
	birthDate: string
	phoneNumber: string
	city: string
	role: UserRole
	avatarUrl: string
	savedVehicles: Array<Vehicle>
	createdAt: string
	updatedAt: string
}
