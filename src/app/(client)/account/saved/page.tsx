'use client'

import Loading from '@/src/app/loading'
import { useUserActions } from '@/src/hooks/useUserActions'
import { BASE_URL } from '@/src/lib/api'
import { Vehicle } from '@/src/types/vehicle'
import { ArrowUpRight, Car, Heart, Loader2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function UserSavedVehiclesPage() {
	const [mounted, setMounted] = useState(false)
	const { user, isLoading, loadingStates, toggleSaved } = useUserActions()

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null
	if (isLoading) return <Loading />

	const savedVehicles = Array.isArray(user?.savedVehicles)
		? (user.savedVehicles.filter(
				(item): item is Vehicle => typeof item === 'object' && item !== null,
			) as Vehicle[])
		: []

	return (
		<div className='container-responsive p-6 max-w-5xl mx-auto'>
			<h1 className='text-3xl font-extrabold mb-8 tracking-tight text-text-main'>
				Saved Cars
			</h1>

			{savedVehicles.length > 0 ? (
				<div className='overflow-x-auto rounded-xl border border-border-main shadow-sm bg-card-bg'>
					<table className='w-full text-text-muted border-collapse table-fixed min-w-150'>
						<thead>
							<tr className='bg-ui-hover text-[14px] font-semibold text-text-muted uppercase tracking-wider border-b border-border-main'>
								<th className='py-4 pl-6 text-left rounded-tl-xl w-[50%]'>
									Vehicle
								</th>
								<th className='py-4 text-center w-[25%]'>Daily Rate</th>
								<th className='py-4 text-center rounded-tr-xl w-[25%]'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-border-main'>
							{savedVehicles.map(vehicle => {
								const fullName = [vehicle.brand?.name, vehicle.model?.name]
									.filter(Boolean)
									.join(' ')
								const categoryName =
									typeof vehicle.category === 'object' &&
									vehicle.category !== null
										? vehicle.category.name
										: ''
								const imageSrc = vehicle.images?.[0]
									? `${BASE_URL}${vehicle.images[0]}`
									: null
								const isRemoving = loadingStates[vehicle._id] === 'saved'

								return (
									<tr
										key={vehicle._id}
										className='hover:bg-ui-hover/30 transition-colors'
									>
										<td className='py-5 px-6 flex flex-row items-center overflow-hidden'>
											<div className='relative w-20 h-14 border border-border-main rounded-lg overflow-hidden bg-main-bg shrink-0 shadow-sm flex items-center justify-center'>
												{imageSrc ? (
													<Image
														src={imageSrc}
														alt={fullName}
														fill
														className='object-contain p-1.5 pointer-events-none'
														unoptimized
													/>
												) : (
													<Car className='w-6 h-6 text-text-subtle' />
												)}
											</div>
											<div className='ml-4 min-w-0 flex-1'>
												<Link
													href={`/vehicles/${vehicle._id}`}
													className='font-semibold text-text-main truncate block hover:text-primary transition-colors'
												>
													{fullName}
												</Link>
												{categoryName && (
													<p className='text-xs text-text-muted truncate mt-0.5'>
														{categoryName}
													</p>
												)}
											</div>
										</td>

										<td className='py-5 text-center tabular-nums font-semibold text-text-main'>
											${vehicle.pricePerDay}
											<span className='text-xs font-normal text-text-muted block'>
												/ day
											</span>
										</td>

										<td className='py-5 text-center'>
											<div className='flex items-center justify-center gap-2.5'>
												<Link
													href={`/vehicles/${vehicle._id}`}
													className='p-2 rounded-lg border text-text-subtle border-border-main bg-card-bg hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 active:scale-95 shadow-sm'
													title='View & Book Vehicle'
												>
													<ArrowUpRight size={16} />
												</Link>

												<button
													type='button'
													disabled={isRemoving}
													onClick={() => toggleSaved(vehicle._id)}
													className={`p-2 rounded-lg border transition-all duration-200 ${
														isRemoving
															? 'text-accent border-accent/20 bg-accent/10 opacity-70 cursor-not-allowed'
															: 'text-text-subtle border-border-main bg-card-bg hover:text-accent hover:border-accent/30 hover:bg-accent/5 cursor-pointer active:scale-95 shadow-sm'
													}`}
													title='Remove from Saved'
												>
													{isRemoving ? (
														<Loader2 size={16} className='animate-spin' />
													) : (
														<Trash2 size={16} />
													)}
												</button>
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			) : (
				<div className='border-2 border-dashed border-border-main rounded-2xl py-24 px-4 text-center max-w-md mx-auto mt-12 bg-card-bg shadow-sm'>
					<div className='mx-auto w-16 h-16 bg-ui-hover rounded-full flex items-center justify-center text-text-subtle mb-4 shadow-sm'>
						<Heart size={28} />
					</div>
					<h3 className='text-lg font-bold text-text-main mb-1'>
						No saved vehicles yet
					</h3>
					<p className='text-text-muted text-sm mb-6 max-w-xs mx-auto'>
						Browse our fleet and save your favorite cars here for quick booking
						later.
					</p>
					<Link
						href='/vehicles'
						className='inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-semibold text-sm py-2.5 px-6 rounded-xl transition-all shadow-sm active:scale-95'
					>
						Explore Fleet
					</Link>
				</div>
			)}
		</div>
	)
}
