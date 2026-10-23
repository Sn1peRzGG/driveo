import { featureItems } from '@/constants/featuresItems'
import Image from 'next/image'

export default function FeaturesSection() {
	return (
		<div className='py-15 flex flex-col xl:flex-row items-center justify-between gap-10 xl:gap-30'>
			<div className='w-full xl:w-137.5 h-87.5 xl:h-137.5 relative overflow-hidden rounded-[20px] shrink-0'>
				<Image
					src='/features.png'
					alt='Feature'
					sizes='(max-width: 1280px) 100vw, 1375px'
					fill
					className='pointer-events-none object-cover'
				/>
			</div>

			<div className='flex flex-col gap-7 font-work-sans w-full xl:w-1/2'>
				{featureItems.map(item => (
					<div key={item.id}>
						<div className='flex gap-4 items-center'>
							<span className='w-8 h-8 shrink-0 rounded-full bg-primary text-white flex items-center justify-center text-[16px] font-semibold'>
								{item.id}
							</span>
							<h3 className='text-xl font-semibold'>{item.title}</h3>
						</div>
						<p className='text-[16px] font-normal mt-3 text-text-main/60'>
							{item.description}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
