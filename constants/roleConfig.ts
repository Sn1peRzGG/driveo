import { UserRole } from '@/src/types/user'
import {
	Car,
	Crown,
	ShieldCheck,
	Terminal,
	UserIcon,
	type LucideIcon,
} from 'lucide-react'

export const ROLE_CONFIG: Record<
	UserRole,
	{
		label: string
		bg: string
		nameColor: string
		icon: LucideIcon
		hasBadge?: boolean
	}
> = {
	OWNER: {
		label: 'Owner',
		bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-xs shadow-amber-500/10',
		nameColor: 'text-amber-400 font-black tracking-wide',
		icon: Crown,
		hasBadge: true,
	},
	SYSADMIN: {
		label: 'SysAdmin',
		bg: 'bg-rose-500/10 text-rose-400 border border-rose-500/25 shadow-xs shadow-rose-500/10',
		nameColor: 'text-rose-400 font-extrabold tracking-wide',
		icon: Terminal,
		hasBadge: true,
	},
	FLEET_ADMIN: {
		label: 'Fleet Admin',
		bg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-xs shadow-cyan-500/10',
		nameColor: 'text-cyan-400 font-extrabold tracking-wide',
		icon: Car,
		hasBadge: true,
	},
	ADMIN: {
		label: 'Admin',
		bg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 shadow-xs shadow-indigo-500/10',
		nameColor: 'text-indigo-400 font-bold tracking-wide',
		icon: ShieldCheck,
		hasBadge: true,
	},
	USER: {
		label: 'Customer',
		bg: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 shadow-xs',
		nameColor: 'text-zinc-300 font-semibold',
		icon: UserIcon,
		hasBadge: false,
	},
}
