import { contactItems } from '@/constants/footerItems'
import socialData from '@/constants/socialItems.json'
import Link from 'next/link'
import AppBadges from '../ui/AppBadges'
import Logo from '../ui/Logo'

interface SocialItem {
	name: string
	href: string
	path: string
}

const socialMediaData: SocialItem[] = socialData

export default function Footer() {
	return (
		<footer className='bg-card-bg w-full'>
			<div className='w-full max-w-360 px-6 md:px-12 xl:px-16 mx-auto pt-12 md:pt-16 pb-10 flex flex-col justify-between gap-12'>
				<div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10'>
					<Logo />

					{contactItems.map((item, index) => {
						const IconComponent = item.icon

						let href = '#'
						let isExternal = false

						if (item.label === 'Email') {
							href = `mailto:${item.value}`
						} else if (item.label === 'Phone') {
							href = `tel:${item.value.replace(/\s+/g, '')}`
						} else if (item.label === 'Address') {
							href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
								item.value,
							)}`
							isExternal = true
						}

						return (
							<div
								key={index}
								className='flex items-center gap-3 font-work-sans text-[15px] md:text-[16px]'
							>
								<div className='bg-accent p-2.5 rounded-full flex items-center justify-center shrink-0'>
									<IconComponent className='w-5 h-5 text-card-bg' />
								</div>

								<div className='flex flex-col'>
									<span className='font-normal text-text-main/70 text-sm'>
										{item.label}
									</span>
									<a
										href={href}
										{...(isExternal
											? { target: '_blank', rel: 'noopener noreferrer' }
											: {})}
										className='font-semibold hover:text-primary transition-colors'
									>
										{item.value}
									</a>
								</div>
							</div>
						)
					})}
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 font-work-sans'>
					<div className='flex flex-col justify-between gap-6'>
						<p className='leading-relaxed font-medium text-[16px] text-text-main/90 max-w-sm'>
							Seamless car rentals for every journey. Drive with comfort,
							flexibility, and confidence.
						</p>
						<div className='flex items-center gap-3'>
							{socialMediaData.map(social => (
								<Link
									key={social.name}
									href={social.href}
									target='_blank'
									rel='noopener noreferrer'
									aria-label={social.name}
									className='rounded-full w-9 h-9 flex items-center justify-center bg-text-main hover:bg-primary transition-colors text-card-bg'
								>
									<svg viewBox='0 0 24 24' className='w-5 h-5 fill-current'>
										<path d={social.path} />
									</svg>
								</Link>
							))}
						</div>
					</div>

					<div className='flex flex-col gap-4'>
						<h2 className='font-semibold text-[18px] md:text-[20px]'>
							Useful links
						</h2>
						<ul className='flex flex-col gap-2.5 font-normal text-[15px] md:text-[16px]'>
							<li>
								<Link
									href='/about'
									className='hover:text-primary transition-colors'
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href='/contact'
									className='hover:text-primary transition-colors'
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									href='/gallery'
									className='hover:text-primary transition-colors'
								>
									Gallery
								</Link>
							</li>
							<li>
								<Link
									href='/blog'
									className='hover:text-primary transition-colors'
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href='/faq'
									className='hover:text-primary transition-colors'
								>
									F.A.Q
								</Link>
							</li>
						</ul>
					</div>

					<div className='flex flex-col gap-4'>
						<h2 className='font-semibold text-[18px] md:text-[20px]'>
							Vehicles
						</h2>
						<ul className='flex flex-col gap-2.5 font-normal text-[15px] md:text-[16px]'>
							<li>
								<Link
									href='/vehicle'
									className='hover:text-primary transition-colors'
								>
									Sedan
								</Link>
							</li>
							<li>
								<Link
									href='/vehicle'
									className='hover:text-primary transition-colors'
								>
									SUV
								</Link>
							</li>
							<li>
								<Link
									href='/vehicle'
									className='hover:text-primary transition-colors'
								>
									Minivan
								</Link>
							</li>
							<li>
								<Link
									href='/vehicle'
									className='hover:text-primary transition-colors'
								>
									Cabriolet
								</Link>
							</li>
							<li>
								<Link
									href='/vehicle'
									className='hover:text-primary transition-colors'
								>
									Pickup
								</Link>
							</li>
						</ul>
					</div>

					<div className='flex flex-col gap-4'>
						<h2 className='font-semibold text-[18px] md:text-[20px]'>
							Download App
						</h2>
						<AppBadges />
					</div>
				</div>

				<div className='pt-6 text-center'>
					<p className='font-normal text-[14px] text-text-main/50'>
						© {new Date().getFullYear()} Driveo. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}
