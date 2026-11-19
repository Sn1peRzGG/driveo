import {
	bookingStatusMeta,
	bookingStatusStyles,
} from '@/constants/bookingStatus'
import { BookingStatus } from '@/src/types/booking'

interface BookingStatusBadgeProps {
	status: BookingStatus
	className?: string
}

export default function BookingStatusBadge({
	status,
	className = '',
}: BookingStatusBadgeProps) {
	const style =
		bookingStatusStyles[status] ??
		'bg-ui-hover text-text-muted border-border-main'
	const meta = bookingStatusMeta[status]
	const Icon = meta?.icon

	return (
		<span
			className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] leading-none font-semibold border ${style} ${className}`}
		>
			{Icon && <Icon size={13} className='shrink-0' />}
			<span>{meta?.label ?? status}</span>
		</span>
	)
}
