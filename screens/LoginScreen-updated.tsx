import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verificationService } from "../services/verificationService";
import { useAppContext } from '../App';
import AnimatedPage from '../components/AnimatedPage';

const LoginScreenNew = () => {
  const navigate = useNavigate();
  const { updateUser } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // WhatsApp Login State
  const [isWhatsAppLogin, setIsWhatsAppLogin] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back!");
      
      // Create user data
      const userData = {
        id: `user-${Date.now()}`,
        fullName: email.split('@')[0],
        email: email,
        phone: '',
        city: '',
        avatarUrl: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
        vehicles: []
      };
      
      updateUser(userData);
      navigate("/home");
    }, 1500);
  };

  const handleSendOtp = async () => {
    if (!phone) {
      toast.error("Please enter your WhatsApp number");
      return;
    }

    setIsLoading(true);
    // Use phone as dummy email key
    const dummyEmail = `${phone}@whatsapp.login`;

    // Simulate sending OTP via WhatsApp service
    const result = await verificationService.sendVerificationCode(dummyEmail, phone, "User");

    setIsLoading(false);

    if (result.success) {
      setShowOtpInput(true);
      toast.success("Verification code sent to WhatsApp!");
    } else {
      toast.error(result.message || "Failed to send code");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    const dummyEmail = `${phone}@whatsapp.login`;

    // Verify code
    const result = verificationService.verifyCode(dummyEmail, otp);

    if (result.success) {
      // Complete login
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Logged in successfully!");
        
        // Create user data
        const userData = {
          id: `user-${Date.now()}`,
          fullName: phone,
          email: '',
          phone: phone,
          city: '',
          avatarUrl: `https://ui-avatars.com/api/?name=${phone}&background=random`,
          vehicles: []
        };
        
        updateUser(userData);
        navigate("/home");
      }, 1000);
    } else {
      setIsLoading(false);
      toast.error(result.message || "Invalid code");
    }
  };

  return (
    <AnimatedPage>
      <div className="h-screen bg-white flex flex-col relative overflow-hidden">
        {/* Top Wave */}
        <img 
          src="/atas.png" 
          alt="" 
          className="absolute top-0 left-0 w-full z-0 pointer-events-none" 
        />

        {/* Bottom Wave */}
        <img 
          src="/bawah.png" 
          alt="" 
          className="absolute bottom-0 left-0 w-full z-0 pointer-events-none" 
        />

        {/* Content */}
        <div className="flex-1 px-8 pt-12 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo & Header */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-40 h-40 mb-4 relative flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="FuelFriendly"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* "Sign In" Text */}
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h1>

              {/* Customer Pill */}
              <div className="w-full py-3 rounded-full border border-gray-300 text-center font-semibold text-gray-700 mb-6">
                Customer
              </div>
            </div>

            {!isWhatsAppLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Input */}
                <div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-6 bg-white border border-gray-400 rounded-full text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Email or phone number"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-6 pr-12 bg-white border border-gray-400 rounded-full text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 active:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[#FF6B6B] text-sm font-medium hover:text-[#FF5252] transition-colors"
                  >
                    Forgotten Password
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#4ADE80] text-white text-lg font-bold rounded-full hover:bg-green-500 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing in...
                    </div>
                  ) : (
                    'Log In'
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                {!showOtpInput ? (
                  <>
                    <div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-12 px-6 bg-white border border-gray-400 rounded-full text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="WhatsApp Number (e.g. 08123456789)"
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="w-full h-12 bg-[#25D366] text-white text-lg font-bold rounded-full hover:bg-green-600 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-2"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending Code...
                        </div>
                      ) : (
                        'Send WhatsApp Code'
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-gray-600">Enter code sent to {phone}</p>
                      <button onClick={() => setShowOtpInput(false)} className="text-green-500 text-sm font-medium">Change Number</button>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full h-12 px-6 bg-white border border-gray-400 rounded-full text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all text-center tracking-[0.5em] font-bold"
                        placeholder="0000"
                        maxLength={4}
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                      className="w-full h-12 bg-[#4ADE80] text-white text-lg font-bold rounded-full hover:bg-green-500 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-2"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Verifying...
                        </div>
                      ) : (
                        'Verify & Login'
                      )}
                    </button>
                    <button
                      onClick={handleSendOtp}
                      className="w-full text-gray-500 text-sm mt-2 hover:text-gray-700"
                    >
                      Resend Code
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsWhatsAppLogin(false)}
                  className="w-full text-gray-500 text-sm mt-4 hover:text-gray-700"
                >
                  Back to Email Login
                </button>
              </div>
            )}

            {/* Or Divider */}
            {!isWhatsAppLogin && (
              <>
                <div className="flex items-center justify-center py-6">
                  <span className="text-gray-400 text-sm border-b border-gray-300 px-2 pb-0.5">Or</span>
                </div>

                {/* Login with WhatsApp Button (Entry Point) */}
                <button
                  onClick={() => setIsWhatsAppLogin(true)}
                  className="w-full h-12 bg-[#25D366] text-white text-base font-bold rounded-full hover:brightness-105 active:scale-[0.98] transition-all duration-150 flex items-center justify-center mb-4 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Continue with WhatsApp
                </button>

                <button className="w-full h-12 border border-green-400 text-gray-700 text-base font-medium rounded-full hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 flex items-center justify-center mb-8">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </>
            )}
          </motion.div>
        </div>

        {/* Bottom Sign Up */}
        <div className="px-8 pb-8 z-10 relative">
          <p className="text-center text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-green-500 font-semibold active:text-green-600 transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default LoginScreenNew;