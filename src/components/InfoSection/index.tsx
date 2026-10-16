import { infoItems } from '@/constants/infoItems'

export default function InfoSection() {
	return (
		<div className='py-15 flex flex-col xl:flex-row items-center justify-between gap-8 xl:gap-4'>
			{infoItems.map((item, index) => {
				const IconComponent = item.icon

				return (
					<div
						key={index}
						className='flex flex-col items-center justify-center p-4 w-full xl:max-w-1/4'
					>
						<IconComponent />
						<h3 className='text-[24px] font-work-sans font-semibold mt-4 text-center'>
							{item.label}
						</h3>
						<p className='text-center font-inter font-normal text-[16px] mt-6'>
							{item.description}
						</p>
					</div>
				)
			})}
		</div>
	)
}
