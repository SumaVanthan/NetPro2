
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Check, Smartphone, Mail, Camera, 
  PenTool, Building2, User, FileText, ShieldCheck, Zap, Download,
  Loader2, CreditCard, LogIn, Upload
} from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fnoEnabled, setFnoEnabled] = useState(false);

  // OTP States
  const [mobileOtp, setMobileOtp] = useState(['', '', '', '']);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '']);

  const steps = [
    { id: 0, label: "Welcome" },
    { id: 1, label: "Verify Contact" },
    { id: 2, label: "Identity Check" }, // PAN
    { id: 3, label: "E-KYC Consent" }, 
    { id: 4, label: "Fetching Data" },     
    { id: 5, label: "Liveness Check" },
    { id: 6, label: "Signature" },
    { id: 7, label: "Personal Details" },
    { id: 8, label: "Bank Account" },
    { id: 9, label: "Nominee" },        
    { id: 10, label: "Declarations" }, 
    { id: 11, label: "Segments" },
    { id: 12, label: "eSign" },
    { id: 13, label: "Done" }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Simulation delay for "fetching" steps
      if(currentStep === 3) { // Going to digilocker sim
        setCurrentStep(prev => prev + 1);
        setTimeout(() => setCurrentStep(prev => prev + 1), 2500);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
    else navigate('/');
  };

  // --- OTP Logic ---
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: 'mobile' | 'email'
  ) => {
    const value = e.target.value;
    // Allow only numbers and max 1 digit
    if (isNaN(Number(value))) return;
    
    const newOtp = type === 'mobile' ? [...mobileOtp] : [...emailOtp];
    
    // Take only the last character if user somehow pastes or types more
    newOtp[index] = value.substring(value.length - 1);
    
    if (type === 'mobile') setMobileOtp(newOtp);
    else setEmailOtp(newOtp);

    // Auto focus next
    if (value && index < 3) {
        const nextId = type === 'mobile' ? `m-${index + 1}` : `e-${index + 1}`;
        document.getElementById(nextId)?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    type: 'mobile' | 'email'
  ) => {
    const otpState = type === 'mobile' ? mobileOtp : emailOtp;
    if (e.key === 'Backspace' && !otpState[index] && index > 0) {
        const prevId = type === 'mobile' ? `m-${index - 1}` : `e-${index - 1}`;
        document.getElementById(prevId)?.focus();
    }
  };

  // --- Canvas Logic for Signature ---
  useEffect(() => {
    if (currentStep === 6 && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Set size
        const rect = canvas.parentElement?.getBoundingClientRect();
        if(rect) {
            canvas.width = rect.width;
            canvas.height = rect.height;
        }

        ctx.strokeStyle = "#F9C80E"; // Shriram Yellow signature
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        let drawing = false;

        const getPos = (e: MouseEvent | TouchEvent) => {
            const r = canvas.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            return { x: clientX - r.left, y: clientY - r.top };
        };

        const start = (e: any) => { drawing = true; ctx.beginPath(); const pos = getPos(e); ctx.moveTo(pos.x, pos.y); };
        const move = (e: any) => { if (drawing) { e.preventDefault(); const pos = getPos(e); ctx.lineTo(pos.x, pos.y); ctx.stroke(); } };
        const end = () => { drawing = false; };

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', move);
        canvas.addEventListener('mouseup', end);
        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', move, { passive: false });
        canvas.addEventListener('touchend', end);

        return () => {
            canvas.removeEventListener('mousedown', start);
            canvas.removeEventListener('mousemove', move);
            canvas.removeEventListener('mouseup', end);
            canvas.removeEventListener('touchstart', start);
            canvas.removeEventListener('touchmove', move);
            canvas.removeEventListener('touchend', end);
        };
    }
  }, [currentStep]);

  const clearSig = () => {
      if(canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
  };

  // --- Render Helper ---
  const InputField = ({ icon: Icon, className = '', ...props }: any) => (
      <div className="relative group w-full">
          {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-shriram-yellow transition-colors pointer-events-none" />}
          <input 
            className={`w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 ${Icon ? 'pl-12' : 'pl-4'} pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-shriram-yellow/50 focus:bg-[#222] transition-all ${className}`}
            {...props}
          />
      </div>
  );

  const PrimaryButton = ({ onClick, children, className = '' }: any) => (
      <button 
        onClick={onClick}
        className={`w-full bg-shriram-yellow text-black font-bold py-3.5 rounded-xl text-base shadow-[0_4px_20px_rgba(249,200,14,0.15)] active:scale-[0.98] transition-all hover:bg-[#E5B80B] ${className}`}
      >
          {children}
      </button>
  );

  // Calculate progress
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-shriram-bg text-white flex justify-center">
      <div className="w-full max-w-md bg-shriram-bg min-h-screen flex flex-col relative">
        
        {/* Header (Hidden on Welcome & Done) */}
        {currentStep > 0 && currentStep < 13 && (
            <div className="sticky top-0 bg-shriram-bg/80 backdrop-blur-md z-50 pt-4 px-4 pb-2 border-b border-white/5">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={prevStep} className="p-2 -ml-2 text-gray-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-xs font-bold text-gray-400">
                        STEP {currentStep}/{steps.length - 1}
                    </div>
                    <div className="w-8"></div> {/* Spacer */}
                </div>
                <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-shriram-yellow transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-2 text-sm font-bold text-white text-center animate-in fade-in slide-in-from-bottom-1">
                    {steps[currentStep].label}
                </div>
            </div>
        )}

        <div className="flex-1 p-6 overflow-y-auto pb-24 no-scrollbar">
            {/* STEP 0: Welcome */}
            {currentStep === 0 && (
                <div className="flex flex-col h-full pt-6">
                    <div className="flex-1">
                        <div className="w-14 h-14 bg-shriram-yellow rounded-2xl flex items-center justify-center mb-4 text-black shadow-[0_0_30px_rgba(249,200,14,0.3)]">
                            <Zap size={28} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-bold mb-1 text-white">Net Pro</h1>
                        <p className="text-gray-400 text-xs mb-6">By Shriram Insight</p>

                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">MOBILE NUMBER</label>
                                <div className="flex gap-2">
                                    <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-14 flex items-center justify-center text-gray-400 font-mono text-sm">+91</div>
                                    <InputField type="tel" placeholder="98765 43210" icon={Smartphone} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">EMAIL ADDRESS</label>
                                <InputField type="email" placeholder="name@example.com" icon={Mail} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mt-auto">
                        <PrimaryButton onClick={nextStep}>Open Demat Account</PrimaryButton>

                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-3.5 rounded-xl bg-[#1A1A1A] border border-white/20 text-white text-sm font-bold hover:bg-[#252525] hover:border-white/30 transition-all flex items-center justify-center gap-2"
                        >
                            <LogIn size={16} /> Login with SSO
                        </button>
                        
                        <div className="flex items-center justify-center gap-3 my-2 opacity-60">
                            <div className="h-px bg-white/20 w-full"></div>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium">OR CONTINUE WITH</span>
                            <div className="h-px bg-white/20 w-full"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            <button className="py-3.5 rounded-xl bg-white text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                                Google
                            </button>
                            <button className="py-3.5 rounded-xl bg-[#1A1A1A] border border-white/20 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#252525] transition-colors">
                                Apple
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-500 mt-2">
                            By continuing, you agree to our <span className="text-gray-300">Terms</span> & <span className="text-gray-300">Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            )}

            {/* STEP 1: OTP */}
            {currentStep === 1 && (
                <div>
                    <h2 className="text-xl font-bold mb-2 text-white">Verification</h2>
                    <p className="text-gray-400 text-sm mb-8">Enter the OTPs sent to your mobile & email.</p>
                    
                    <div className="space-y-5">
                        <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/10">
                            <div className="flex justify-between mb-4">
                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><Smartphone size={12}/> MOBILE OTP</span>
                                <button className="text-xs text-shriram-yellow font-bold">Resend</button>
                            </div>
                            <div className="flex gap-3">
                                {mobileOtp.map((digit, i) => (
                                    <input 
                                        key={`m-${i}`} 
                                        id={`m-${i}`}
                                        type="tel" 
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e, i, 'mobile')}
                                        onKeyDown={(e) => handleOtpKeyDown(e, i, 'mobile')}
                                        className="w-full h-12 rounded-xl bg-black/40 border border-white/10 text-center text-lg font-bold text-white focus:border-shriram-yellow focus:bg-black/60 focus:outline-none transition-colors" 
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/10">
                            <div className="flex justify-between mb-4">
                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><Mail size={12}/> EMAIL OTP</span>
                                <button className="text-xs text-shriram-yellow font-bold">Resend</button>
                            </div>
                            <div className="flex gap-3">
                                {emailOtp.map((digit, i) => (
                                    <input 
                                        key={`e-${i}`} 
                                        id={`e-${i}`}
                                        type="tel"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e, i, 'email')}
                                        onKeyDown={(e) => handleOtpKeyDown(e, i, 'email')}
                                        className="w-full h-12 rounded-xl bg-black/40 border border-white/10 text-center text-lg font-bold text-white focus:border-shriram-yellow focus:bg-black/60 focus:outline-none transition-colors" 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <PrimaryButton onClick={nextStep} className="mt-8">Verify & Continue</PrimaryButton>
                </div>
            )}

            {/* STEP 2: PAN */}
            {currentStep === 2 && (
                <div>
                     <h2 className="text-xl font-bold mb-6 text-white">Identify Yourself</h2>
                     <div className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">PAN NUMBER</label>
                            <InputField type="text" placeholder="ABCDE1234F" icon={CreditCard} className="uppercase font-mono tracking-widest" maxLength={10} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">DATE OF BIRTH</label>
                            <InputField type="date" />
                        </div>
                    </div>
                    <PrimaryButton onClick={nextStep} className="mt-10">Check Eligibility</PrimaryButton>
                </div>
            )}

            {/* STEP 3: E-KYC Hub */}
            {currentStep === 3 && (
                <div className="text-center pt-6">
                    <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <ShieldCheck size={36} className="text-shriram-yellow" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Digilocker E-KYC</h2>
                    <p className="text-gray-400 text-sm mt-2 px-4 mb-8">We need to verify your identity digitally to open your account instantly.</p>

                    <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-white/10 text-left mb-8">
                        <div className="p-4 border-b border-white/5 flex gap-4 items-center">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">1</div>
                            <div className="text-sm text-gray-300">Fetch Aadhaar via Digilocker</div>
                        </div>
                        <div className="p-4 border-b border-white/5 flex gap-4 items-center">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">2</div>
                            <div className="text-sm text-gray-300">Live Selfie Check</div>
                        </div>
                        <div className="p-4 flex gap-4 items-center">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">3</div>
                            <div className="text-sm text-gray-300">Digital Signature</div>
                        </div>
                    </div>

                    <PrimaryButton onClick={nextStep}>Connect Digilocker</PrimaryButton>
                </div>
            )}

            {/* STEP 4: Sim Loading */}
            {currentStep === 4 && (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <Loader2 className="w-12 h-12 text-shriram-yellow animate-spin mb-6" />
                    <h3 className="text-lg font-bold text-white">Fetching Documents...</h3>
                    <p className="text-sm text-gray-400 mt-2">Securely connecting to UIDAI</p>
                </div>
            )}

            {/* STEP 5: Selfie */}
            {currentStep === 5 && (
                <div className="text-center pt-4">
                     <h2 className="text-xl font-bold mb-2 text-white">Liveness Check</h2>
                     <p className="text-sm text-gray-400 mb-8">Ensure you are in a well-lit area.</p>

                     <div className="w-64 h-64 rounded-full border-4 border-shriram-yellow mx-auto mb-8 relative overflow-hidden bg-black">
                        <img src="https://thispersondoesnotexist.com/" className="w-full h-full object-cover opacity-80" alt="Selfie" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Camera className="text-white/50 w-10 h-10" />
                        </div>
                     </div>

                     <PrimaryButton onClick={nextStep}>Capture Selfie</PrimaryButton>
                </div>
            )}

            {/* STEP 6: Signature */}
            {currentStep === 6 && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Digital Signature</h2>
                        <button onClick={clearSig} className="text-xs text-shriram-yellow font-bold">Clear</button>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">Sign inside the box below matching your PAN card.</p>

                    <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-white/20 h-64 touch-none relative cursor-crosshair">
                        <canvas ref={canvasRef} className="w-full h-full" />
                        <div className="absolute bottom-2 right-2 text-[10px] text-gray-500 pointer-events-none flex items-center gap-1">
                            <PenTool size={10} /> Sign here
                        </div>
                    </div>

                    <PrimaryButton onClick={nextStep} className="mt-8">Save Signature</PrimaryButton>
                </div>
            )}

            {/* STEP 7: Personal Details */}
            {currentStep === 7 && (
                <div>
                    <h2 className="text-xl font-bold mb-6 text-white">Personal Details</h2>

                    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-shriram-yellow/30 shadow-lg shadow-shriram-yellow/5 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-md">
                            Fetched from EKYC
                        </div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Address from Aadhaar</h3>
                        <p className="text-sm font-medium text-white leading-relaxed">
                            12/4, Cyber City Towers, MG Road<br/>
                            Bangalore, Karnataka - 560001
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">MOTHER'S NAME</label>
                            <InputField placeholder="Enter Mother's Name" icon={User} />
                        </div>

                        <div>
                             <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">MARITAL STATUS</label>
                             <div className="relative">
                                <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 appearance-none text-white text-sm focus:border-shriram-yellow/50 outline-none">
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">CITIZENSHIP</label>
                                <input type="text" value="Indian" disabled className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 text-gray-500 text-sm cursor-not-allowed focus:outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">RESIDENTIAL STATUS</label>
                                <input type="text" value="Resident India" disabled className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 text-gray-500 text-sm cursor-not-allowed focus:outline-none" />
                            </div>
                        </div>

                         <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">OCCUPATION</label>
                                <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 appearance-none text-gray-300 text-sm focus:border-shriram-yellow/50 outline-none">
                                    <option>Private Sector</option>
                                    <option>Public Sector</option>
                                    <option>Business</option>
                                </select>
                            </div>
                            <div className="relative">
                                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">ANNUAL INCOME</label>
                                <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 appearance-none text-gray-300 text-sm focus:border-shriram-yellow/50 outline-none">
                                    <option>1-5 Lakh</option>
                                    <option>5-10 Lakh</option>
                                    <option>10-25 Lakh</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <PrimaryButton onClick={nextStep} className="mt-8">Confirm Details</PrimaryButton>
                </div>
            )}

            {/* STEP 8: Bank */}
            {currentStep === 8 && (
                <div>
                    <h2 className="text-xl font-bold mb-4 text-white">Link Bank Account</h2>
                    <p className="text-sm text-gray-400 mb-6">We will deposit ₹1 to verify your account.</p>

                    <div className="space-y-4">
                        <InputField placeholder="Account Number" icon={CreditCard} />
                        <div className="relative">
                            <InputField placeholder="IFSC Code" icon={Building2} defaultValue="HDFC0001234" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-green-500">VERIFIED</span>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex items-start gap-3 p-3 bg-[#1A1A1A] rounded-lg border border-white/10">
                        <div className="p-2 bg-white rounded-md">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/HDFC_Bank_Logo.svg" className="w-6 h-6 object-contain" alt="Bank" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">HDFC Bank</div>
                            <div className="text-xs text-gray-400">Koramangala Branch</div>
                        </div>
                    </div>

                    <PrimaryButton onClick={nextStep} className="mt-8">Link Account</PrimaryButton>
                </div>
            )}

            {/* STEP 9: Nominee */}
            {currentStep === 9 && (
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Add Nominee</h2>
                        <button onClick={nextStep} className="text-xs font-bold text-shriram-yellow">Skip</button>
                    </div>
                    
                    <div className="space-y-4">
                        <InputField placeholder="Nominee Name" icon={User} />
                        <div className="grid grid-cols-2 gap-3">
                            <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 appearance-none text-gray-300 text-sm">
                                <option>Spouse</option>
                                <option>Parent</option>
                                <option>Sibling</option>
                            </select>
                            <input type="date" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 text-gray-300 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">ADDRESS</label>
                            <textarea className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3 px-4 text-white h-24 focus:border-shriram-yellow/50 outline-none placeholder-gray-500" placeholder="Same as primary address..."></textarea>
                        </div>
                    </div>

                    <PrimaryButton onClick={nextStep} className="mt-6">Save Nominee</PrimaryButton>
                </div>
            )}

            {/* STEP 10: Declarations */}
            {currentStep === 10 && (
                <div>
                    <h2 className="text-xl font-bold mb-6 text-white">Final Declarations</h2>

                    {/* PAML Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-white mb-3">PAML</h3>
                        <div className="space-y-4">
                             {/* Field 1 */}
                             <div>
                                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">I have been investing in the stock market</label>
                                <div className="relative">
                                    <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 appearance-none text-white text-sm focus:border-shriram-yellow/50 outline-none">
                                        <option>Less than 1 year</option>
                                        <option>1–3 years</option>
                                        <option>3–5 years</option>
                                        <option>More than 5 years</option>
                                        <option>I have never invested</option>
                                    </select>
                                </div>
                             </div>

                             {/* Field 2 */}
                             <div>
                                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">Normally, I/We invest in the stock market</label>
                                <div className="relative">
                                    <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 appearance-none text-white text-sm focus:border-shriram-yellow/50 outline-none">
                                        <option>Regularly (monthly/quarterly)</option>
                                        <option>Occasionally (few times a year)</option>
                                        <option>Rarely (once a year or less)</option>
                                        <option>Not sure</option>
                                        <option>I do not invest currently</option>
                                    </select>
                                </div>
                             </div>

                             {/* Field 3 */}
                             <div>
                                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">I/We hereby declare that I/We can take loss</label>
                                <div className="relative">
                                    <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 appearance-none text-white text-sm focus:border-shriram-yellow/50 outline-none">
                                        <option>No, I cannot take any loss</option>
                                        <option>I can take small losses</option>
                                        <option>I can take moderate losses</option>
                                        <option>I can take high losses</option>
                                        <option>I accept market-linked risk</option>
                                    </select>
                                </div>
                             </div>

                             {/* Field 4 */}
                             <div>
                                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">I/We hereby declare that the return expectation from the investment in any market conditions is</label>
                                <div className="relative">
                                    <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 appearance-none text-white text-sm focus:border-shriram-yellow/50 outline-none">
                                        <option>5–10% annually</option>
                                        <option>10–15% annually</option>
                                        <option>15–20% annually</option>
                                        <option>Above 20% annually</option>
                                        <option>No fixed return expectation</option>
                                        <option>I expect returns aligned with market conditions</option>
                                    </select>
                                </div>
                             </div>
                        </div>
                    </div>
                    
                    {/* Declarations List */}
                    <div className="bg-[#1A1A1A] rounded-xl border border-white/10 divide-y divide-white/5">
                        {[
                            "I am NOT a Politically Exposed Person (PEP)",
                            "I accept Terms & Conditions"
                        ].map((text, i) => (
                            <label key={i} className="flex gap-4 p-4 items-center cursor-pointer hover:bg-white/5 transition-colors">
                                <input type="checkbox" defaultChecked className="w-5 h-5 accent-shriram-yellow rounded bg-black" />
                                <span className="text-sm text-gray-300">{text}</span>
                            </label>
                        ))}
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Unused Funds Settlement</h3>
                        <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-white/10">
                            <button className="flex-1 py-2.5 text-sm text-gray-400 font-medium">30 Days</button>
                            <button className="flex-1 py-2.5 text-sm bg-shriram-yellow text-black font-bold rounded-lg shadow-lg">90 Days</button>
                        </div>
                    </div>

                    <PrimaryButton onClick={nextStep} className="mt-8">Confirm</PrimaryButton>
                </div>
            )}

            {/* STEP 11: Segments */}
            {currentStep === 11 && (
                <div>
                    <h2 className="text-xl font-bold mb-6 text-white">Active Segments</h2>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-4 bg-shriram-yellow/10 border border-shriram-yellow text-center rounded-xl">
                            <Check className="w-6 h-6 text-shriram-yellow mx-auto mb-2" />
                            <div className="text-sm font-bold text-white">Equity & MF</div>
                            <div className="text-[10px] text-gray-400">Active</div>
                        </div>
                         <div className="p-4 bg-[#1A1A1A] border border-white/5 text-center rounded-xl opacity-50">
                            <div className="text-sm font-bold text-white mt-8">Commodity</div>
                            <div className="text-[10px] text-gray-500">Inactive</div>
                        </div>
                    </div>

                    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="font-bold text-sm text-white">Futures & Options</h4>
                                <p className="text-[10px] text-gray-400 mt-0.5">Requires Income Proof (Bank Statement/ITR)</p>
                            </div>
                            <div 
                                onClick={() => setFnoEnabled(!fnoEnabled)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${fnoEnabled ? 'bg-shriram-yellow' : 'bg-gray-700'}`}
                            >
                                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${fnoEnabled ? 'left-7' : 'left-1'}`}></div>
                            </div>
                        </div>

                        {fnoEnabled && (
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1.5 block">INCOME PROOF TYPE</label>
                                    <div className="relative">
                                        <select className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 appearance-none text-white text-sm focus:border-shriram-yellow/50 outline-none">
                                            <option>6 Months Bank Statement</option>
                                            <option>Latest ITR Acknowledgement</option>
                                            <option>Latest Salary Slip</option>
                                            <option>Networth Certificate</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <button disabled className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-500 gap-2 cursor-not-allowed bg-white/5 opacity-70">
                                    <Upload size={20} />
                                    <span className="text-xs font-medium">Upload Document (Disabled)</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <PrimaryButton onClick={nextStep} className="mt-8">Continue</PrimaryButton>
                </div>
            )}

            {/* STEP 12: eSign */}
            {currentStep === 12 && (
                <div className="pt-4">
                    <h2 className="text-xl font-bold mb-6 text-white">Aadhaar eSign</h2>
                    
                    <div className="bg-white text-black rounded-2xl p-6 shadow-2xl">
                         <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                             <span className="font-bold text-lg">NSDL e-Gov</span>
                             <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                         </div>
                         
                         <p className="text-xs text-gray-600 leading-relaxed mb-6">
                            I hereby authorize NSDL e-Gov to use my Aadhaar Number to e-sign the account opening form for Net Pro by Shriram Insight.
                         </p>

                         <input type="text" placeholder="Enter Aadhaar Number" className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-sm font-bold mb-4 placeholder-gray-400 text-black" />
                         
                         <button onClick={nextStep} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
                             Send OTP
                         </button>
                    </div>
                </div>
            )}

             {/* STEP 13: Done */}
             {currentStep === 13 && (
                <div className="flex flex-col items-center justify-center h-full pt-12 text-center">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                        <Check className="w-12 h-12 text-black" strokeWidth={4} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-white">You're All Set!</h2>
                    <p className="text-gray-400 mb-10 px-8">Your application ID is <span className="text-white font-mono">#SHR-8821</span>. Activation usually takes 24 hours.</p>

                    <div className="w-full bg-[#1A1A1A] p-4 rounded-xl border border-white/10 flex items-center justify-between mb-8">
                        <div className="text-left flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <FileText size={20} className="text-shriram-yellow" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Application Form</div>
                                <div className="text-sm font-bold text-white">Download PDF</div>
                            </div>
                        </div>
                        <Download size={18} className="text-gray-400" />
                    </div>

                    <PrimaryButton onClick={() => navigate('/dashboard')}>Go to Dashboard</PrimaryButton>
                </div>
             )}
        </div>

      </div>
    </div>
  );
};

export default Signup;
