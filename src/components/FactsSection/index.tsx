import { statsData } from '@/constants/factsItems'
import Image from 'next/image'

export default function FactsSection() {
	return (
		<div className='py-10 px-6 sm:py-12 sm:px-10 xl:py-15 xl:px-18 rounded-[20px] bg-primary text-white font-work-sans flex flex-col items-center relative overflow-hidden'>
			<Image
				src='/skid_marks2.png'
				alt='Skid Marks'
				fill
				style={{ objectFit: 'contain', objectPosition: 'left' }}
				className='z-0 pointer-events-none scale-150 origin-left hidden lg:block'
				loading='eager'
			/>

			<div className='z-10 flex flex-col items-center w-full'>
				<h2 className='font-bold text-3xl sm:text-4xl xl:text-[50px] text-center'>
					Facts in numbers
				</h2>
				<p className='mt-3 sm:mt-5 font-normal text-sm sm:text-base text-center max-w-lg xl:max-w-1/2'>
					Empowering thousands of journeys every day with reliability, safety,
					and top-tier service.
				</p>

				<div className='mt-10 sm:mt-14 xl:mt-20 grid grid-cols-1 sm:grid-cols-2 xl:flex xl:justify-between gap-6 sm:gap-8 w-full max-w-5xl'>
					{statsData.map((item, index) => {
						const IconComponent = item.icon

						return (
							<div
								key={index}
								className='bg-white rounded-[20px] p-4 flex gap-4 w-full xl:w-60 shadow-md'
							>
								<div className='w-16 h-16 sm:w-18 sm:h-16 shrink-0 rounded-xl bg-accent flex items-center justify-center'>
									<IconComponent />
								</div>
								<div className='flex flex-col justify-between'>
									<span className='font-bold text-[22px] sm:text-[24px] text-black'>
										{item.value}
									</span>
									<span className='font-semibold text-[15px] sm:text-[16px] text-black/60'>
										{item.label}
									</span>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
