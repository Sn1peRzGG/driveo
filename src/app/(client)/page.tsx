'use client'

import HeroSection from '@/src/components/HeroSection'
import InfoSection from '@/src/components/InfoSection'

export default function Home() {
	return (
		<>
			<div className='w-full flex flex-col items-center px-4'>
				<div className='container-responsive'>
					<HeroSection />
					<InfoSection />
				</div>
			</div>
		</>
	)
}
