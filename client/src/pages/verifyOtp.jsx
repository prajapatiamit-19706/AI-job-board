// client/src/pages/VerifyOTP.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import useAuthStore from '../store/authStore'

export default function VerifyOTP() {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const inputRefs = useRef([])
    const navigate = useNavigate()
    const location = useLocation()
    const { setAuth } = useAuthStore()

    // get userId + email passed from Register page
    const { userId, email, name } = location.state || {}

    // redirect if no userId
    useEffect(() => {
        if (!userId) navigate('/register')
    }, [userId])

    // countdown timer for resend button
    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true)
            return
        }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
        return () => clearTimeout(timer)
    }, [countdown])

    // auto focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    // verify OTP mutation
    const verifyMutation = useMutation({
        mutationFn: (otpString) =>
            axiosInstance.post('/api/auth/verify-otp', { email, otp: otpString }),
        onSuccess: (res) => {
            const { token, user } = res.data.data
            setAuth(user, token)
            localStorage.setItem('token', token)
            setSuccess('Email verified! Redirecting...')
            setTimeout(() => {
                if (user.role === 'employer') navigate('/employer/dashboard')
                else if (user.role === 'candidate') navigate('/candidate/dashboard')
                else navigate('/')
            }, 1500)
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
            // shake all inputs on error
            setOtp(['', '', '', '', '', ''])
            inputRefs.current[0]?.focus()
        }
    })

    // resend OTP mutation
    const resendMutation = useMutation({
        mutationFn: () =>
            axiosInstance.post('/api/auth/resend-otp', { userId }),
        onSuccess: () => {
            setError('')
            setSuccess('New OTP sent to your email!')
            setCountdown(60)
            setCanResend(false)
            setOtp(['', '', '', '', '', ''])
            inputRefs.current[0]?.focus()
            setTimeout(() => setSuccess(''), 3000)
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to resend OTP')
        }
    })

    // handle input change
    const handleChange = (index, value) => {
        // only allow digits
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1) // take last char only
        setOtp(newOtp)
        setError('')

        // auto advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }

        // auto submit when all 6 filled
        const filled = newOtp.join('')
        if (filled.length === 6) {
            verifyMutation.mutate(filled)
        }
    }

    // handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp]
                newOtp[index] = ''
                setOtp(newOtp)
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus()
                const newOtp = [...otp]
                newOtp[index - 1] = ''
                setOtp(newOtp)
            }
        }
        // allow pasting
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    // handle paste
    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (!pasted) return

        const newOtp = ['', '', '', '', '', '']
        pasted.split('').forEach((char, i) => {
            newOtp[i] = char
        })
        setOtp(newOtp)
        setError('')

        // focus last filled input
        const lastIndex = Math.min(pasted.length - 1, 5)
        inputRefs.current[lastIndex]?.focus()

        // auto submit if 6 digits pasted
        if (pasted.length === 6) {
            verifyMutation.mutate(pasted)
        }
    }

    const isLoading = verifyMutation.isPending
    const filledCount = otp.filter(d => d !== '').length

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center px-4">

            {/* background glow */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 600px 400px at 50% 30%, rgba(124,58,237,0.08), transparent)'
                }}
            />

            <div className="w-full max-w-md relative">

                {/* card */}
                <div className="bg-bg-card border border-border-soft rounded-2xl overflow-hidden">

                    {/* top accent bar */}
                    <div
                        className="h-0.5 w-full"
                        style={{ background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }}
                    />

                    <div className="p-8">

                        {/* logo */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-purple-muted border border-border-purple rounded-xl px-4 py-2">
                                <span className="text-purple-light font-bold text-sm">⚡ AI Job Board</span>
                            </div>
                        </div>

                        {/* icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                {/* outer ring */}
                                <div className="w-20 h-20 rounded-full bg-purple-muted border border-border-purple flex items-center justify-center">
                                    {/* inner icon */}
                                    <svg
                                        width="36" height="36" viewBox="0 0 24 24"
                                        fill="none" stroke="#A78BFA" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </div>
                                {/* pulse ring */}
                                <div
                                    className="absolute inset-0 rounded-full border border-purple/30 animate-ping"
                                    style={{ animationDuration: '2s' }}
                                />
                            </div>
                        </div>

                        {/* heading */}
                        <div className="text-center mb-8">
                            <h1 className="text-text-primary font-bold text-2xl tracking-tight mb-2">
                                Check your inbox
                            </h1>
                            <p className="text-text-muted text-sm leading-relaxed">
                                We sent a 6-digit verification code to
                            </p>
                            <p className="text-purple-light font-medium text-sm mt-1">
                                {email || 'your email address'}
                            </p>
                        </div>

                        {/* OTP inputs */}
                        <div className="mb-6">
                            <p className="text-text-hint text-xs font-medium uppercase tracking-widest text-center mb-4">
                                Enter verification code
                            </p>

                            <div className="flex gap-2 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleChange(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        disabled={isLoading || !!success}
                                        className={`
                      w-12 h-14 text-center text-xl font-bold rounded-xl
                      border bg-bg-surface outline-none
                      transition-all duration-150
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${digit
                                                ? 'border-purple text-purple-light'
                                                : 'border-border-soft text-text-primary'
                                            }
                      ${error
                                                ? 'border-red-500/60 text-red-400'
                                                : ''
                                            }
                      focus:border-purple focus:ring-2 focus:ring-purple/20
                      hover:border-purple/40
                    `}
                                    />
                                ))}
                            </div>

                            {/* progress dots */}
                            <div className="flex gap-1.5 justify-center mt-4">
                                {otp.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`
                      h-1 rounded-full transition-all duration-300
                      ${i < filledCount
                                                ? 'w-6 bg-purple'
                                                : 'w-2 bg-bg-surface'
                                            }
                    `}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* error message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                                <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                                    <span>⚠</span> {error}
                                </p>
                            </div>
                        )}

                        {/* success message */}
                        {success && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-4">
                                <p className="text-green-400 text-sm text-center flex items-center justify-center gap-2">
                                    <span>✓</span> {success}
                                </p>
                            </div>
                        )}

                        {/* loading state */}
                        {isLoading && (
                            <div className="flex flex-col items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-full border-2 border-bg-surface border-t-purple-light animate-spin" />
                                <p className="text-text-hint text-xs">Verifying...</p>
                            </div>
                        )}

                        {/* manual verify button (fallback) */}
                        {!isLoading && !success && (
                            <button
                                onClick={() => {
                                    const code = otp.join('')
                                    if (code.length < 6) {
                                        setError('Please enter all 6 digits')
                                        return
                                    }
                                    verifyMutation.mutate(code)
                                }}
                                disabled={filledCount < 6}
                                className="
                  w-full bg-purple text-white font-bold rounded-xl
                  py-3 text-sm transition-all
                  hover:brightness-110 active:scale-95
                  disabled:opacity-40 disabled:cursor-not-allowed
                  disabled:hover:brightness-100
                "
                            >
                                Verify Email
                            </button>
                        )}

                        {/* divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-border-soft" />
                            <span className="text-text-hint text-xs">didn't receive it?</span>
                            <div className="flex-1 h-px bg-border-soft" />
                        </div>

                        {/* resend section */}
                        <div className="text-center">
                            {canResend ? (
                                <button
                                    onClick={() => resendMutation.mutate()}
                                    disabled={resendMutation.isPending}
                                    className="
                    text-purple-light text-sm font-medium
                    hover:text-purple transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2 mx-auto
                  "
                                >
                                    {resendMutation.isPending ? (
                                        <>
                                            <div className="w-3 h-3 rounded-full border border-bg-surface border-t-purple-light animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <span>↺</span> Resend OTP
                                        </>
                                    )}
                                </button>
                            ) : (
                                <p className="text-text-hint text-sm">
                                    Resend code in{' '}
                                    <span className="text-purple-light font-bold tabular-nums">
                                        {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                                        {String(countdown % 60).padStart(2, '0')}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* back to register */}
                        <div className="text-center mt-6">
                            <button
                                onClick={() => navigate('/register')}
                                className="text-text-hint text-xs hover:text-text-muted transition-colors"
                            >
                                ← Back to register
                            </button>
                        </div>

                    </div>

                    {/* bottom accent */}
                    <div
                        className="h-px w-full"
                        style={{ background: 'linear-gradient(90deg, transparent, #7C3AED, transparent)' }}
                    />

                </div>

                {/* helper tip */}
                <p className="text-text-hint text-xs text-center mt-4">
                    Check spam folder if you don't see the email
                </p>

            </div>
        </div>
    )
}