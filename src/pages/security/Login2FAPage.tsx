import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, RefreshCw, ArrowLeft } from "lucide-react";

function generateOTP(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.info(`[2FA Mock] Your OTP is: ${otp}`);
  return otp;
}

export default function Login2FAPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const mockOTPRef = useRef<string>(generateOTP());
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const role = user.role;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; 
    const updated = [...otp];
    updated[index] = value.slice(-1); 
    setOtp(updated);
    setError("");

    
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };


  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = () => {
    const entered = otp.join("");
    if (entered.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    
    if (entered !== mockOTPRef.current) {
      setError("Invalid OTP. Please try again.");
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
      return;
    }
    setVerified(true);
    setTimeout(() => {
      navigate(
        role === "investor"
          ? "/dashboard/investor"
          : "/dashboard/entrepreneur",
        { replace: true }
      );
    }, 1200);
  };

  const handleResend = useCallback(() => {
    setOtp(Array(6).fill(""));
    setError("");
    setResent(true);
    mockOTPRef.current = generateOTP();
    setTimeout(() => setResent(false), 3000);
    inputs.current[0]?.focus();
  }, []);

  const handleBack = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white shadow rounded-xl w-full max-w-md px-8 py-10 space-y-6">

        {/* Icon + heading */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center
            ${verified ? "bg-green-100" : "bg-primary-100"}`}>
            <ShieldCheck
              size={28}
              className={verified ? "text-green-600" : "text-primary-600"}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Two-Factor Verification</h1>
          <p className="text-sm text-gray-500">
            A 6-digit code has been sent to{" "}
            <span className="font-medium text-gray-700">{user.email}</span>
            <br />
            <span className="text-xs text-primary-500">
              (Check browser console for the mock OTP)
            </span>
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-500 text-white text-xs
                            flex items-center justify-center font-semibold">
              ✓
            </div>
            <span className="text-sm font-medium text-gray-400">Credentials</span>
          </div>
          <div className="flex-1 h-px bg-primary-300 max-w-[40px]" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs
                            flex items-center justify-center font-semibold">
              2
            </div>
            <span className="text-sm font-medium text-primary-600">Verify OTP</span>
          </div>
        </div>

        {/* Role badge */}
        <div className="flex justify-center">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full
            ${role === "investor"
              ? "bg-purple-100 text-purple-700"
              : "bg-primary-100 text-primary-700"}`}>
            Signing in as: {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        </div>

        {/* OTP input boxes */}
        <div className="flex justify-center gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className={`w-11 h-12 text-center text-xl font-bold rounded-lg border-2
                transition-colors focus:outline-none
                ${error
                  ? "border-red-400 bg-red-50"
                  : digit
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 focus:border-primary-400"
                }
                ${verified ? "border-green-500 bg-green-50" : ""}`}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-center text-sm text-red-500 font-medium">{error}</p>
        )}

        {/* Success message */}
        {verified && (
          <p className="text-center text-sm text-green-600 font-medium">
            ✓ Verified! Redirecting to your dashboard…
          </p>
        )}

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={verified || otp.join("").length < 6}
          className={`w-full py-2.5 rounded-lg font-semibold text-white transition-colors
            ${verified
              ? "bg-green-500 cursor-default"
              : otp.join("").length < 6
              ? "bg-primary-300 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700"}`}
        >
          {verified ? "Verified ✓" : "Verify OTP"}
        </button>

        {/* Resend + Back */}
        <div className="flex items-center justify-between text-sm">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Login
          </button>

          <button
            onClick={handleResend}
            disabled={resent}
            className={`flex items-center gap-1 font-medium transition-colors
              ${resent
                ? "text-green-600 cursor-default"
                : "text-primary-600 hover:text-primary-500"}`}
          >
            <RefreshCw size={14} />
            {resent ? "Code resent!" : "Resend code"}
          </button>
        </div>

      </div>
    </div>
  );
}