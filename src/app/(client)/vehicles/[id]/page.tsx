'use client'

import Loading from '@/src/app/loading'
import FullVehicleCard from '@/src/components/ui/FullVehicleCard'
import { useBreadcrumbs } from '@/src/context/BreadcrumbsContext'
import api from '@/src/lib/api'
import { Vehicle } from '@/src/types/vehicle'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VehicleDetailPage() {
	const params = useParams()
	const [mounted, setMounted] = useState(false)
	const { setLabel } = useBreadcrumbs()

	const {
		data: vehicle,
		isLoading,
		isError,
	} = useQuery<Vehicle>({
		queryKey: ['vehicle', params.id],
		queryFn: async () => {
			const res = await api.get(`/vehicles/${params.id}`)
			return res.data.data
		},
		enabled: !!params.id,
		retry: false,
	})

	const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : ''

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (vehicleName && params.id) {
			setLabel(params.id as string, vehicleName)
		}
	}, [vehicleName, params.id, setLabel])

	if (!mounted) {
		return null
	}

	if (isLoading) return <Loading />

	if (isError || !vehicle) {
		return <div className='container-responsive'>Vehicle not found</div>
	}

	return (
		<div className='container-responsive'>
			<FullVehicleCard {...vehicle} />
		</div>
	)
}
