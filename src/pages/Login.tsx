import { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth, type User } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
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
          <svg className="w-9 h-9 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5L90 28V72L50 95L10 72V28L50 5Z" fill="#5c1642" />
            <path d="M43 25 C43 25, 43 75, 43 75 L49 75 C62 75, 73 68, 73 53 C73 38, 62 31, 49 31 L49 25 Z" fill="white" />
            <path d="M49 37 C58 37, 65 42, 65 53 C65 64, 58 69, 49 69 L49 37 Z" fill="#5c1642" />
            <rect x="51" y="43" width="11" height="4" rx="2" fill="#E29A26" />
            <rect x="51" y="51" width="11" height="4" rx="2" fill="#E29A26" />
            <rect x="51" y="59" width="11" height="4" rx="2" fill="#E29A26" />
          </svg>
          <span className="text-3xl font-bold tracking-tight text-gray-900">Bumble <span className="text-[#E29A26]">ERP</span></span>
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
              setIsLoading(true);
              try {
                const response = await api.post('/auth/login', { email, password });
                
                if (response.refreshToken) {
                  localStorage.setItem('refreshToken', response.refreshToken);
                }

                const userData: User = {
                  id: response.id || '',
                  username: response.username,
                  email: email, // use the input email
                  roles: response.roles || [],
                  organizationId: response.organizationId || null,
                  organizationName: response.organizationName || null,
                  companyId: null, // login response currently doesn't have companyId, adjust if needed
                  companyName: null,
                  effectivePermissions: response.effectivePermissions || []
                };
                
                login(response.token, userData);
                
                // Optional: keep old localStorage items if other parts still depend on them (though they should use AuthProvider now)
                if (response.roles) localStorage.setItem('roles', JSON.stringify(response.roles));
                if (response.username) localStorage.setItem('username', response.username);
                if (response.organizationId) localStorage.setItem('organizationId', response.organizationId);
                if (response.organizationName) localStorage.setItem('organizationName', response.organizationName);
                
                sessionStorage.setItem('showWelcomeToast', 'true');
                
                if (response.roles && response.roles.includes('ROLE_SUPER_ADMIN')) {
                  navigate('/superadmin/organizations');
                } else if (response.roles && response.roles.includes('ROLE_COMPANY_ADMIN')) {
                  navigate('/companydashboard');
                } else if (response.roles && response.roles.includes('ROLE_EMPLOYEE')) {
                  navigate('/employeedashboard');
                } else {
                  navigate('/orgdashboard');
                }
                  
              } catch (err) {
                console.error(err);
                setError(true);
                setTimeout(() => setError(false), 3000);
              } finally {
                setIsLoading(false);
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
              disabled={isLoading}
              className="w-full bg-[#792359] hover:bg-[#631c49] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-[#792359]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#792359] transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


