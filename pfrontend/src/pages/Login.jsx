import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto flex items-center justify-center min-h-[80vh]">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-cyan-400">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              <FaEnvelope className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              <FaLock className="inline mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full px-4 py-3 bg-cyan-500 text-white border border-cyan-600 rounded-lg hover:bg-cyan-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          {error && (
            <div className="text-red-400 text-center text-sm bg-red-900/20 border border-red-500 rounded-lg p-3">
              {error}
            </div>
          )}
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <a 
            href="#" 
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
