'use client'

import { BASE_URL } from '@/src/lib/api'
import { Folder, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FormBirthDatePicker, FormFileField, FormInput } from '../FormFields'

interface UpdateModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: (data: {
		firstName: string
		lastName: string
		email: string
		birthDate: string
		phoneNumber: string
		city: string
		imageFile: File | null
	}) => void
	title?: string
	confirmText?: string
	cancelText?: string
	isLoading?: boolean
	initialData?: {
		firstName: string
		lastName: string
		email: string
		birthDate?: string
		phoneNumber: string
		city?: string
		imageUrl?: string
	} | null
}

export default function UpdateModal({
	isOpen,
	onClose,
	onConfirm,
	title = 'Update Profile',
	confirmText = 'Save',
	cancelText = 'Cancel',
	isLoading = false,
	initialData,
}: UpdateModalProps) {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [birthDate, setBirthDate] = useState('')
	const [birthDateError, setBirthDateError] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [city, setCity] = useState('')
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [fileError, setFileError] = useState<string | null>(null)

	useEffect(() => {
		if (isOpen && initialData) {
			setFirstName(initialData.firstName)
			setLastName(initialData.lastName)
			setEmail(initialData.email)
			setBirthDate(
				initialData.birthDate ? initialData.birthDate.split('T')[0] : '',
			)
			setBirthDateError('')
			setPhoneNumber(initialData.phoneNumber)
			setCity(initialData.city || '')
			setImageFile(null)
			setFileError(null)
			setPreviewUrl(
				initialData.imageUrl ? `${BASE_URL}${initialData.imageUrl}` : null,
			)
		}
	}, [isOpen, initialData])

	useEffect(() => {
		if (!isOpen) return
		document.body.style.overflow = 'hidden'
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && !isLoading) onClose()
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			document.body.style.overflow = 'unset'
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, isLoading, onClose])

	const validateBirthDate = (dateStr: string): string => {
		if (!dateStr) return 'Birth date is required'

		const parsed = new Date(dateStr)
		if (Number.isNaN(parsed.getTime()) || dateStr.length < 10) {
			return 'Invalid date format (MM/DD/YYYY)'
		}

		const today = new Date()
		let age = today.getFullYear() - parsed.getFullYear()
		const monthDiff = today.getMonth() - parsed.getMonth()

		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < parsed.getDate())
		) {
			age--
		}

		if (age < 18) return 'You must be at least 18 years old'
		return ''
	}

	const handleImageChange = (file: File) => {
		setImageFile(file)

		const reader = new FileReader()
		reader.onloadend = () => {
			setPreviewUrl(reader.result as string)
		}
		reader.readAsDataURL(file)
	}

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()

		const dateErr = validateBirthDate(birthDate)
		if (dateErr) {
			setBirthDateError(dateErr)
			return
		}

		if (
			!firstName.trim() ||
			!lastName.trim() ||
			!email.trim() ||
			!phoneNumber.trim() ||
			fileError
		)
			return

		onConfirm({
			firstName,
			lastName,
			email,
			birthDate: new Date(birthDate).toISOString(),
			phoneNumber,
			city,
			imageFile,
		})
	}

	if (!isOpen) return null

	return createPortal(
		<div className='fixed inset-0 z-100 flex items-center justify-center p-4 select-none animate-fade-in'>
			<div
				className='fixed inset-0 bg-main-bg/60 backdrop-blur-md transition-opacity'
				onClick={isLoading ? undefined : onClose}
			/>

			<div className='relative z-10 w-full max-w-md transform overflow-hidden rounded-2xl bg-card-bg p-6 text-left align-middle shadow-xl transition-all border border-border-main animate-scale-up max-h-[90vh] overflow-y-auto scrollbar-none'>
				<div className='flex items-center gap-4 mb-5'>
					<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-main-bg text-text-muted border border-border-main'>
						<Folder size={20} />
					</div>
					<div className='flex-1 min-w-0'>
						<h3 className='text-lg font-bold text-text-main tracking-tight leading-6'>
							{title}
						</h3>
					</div>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='grid grid-cols-2 gap-3'>
						<FormInput
							label='First Name'
							type='text'
							required
							disabled={isLoading}
							value={firstName}
							onChange={e => setFirstName(e.target.value)}
							placeholder='John'
						/>

						<FormInput
							label='Last Name'
							type='text'
							required
							disabled={isLoading}
							value={lastName}
							onChange={e => setLastName(e.target.value)}
							placeholder='Doe'
						/>
					</div>

					<FormInput
						label='Email Address'
						type='email'
						required
						disabled={isLoading}
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder='john.doe@example.com'
					/>

					<FormInput
						label='Phone Number'
						type='tel'
						required
						disabled={isLoading}
						value={phoneNumber}
						onChange={e => setPhoneNumber(e.target.value)}
						placeholder='+49...'
					/>

					<FormBirthDatePicker
						label='Birth Date'
						required
						disabled={isLoading}
						value={birthDate}
						error={birthDateError}
						onChange={dateString => {
							setBirthDate(dateString)
							if (birthDateError) setBirthDateError('')
						}}
						tooltipText='You must be at least 18 years old.'
					/>

					<FormInput
						label='City'
						type='text'
						disabled={isLoading}
						value={city}
						onChange={e => setCity(e.target.value)}
						placeholder='Berlin'
					/>

					<FormFileField
						label='Profile Image (Max 4MB)'
						previewUrl={previewUrl}
						error={fileError}
						disabled={isLoading}
						onChange={handleImageChange}
						onError={setFileError}
						onRemove={() => {
							setImageFile(null)
							setPreviewUrl(null)
							setFileError(null)
						}}
					/>

					<div className='mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-2 pt-4 border-t border-border-main'>
						<button
							type='button'
							disabled={isLoading}
							onClick={onClose}
							className='inline-flex justify-center items-center h-10 px-4 rounded-xl border border-border-strong bg-card-bg text-sm font-semibold text-text-muted hover:bg-main-bg focus:outline-hidden focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all cursor-pointer disabled:opacity-50'
						>
							{cancelText}
						</button>

						<button
							type='submit'
							disabled={
								isLoading ||
								!firstName.trim() ||
								!lastName.trim() ||
								!email.trim() ||
								!birthDate.trim() ||
								!phoneNumber.trim() ||
								!!birthDateError ||
								!!fileError
							}
							className='inline-flex justify-center items-center h-10 px-4 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-22.5 shadow-sm'
						>
							{isLoading ? (
								<Loader2 className='animate-spin' size={16} />
							) : (
								confirmText
							)}
						</button>
					</div>
				</form>
			</div>
		</div>,
		document.body,
	)
}
