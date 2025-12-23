import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../App';
import AnimatedPage from '../components/AnimatedPage';

const LoginFormScreen = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="h-screen w-screen bg-white relative overflow-hidden fixed inset-0" style={{ height: '100dvh', maxHeight: '100dvh', touchAction: 'none' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-30 p-2 rounded-full bg-white shadow-md"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>

        {/* Content Container */}
        <div className="relative z-20 h-full flex flex-col items-center justify-start pt-[8vh] px-[4vw] py-[2vh]">
          <div className="w-full max-w-[90vw] sm:max-w-xs mx-auto flex flex-col">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-[1vh]">
              <div className="w-[30vw] h-[30vw] max-w-56 max-h-56 rounded-full border-3 border-green-500 flex items-center justify-center mb-0">
                <img 
                  src="/logo-green.png" 
                  alt="FuelFriendly Logo" 
                  className="w-[25vw] h-[25vw] max-w-48 max-h-48 object-contain"
                />
              </div>
            </div>

            <h2 className="text-[6vw] sm:text-2xl font-bold text-[#3F4249] text-center mb-[1vh]">Sign In</h2>

            {error && (
              <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 mb-[2vh]">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-[1.5vh]">
              <form onSubmit={handleLogin} className="space-y-[1vh]">
                <div className="w-full px-[3vw] py-[1.5vh] rounded-full border border-black/50 bg-white text-center text-[4vw] sm:text-base text-[#3F4249] font-semibold">
                  Customer
                </div>
                
                <input
                  type="text"
                  placeholder="Email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-[4vw] py-[1.5vh] rounded-full border border-black/50 bg-white focus:outline-none focus:border-green-500 text-[4vw] sm:text-base placeholder-black/50"
                  required
                />
                
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-[4vw] py-[1.5vh] rounded-full border border-black/50 bg-white focus:outline-none focus:border-green-500 text-[4vw] sm:text-base placeholder-black/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-[3vw] flex items-center text-[#606268]"
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
                
                <div className="text-right">
                  <button 
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-[4vw] sm:text-base text-[#EF4444] hover:underline"
                  >
                    Forgotten Password
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white py-[2vh] rounded-full text-[4vw] sm:text-sm font-semibold shadow-lg transition-all active:scale-95 hover:shadow-xl flex items-center justify-center disabled:bg-green-500/70"
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
              </form>

              <div className="space-y-[1vh]">
                <div className="flex items-center justify-center space-x-4">
                  <hr className="flex-1 border-gray-300" />
                  <span className="text-[#606268] text-[4vw] sm:text-base underline">Or</span>
                  <hr className="flex-1 border-gray-300" />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setError('');
                      setIsLoading(true);
                      await loginWithGoogle();
                      navigate('/home');
                    } catch (e: any) {
                      console.error('Google login error:', e);
                      setError(e?.message || 'Google login failed.');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center bg-white border border-[#3AC36C] text-[#3F4249] py-[1.5vh] rounded-full text-[3.5vw] sm:text-sm font-normal transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    'Connecting...'
                  ) : (
                    <>
                      <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-[6vw] h-[6vw] max-w-6 max-h-6 mr-2" />
                      Continue with Google
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default LoginFormScreen;