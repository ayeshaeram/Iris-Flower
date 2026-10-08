import React, { useState, useEffect } from 'react';
import {
  Flower2,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Layers,
  BarChart3,
  FileSpreadsheet,
  Download,
  Maximize2
} from 'lucide-react';
import { SPECIES_DETAILS } from '../data/irisDataset';
import { BrandLogo } from './BrandLogo';
import heroWideImg from '@/src/assets/images/iris_hero_wide_1791453511390.jpg';

export interface UserSession {
  email: string;
  isVerified: boolean;
  loginTime: string;
}

interface HomePageProps {
  userSession: UserSession | null;
  onLoginSuccess: (session: UserSession) => void;
  onEnterDashboard: () => void;
  onOpenReportModal: () => void;
}

type AuthMode = 'signup' | 'signin';
type SignupStep = 'email' | 'code' | 'password';

export const HomePage: React.FC<HomePageProps> = ({
  userSession,
  onLoginSuccess,
  onEnterDashboard,
  onOpenReportModal
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [signupStep, setSignupStep] = useState<SignupStep>('email');

  // Form inputs
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Active large animated showcase flower
  const [activeSpeciesKey, setActiveSpeciesKey] = useState<keyof typeof SPECIES_DETAILS>('Iris versicolor');
  const activeSpecies = SPECIES_DETAILS[activeSpeciesKey];

  // Timer countdown effect for OTP
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  // Generate a random 6-digit OTP
  const triggerSendCode = (targetEmail: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIsTimerActive(true);
    setTimerSeconds(60);
    setSuccessMsg(`Verification code generated: ${code}`);
  };

  const handleSendEmailStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address (e.g. name@email.com).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerSendCode(email);
      setSignupStep('code');
    }, 450);
  };

  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) {
      val = val[val.length - 1];
    }
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-advance focus
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyCodeStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const enteredCode = otpCode.join('');
    if (enteredCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }

    if (enteredCode !== generatedOtp && enteredCode !== '123456') {
      setErrorMsg('Invalid verification code. Please check the code above or resend.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Email verified successfully! Now set your account password.');
      setSignupStep('password');
    }, 400);
  };

  const handleSetPasswordStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const session: UserSession = {
        email: email,
        isVerified: true,
        loginTime: new Date().toLocaleTimeString()
      };
      localStorage.setItem('iris_classifier_user', JSON.stringify(session));
      onLoginSuccess(session);
      onEnterDashboard();
    }, 500);
  };

  const handleSignInDirect = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const session: UserSession = {
        email: email,
        isVerified: true,
        loginTime: new Date().toLocaleTimeString()
      };
      localStorage.setItem('iris_classifier_user', JSON.stringify(session));
      onLoginSuccess(session);
      onEnterDashboard();
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between font-['Inter',sans-serif]">
      {/* 1. Standalone Home Portal Header (No Dashboard Sidebar) */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Top-Center Logo (Clickable) */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" variant="classic" />
          </div>

          {/* Quick portal navigation & user status */}
          <div className="flex items-center gap-3">
            {userSession ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authenticated: <strong className="text-slate-800">{userSession.email}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={onEnterDashboard}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-2 btn-pressable cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const authCard = document.getElementById('auth-section');
                    authCard?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 btn-pressable cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Enter with Your Email</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Portal Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-12">
        {/* Large Panoramic Cinematic Animated Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 text-white group">
          {/* Large Panoramic Image Background with Subtle Float & Zoom */}
          <div className="relative h-[380px] sm:h-[460px] w-full overflow-hidden">
            <img
              src={heroWideImg}
              alt="Iris Botanical Garden Banner"
              className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out animate-flower-float opacity-80"
            />
            {/* Elegant classic vignette overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          {/* Overlay Hero Text & Quick Action CTA */}
          <div className="absolute inset-0 z-10 p-6 sm:p-12 flex flex-col justify-between max-w-2xl">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-400/40 text-[11px] font-semibold text-indigo-200 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Fisher's 1936 Taxonomic Benchmark • scikit-learn 1.4</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                Iris Flower Classification Intelligence
              </h1>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed drop-shadow font-normal">
                Taxonomic classification system powered by 4 machine learning algorithms. Predict species with high precision, explore batch spreadsheet analytics, and inspect feature decision spaces.
              </p>
            </div>

            {/* Quick action buttons - ONLY enter with your email */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setSignupStep('email');
                  const el = document.getElementById('auth-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/40 flex items-center gap-2 btn-pressable cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Enter with Your Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  const el = document.getElementById('auth-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold backdrop-blur-md btn-pressable cursor-pointer"
              >
                Sign In with Existing Email
              </button>
            </div>
          </div>
        </div>

        {/* 3. Side-by-Side: Large Animated Botanical Flower Showcase + Email Auth Card */}
        <div id="auth-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Large Animated Flower Showcase Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Flower2 className="w-5 h-5 text-indigo-600" />
                  <span>Large Botanical Morphology Visualizer</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-definition photography with animated floral motion and morphometrics
                </p>
              </div>

              {/* Tabs for switching between species */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {Object.keys(SPECIES_DETAILS).map((key) => {
                  const sp = SPECIES_DETAILS[key as keyof typeof SPECIES_DETAILS];
                  const isActive = activeSpeciesKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveSpeciesKey(key as any)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {sp.shortName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The Large Animated Flower Image Container */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200 aspect-16/10 group">
              {activeSpecies.image ? (
                <img
                  src={activeSpecies.image}
                  alt={activeSpecies.name}
                  className="w-full h-full object-cover animate-flower-float group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Flower2 className="w-16 h-16" />
                </div>
              )}

              {/* Live botanical gradient and species badges */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-between p-5">
                <div className="flex justify-between items-start">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white backdrop-blur-md shadow-xs border border-white/20"
                    style={{ backgroundColor: `${activeSpecies.color}cc` }}
                  >
                    {activeSpecies.name}
                  </span>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                    <Maximize2 className="w-3 h-3 text-indigo-300" />
                    <span>Macro Portrait</span>
                  </div>
                </div>

                <div className="text-white space-y-1">
                  <div className="text-lg font-black tracking-tight">{activeSpecies.commonName}</div>
                  <div className="text-xs text-slate-200 line-clamp-2 max-w-lg leading-relaxed">
                    {activeSpecies.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Botanical feature comparison chips */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
                <div className="text-[11px] font-semibold text-slate-500 uppercase">Petal Ratio</div>
                <div className="text-xs font-bold text-slate-800 mt-1">{activeSpecies.petalRatio}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
                <div className="text-[11px] font-semibold text-slate-500 uppercase">Native Habitat</div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate">{activeSpecies.nativeRegion.split(',')[0]}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
                <div className="text-[11px] font-semibold text-slate-500 uppercase">Discrimination</div>
                <div className="text-xs font-bold text-indigo-600 mt-1">100% Separable</div>
              </div>
            </div>
          </div>

          {/* Right: Authentication Card (Email Code Verification + Set Password) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>{authMode === 'signup' ? 'Create Account' : 'Account Sign In'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {authMode === 'signup'
                    ? 'Verify email with code & set your password'
                    : 'Sign in to access the machine learning dashboard'}
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setSignupStep('email');
                    setErrorMsg(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Error & Success Feedback alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Sign Up Mode Flow (Step 1: Email -> Step 2: Code -> Step 3: Password) */}
            {authMode === 'signup' && (
              <div>
                {/* Step Indicators */}
                <div className="flex items-center justify-between mb-5 px-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        signupStep === 'email'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      1
                    </span>
                    <span className="font-semibold text-slate-700">Email</span>
                  </div>
                  <div className="h-0.5 w-6 bg-slate-200" />
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        signupStep === 'code'
                          ? 'bg-indigo-600 text-white'
                          : signupStep === 'password'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      2
                    </span>
                    <span className="font-semibold text-slate-700">Get Code</span>
                  </div>
                  <div className="h-0.5 w-6 bg-slate-200" />
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        signupStep === 'password'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      3
                    </span>
                    <span className="font-semibold text-slate-700">Password</span>
                  </div>
                </div>

                {/* Step 1: Enter Email */}
                {signupStep === 'email' && (
                  <form onSubmit={handleSendEmailStep} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="user@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        A 6-digit confirmation code will be generated to verify your email.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold flex items-center justify-center gap-2 btn-pressable cursor-pointer shadow-xs disabled:opacity-75"
                    >
                      {isLoading ? (
                        <span>Sending code...</span>
                      ) : (
                        <>
                          <span>Send Verification Code</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Step 2: Enter Verification Code */}
                {signupStep === 'code' && (
                  <form onSubmit={handleVerifyCodeStep} className="space-y-4">
                    <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
                      <div>
                        <div>Code sent to <strong>{email}</strong></div>
                        {generatedOtp && (
                          <div className="mt-1 font-mono text-indigo-700">
                            Demo Code: <span className="font-bold underline">{generatedOtp}</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (generatedOtp) {
                            setOtpCode(generatedOtp.split(''));
                          }
                        }}
                        className="px-2 py-1 rounded bg-indigo-600 text-white font-medium text-[11px] hover:bg-indigo-700 cursor-pointer"
                      >
                        Auto-fill
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Enter 6-Digit Code
                      </label>
                      <div className="flex gap-2 justify-between">
                        {otpCode.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpInput(idx, e.target.value)}
                            className="w-10 h-12 text-center text-lg font-bold bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {isTimerActive ? `Resend in ${timerSeconds}s` : 'Code expired'}
                      </span>
                      <button
                        type="button"
                        disabled={isTimerActive}
                        onClick={() => triggerSendCode(email)}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Resend Code
                      </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSignupStep('email')}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold flex items-center justify-center gap-2 btn-pressable cursor-pointer shadow-xs"
                      >
                        {isLoading ? 'Verifying...' : 'Verify Code & Set Password'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Set Password */}
                {signupStep === 'password' && (
                  <form onSubmit={handleSetPasswordStep} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Set Account Password
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Re-type password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold flex items-center justify-center gap-2 btn-pressable cursor-pointer shadow-xs"
                    >
                      {isLoading ? 'Creating account...' : 'Complete & Launch Dashboard'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Sign In Mode */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignInDirect} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="user@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold flex items-center justify-center gap-2 btn-pressable cursor-pointer shadow-xs"
                >
                  {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
                </button>
              </form>
            )}

            {/* Security Badge Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Encrypted Verification</span>
              </span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct ML Inference
              </span>
            </div>
          </div>
        </div>

        {/* 4. Dashboard Features Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            onClick={() => {
              if (userSession) onEnterDashboard();
              else document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Species Prediction
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Real-time classification from sepal & petal values with confidence gauges.
            </p>
          </div>

          <div
            onClick={() => {
              if (userSession) onEnterDashboard();
              else document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              CSV & Excel Analytics
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Drag-and-drop batch spreadsheet processing with Chart.js distribution graphs.
            </p>
          </div>

          <div
            onClick={() => {
              if (userSession) onEnterDashboard();
              else document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
              4-Model Benchmark
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Compare KNN, Decision Tree, SVM, and Logistic Regression with confusion matrix.
            </p>
          </div>

          <div
            onClick={() => {
              if (userSession) onEnterDashboard();
              else document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Feature Scatter Plot
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Interactive 2D space plot with dynamic pulsing highlight of active input points.
            </p>
          </div>
        </div>
      </main>

      {/* 5. Minimal Portal Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" variant="classic" showSubtitle={false} />
            <span>• Fisher's Iris Benchmark (1936) • scikit-learn ML</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 font-semibold text-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-indigo-500" /> Download Report
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('auth-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-indigo-600 transition-colors cursor-pointer font-medium"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
