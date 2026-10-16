'use client'

import NavBar from '@/src/components/ui/NavBar'
import { useState } from 'react'

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className='fixed w-full bg-card-bg h-24 flex items-center z-50 shadow-sm'>
			<NavBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
		</header>
	)
}
