import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Inter, Work_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import QueryProvider from '../lib/QueryProvider'
import './globals.css'

const workSans = Work_Sans({
	subsets: ['latin'],
	variable: '--font-work-sans',
})

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

export const metadata: Metadata = {
	title: {
		default: 'Driveo | Premium Car Rental & Luxury Car Hire',
		template: '%s | Driveo',
	},
	description:
		'Rent premium vehicles, luxury sedans, and spacious SUVs online from Driveo. Affordable rates, flexible booking, and the best rides in town!',
	keywords: [
		'car rental',
		'rent a car',
		'luxury car hire',
		'suv rental',
		'book car online',
		'Driveo',
	],
	authors: [{ name: 'Driveo Team' }],
	metadataBase: new URL('https://driveo.vercel.app'), // deploy
	openGraph: {
		title: 'Driveo | Premium Car Rental',
		description:
			'Rent premium vehicles, luxury sedans, and spacious SUVs online with flexible bookings.',
		url: 'https://driveo.vercel.app', // deploy
		siteName: 'Driveo',
		images: [
			{
				url: 'https://vercel.app/banner2', // deploy
				width: 1200,
				height: 630,
				alt: 'Driveo - Premium Car Rental Store',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className='h-full' suppressHydrationWarning>
			<body
				className={`${workSans.variable} ${inter.variable} min-h-screen flex flex-col antialiased`}
			>
				<QueryProvider>
					<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
						<Toaster
							position='top-right'
							toastOptions={{
								className:
									'border border-border-main rounded-xl p-4 shadow-lg text-sm font-semibold transition-all duration-200 backdrop-blur-md',
								style: {
									background: 'var(--color-card-bg)',
									color: 'var(--color-text-main)',
								},
								success: {
									iconTheme: {
										primary: 'var(--color-primary)',
										secondary: 'var(--color-card-bg)',
									},
								},
								error: {
									iconTheme: {
										primary: 'var(--color-accent)',
										secondary: 'var(--color-card-bg)',
									},
								},
							}}
						/>
						{children}
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	)
}
