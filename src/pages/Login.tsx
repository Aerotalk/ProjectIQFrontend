import { useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf9fb] relative overflow-hidden">
      {/* --- Clean Geometric Animated Background --- */}
      <style>
        {`
          @keyframes grid-pan {
            0% { transform: translateY(0); }
            100% { transform: translateY(-40px); }
          }
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .animate-grid {
            animation: grid-pan 3s linear infinite;
          }
          .animate-float-slow {
            animation: float 8s ease-in-out infinite;
          }
          .animate-float-slower {
            animation: float 12s ease-in-out infinite reverse;
          }
        `}
      </style>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gray-50/50">
        <div 
          className="absolute w-full h-[200%] animate-grid opacity-40"
          style={{
            backgroundImage: 'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        {/* Geometric Floating Elements (Distinct) */}
        <div className="absolute top-[10%] left-[10%] w-28 h-28 border-4 border-[#792359]/40 rounded-full animate-float-slow opacity-90 shadow-sm"></div>
        <div className="absolute bottom-[15%] right-[10%] w-36 h-36 border-4 border-[#792359]/30 rotate-45 animate-float-slower opacity-90 shadow-sm"></div>
        <div className="absolute top-[40%] right-[18%] w-16 h-16 border-[5px] border-[#792359]/50 rounded-full animate-float-slow opacity-100" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[30%] left-[15%] w-20 h-20 bg-[#792359]/10 rotate-12 rounded-lg animate-float-slower opacity-80 backdrop-blur-sm border border-[#792359]/20" style={{ animationDelay: '3s' }}></div>
      </div>
      {/* ---------------------------------- */}

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-[440px] px-6">
        
        {/* Error Toast */}
        <div className={`absolute -top-16 left-6 right-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform z-50 ${error ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'}`}>
          <AlertCircle size={20} />
          <span className="text-sm font-medium">Invalid email or password.</span>
        </div>
        
        {/* Header/Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-[#792359] rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-md">
            IQ
          </div>
          <span className="text-3xl font-bold tracking-tight text-gray-900">PROJECT IQ</span>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-[#792359]/5 border border-white p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Log in to your account</h1>
            <div className="w-12 h-[3px] bg-[#792359] mx-auto mt-4 mb-3 rounded-full"></div>
            <p className="text-sm text-gray-500 mt-2">Enter your email and password below to log in</p>
          </div>

          <form 
            className="space-y-6" 
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await api.post('/auth/login', { email, password });
                localStorage.setItem('token', response.token);
                if (response.refreshToken) {
                  localStorage.setItem('refreshToken', response.refreshToken);
                }
                if (response.roles) {
                  localStorage.setItem('roles', JSON.stringify(response.roles));
                }
                if (response.username) {
                  localStorage.setItem('username', response.username);
                }
                if (response.organizationId) {
                  localStorage.setItem('organizationId', response.organizationId);
                }
                if (response.organizationName) {
                  localStorage.setItem('organizationName', response.organizationName);
                }
                
                sessionStorage.setItem('showWelcomeToast', 'true');
                if (response.roles && response.roles.includes('ROLE_SUPER_ADMIN')) {
                  navigate('/superadmin/organizations', { replace: true });
                } else if (response.roles && response.roles.includes('ROLE_COMPANY_ADMIN')) {
                  navigate('/companydashboard', { replace: true });
                } else if (response.roles && response.roles.includes('ROLE_EMPLOYEE')) {
                  navigate('/employeedashboard', { replace: true });
                } else {
                  navigate('/orgdashboard', { replace: true });
                }
              } catch (err) {
                console.error(err);
                setError(true);
                setTimeout(() => setError(false), 3000);
              }
            }}
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex">
                Email address <span className="text-[#792359] ml-1">*</span>
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#792359] focus:ring-2 focus:ring-[#792359]/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 bg-white/50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 flex">
                  Password <span className="text-[#792359] ml-1">*</span>
                </label>
                <a href="#" className="text-sm text-[#792359] hover:text-[#52173c] font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-[#792359] focus:ring-2 focus:ring-[#792359]/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 bg-white/50 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-1 pb-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-gray-300 text-[#792359] focus:ring-[#792359] cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2.5 text-sm font-medium text-gray-600 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#792359] hover:bg-[#631c49] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-[#792359]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] transform active:scale-[0.98]"
            >
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


