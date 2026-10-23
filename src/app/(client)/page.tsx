'use client'

import FactsSection from '@/src/components/FactsSection'
import FeaturesSection from '@/src/components/FeaturesSection'
import HeroSection from '@/src/components/HeroSection'
import InfoSection from '@/src/components/InfoSection'

export default function Home() {
	return (
		<>
			<div className='w-full flex flex-col items-center px-4'>
				<div className='container-responsive'>
					<HeroSection />
					<InfoSection />
					<FeaturesSection />
					<FactsSection />
				</div>
			</div>
		</>
	)
}
