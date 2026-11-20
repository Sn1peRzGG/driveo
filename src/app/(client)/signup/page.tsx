'use client'

import { FormBirthDatePicker, FormInput } from '@/src/components/ui/FormFields'
import api from '@/src/lib/api'
import { getApiError } from '@/src/utils/getApiError'
import { getFieldErrors } from '@/src/utils/getFieldErrors'
import {
	ArrowRight,
	Loader2,
	Lock,
	LogIn,
	Mail,
	Phone,
	User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
const PHONE_REGEX = /^\+?[1-9]\d{9,14}$/

export default function SignupPage() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
		birthDate: '',
		phoneNumber: '',
	})

	const [errors, setErrors] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
		birthDate: '',
		phoneNumber: '',
	})

	const [loading, setLoading] = useState(false)

	const router = useRouter()

	const validate = () => {
		const newErrors = {
			email: '',
			password: '',
			confirmPassword: '',
			firstName: '',
			lastName: '',
			birthDate: '',
			phoneNumber: '',
		}
		let isValid = true

		if (!formData.email || !EMAIL_REGEX.test(formData.email)) {
			newErrors.email = 'Invalid email format'
			isValid = false
		}

		if (!formData.password || !PASSWORD_REGEX.test(formData.password)) {
			newErrors.password =
				'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number'
			isValid = false
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match'
			isValid = false
		}

		if (!formData.firstName || formData.firstName.trim().length < 2) {
			newErrors.firstName = 'First name must be at least 2 characters'
			isValid = false
		}

		if (formData.firstName && formData.firstName.length > 50) {
			newErrors.firstName = 'First name must be at most 50 characters'
			isValid = false
		}

		if (!formData.lastName || formData.lastName.trim().length < 2) {
			newErrors.lastName = 'Last name must be at least 2 characters'
			isValid = false
		}

		if (formData.lastName && formData.lastName.length > 50) {
			newErrors.lastName = 'Last name must be at most 50 characters'
			isValid = false
		}

		if (!formData.birthDate) {
			newErrors.birthDate = 'Birth date is required'
			isValid = false
		} else {
			const birthDate = new Date(formData.birthDate)
			const today = new Date()
			let age = today.getFullYear() - birthDate.getFullYear()
			const monthDiff = today.getMonth() - birthDate.getMonth()

			if (
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < birthDate.getDate())
			) {
				age--
			}

			if (age < 18) {
				newErrors.birthDate = 'You must be at least 18 years old'
				isValid = false
			}
		}

		if (!formData.phoneNumber || !PHONE_REGEX.test(formData.phoneNumber)) {
			newErrors.phoneNumber = 'Invalid phone number'
			isValid = false
		}

		return { isValid, newErrors }
	}

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault()

		const { isValid, newErrors } = validate()

		if (!isValid) {
			setErrors(newErrors)
			return
		}

		setErrors({
			email: '',
			password: '',
			confirmPassword: '',
			firstName: '',
			lastName: '',
			birthDate: '',
			phoneNumber: '',
		})

		setLoading(true)
		const loadingToast = toast.loading('Creating account...')

		const payload = {
			email: formData.email,
			password: formData.password,
			firstName: formData.firstName,
			lastName: formData.lastName,
			birthDate: new Date(formData.birthDate).toISOString(),
			phoneNumber: formData.phoneNumber,
		}

		try {
			await api.post('/auth/signup', payload)

			toast.success('Account created and logged in!', { id: loadingToast })

			localStorage.setItem('isLoggedIn', 'true')

			window.location.href = '/account'
		} catch (error: unknown) {
			const fieldErrors = getFieldErrors(error)

			setErrors(prev => ({
				...prev,
				...fieldErrors,
			}))

			toast.error(getApiError(error), {
				id: loadingToast,
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='container-responsive flex flex-1 items-center justify-center font-work-sans py-12'>
			<div className='w-full max-w-md'>
				<div className='mb-8 text-center'>
					<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card-bg backdrop-blur-xl border border-border-main text-primary shadow-xl shadow-black/10'>
						<LogIn size={28} />
					</div>

					<h1 className='text-3xl font-extrabold tracking-tight text-text-main'>
						Create Account
					</h1>

					<p className='mt-2 text-text-muted text-sm'>
						Fill in your details to get started
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className='space-y-6 rounded-2xl border border-border-main bg-card-bg backdrop-blur-xl p-8 shadow-xl hover:border-primary/35 transition-all duration-300'
				>
					<FormInput
						label='First Name'
						type='text'
						placeholder='John'
						value={formData.firstName}
						error={errors.firstName}
						icon={<User size={18} />}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setFormData(prev => ({ ...prev, firstName: e.target.value }))
							if (errors.firstName)
								setErrors(prev => ({ ...prev, firstName: '' }))
						}}
						tooltipText='Must be between 2 and 50 characters long.'
						required
					/>

					<FormInput
						label='Last Name'
						type='text'
						placeholder='Doe'
						value={formData.lastName}
						error={errors.lastName}
						icon={<User size={18} />}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setFormData(prev => ({ ...prev, lastName: e.target.value }))
							if (errors.lastName)
								setErrors(prev => ({ ...prev, lastName: '' }))
						}}
						tooltipText='Must be between 2 and 50 characters long.'
						required
					/>

					<FormInput
						label='Email Address'
						type='email'
						placeholder='john.doe@example.com'
						value={formData.email}
						error={errors.email}
						icon={<Mail size={18} />}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setFormData(prev => ({ ...prev, email: e.target.value }))
							if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
						}}
						tooltipText='Please enter a valid email address.'
						required
					/>

					<FormBirthDatePicker
						label='Birth Date'
						value={formData.birthDate}
						error={errors.birthDate}
						onChange={dateString => {
							setFormData(prev => ({ ...prev, birthDate: dateString }))
							if (errors.birthDate)
								setErrors(prev => ({ ...prev, birthDate: '' }))
						}}
						tooltipText='You must be at least 18 years old.'
						required
					/>

					<FormInput
						label='Phone Number'
						type='text'
						placeholder='+491711234567'
						value={formData.phoneNumber}
						error={errors.phoneNumber}
						icon={<Phone size={18} />}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))
							if (errors.phoneNumber)
								setErrors(prev => ({ ...prev, phoneNumber: '' }))
						}}
						tooltipText='International format. Must start with + followed by 10 to 15 digits.'
						required
					/>

					<FormInput
						label='Password'
						type='password'
						placeholder='••••••••'
						value={formData.password}
						error={errors.password}
						icon={<Lock size={18} />}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setFormData(prev => ({ ...prev, password: e.target.value }))
							if (errors.password)
								setErrors(prev => ({ ...prev, password: '' }))
						}}
						tooltipText='At least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number.'
						required
					/>

					<FormInput
						label='Confirm Password'
						type='password'
						placeholder='••••••••'
						value={formData.confirmPassword}
						error={errors.confirmPassword}
						icon={<Lock size={18} />}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setFormData(prev => ({
								...prev,
								confirmPassword: e.target.value,
							}))
							if (errors.confirmPassword)
								setErrors(prev => ({ ...prev, confirmPassword: '' }))
						}}
						tooltipText='Must exactly match the password entered above.'
						required
					/>

					<div className='text-right text-sm'>
						<Link
							href='/forgot'
							className='group relative inline-block font-semibold text-primary hover:underline'
						>
							Forgot password?
						</Link>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='group relative flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-bold text-card-bg transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 shadow-md shadow-primary/25'
					>
						{loading ? (
							<span className='flex items-center gap-2'>
								<Loader2 className='h-4 w-4 animate-spin' />
								Signing up...
							</span>
						) : (
							<>
								Sign up
								<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
							</>
						)}
					</button>
				</form>

				<div className='mt-8 text-center'>
					<p className='text-sm text-text-muted'>
						Already have an account?{' '}
						<Link
							href='/login'
							className='group relative inline-block font-bold text-primary hover:underline'
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
