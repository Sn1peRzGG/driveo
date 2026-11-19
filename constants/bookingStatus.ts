import { BookingStatus } from '@/src/types/booking'
import { Car, CheckCircle2, Clock, LucideIcon, XCircle } from 'lucide-react'

export const bookingStatusStyles: Record<BookingStatus, string> = {
	PENDING:
		'bg-amber-500/15 text-amber-500 border-amber-500/30 dark:bg-amber-500/10 dark:border-amber-500/20',
	CONFIRMED:
		'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 dark:bg-emerald-500/10 dark:border-emerald-500/20',
	ACTIVE:
		'bg-primary/15 text-primary border-primary/30 dark:bg-primary/10 dark:border-primary/20',
	COMPLETED:
		'bg-blue-500/15 text-blue-500 border-blue-500/30 dark:bg-blue-500/10 dark:border-blue-500/20',
	CANCELLED:
		'bg-red-500/15 text-red-500 border-red-500/30 dark:bg-red-500/10 dark:border-red-500/20',
}

export const bookingFilterActiveStyles: Record<BookingStatus | 'ALL', string> =
	{
		ALL: 'bg-primary border-primary text-text-main dark:text-brand-choco shadow-sm',
		PENDING:
			'bg-amber-500 border-amber-500 text-black dark:text-black font-bold shadow-sm',
		CONFIRMED: 'bg-emerald-500 border-emerald-500 text-white shadow-sm',
		ACTIVE: 'bg-primary border-primary text-white shadow-sm',
		COMPLETED: 'bg-blue-500 border-blue-500 text-white shadow-sm',
		CANCELLED: 'bg-red-500 border-red-500 text-white shadow-sm',
	}

export const bookingStatusMeta: Record<
	BookingStatus,
	{ label: string; icon: LucideIcon }
> = {
	PENDING: { label: 'Pending', icon: Clock },
	CONFIRMED: { label: 'Confirmed', icon: CheckCircle2 },
	ACTIVE: { label: 'Active', icon: Car },
	COMPLETED: { label: 'Completed', icon: CheckCircle2 },
	CANCELLED: { label: 'Cancelled', icon: XCircle },
}
