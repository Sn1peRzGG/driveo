'use client'

import NavBar from '@/src/components/ui/NavBar'
import { useState } from 'react'

interface HeaderProps {
	showPhone?: boolean
	phoneNumber?: string
	phoneDisplay?: string
}

export default function Header({
	showPhone = true,
	phoneNumber = '+491711234567',
	phoneDisplay = '+49 171 1234567',
}: HeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className='fixed w-full bg-card-bg h-24 flex items-center z-50 shadow-sm transition-colors duration-300'>
			<NavBar
				isMenuOpen={isMenuOpen}
				setIsMenuOpen={setIsMenuOpen}
				showPhoneBlock={showPhone}
				phoneNumber={phoneNumber}
				phoneDisplay={phoneDisplay}
			/>
		</header>
	)
}
