'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function AppBadges() {
	const { resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return <div className='h-10 w-35' />
	}

	const isDark = resolvedTheme === 'dark'

	return (
		<div className='flex flex-col gap-3 items-start'>
			<a href='https://appstore.com' target='_blank' rel='noopener noreferrer'>
				<Image
					src={isDark ? '/AppStore_light.svg' : '/AppStore_dark.svg'}
					alt='Download on the App Store'
					width={140}
					height={50}
					style={{ width: 'auto', height: 'auto' }}
				/>
			</a>

			<a
				href='https://play.google.com'
				target='_blank'
				rel='noopener noreferrer'
			>
				<Image
					src={isDark ? '/GooglePlay_light.svg' : '/GooglePlay_dark.svg'}
					alt='Get it on Google Play'
					width={140}
					height={50}
					style={{ width: 'auto', height: 'auto' }}
				/>
			</a>
		</div>
	)
}
