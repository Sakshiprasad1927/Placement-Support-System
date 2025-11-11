import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Notifications from './Notifications'

/**
 * Role-aware top navigation
 * - Shows different links based on the current user's role stored in localStorage or encoded in the JWT
 * - Keeps UI simple: Student / Company / Admin portals and auth links
 */
export default function NavBar(){
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  let role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Try to parse role from JWT if role not explicitly saved in localStorage
  try{ if(!role && token){ const payload = JSON.parse(atob(token.split('.')[1])); role = payload.role } }catch(e){}

  function logout(){
    // Clear client-side session and navigate to home
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setMobileMenuOpen(false);
    navigate('/');
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/igdtuw-logo.png" 
                alt="IGDTUW Logo" 
                className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
              />
              <div className="hidden sm:block">
                <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  IGDTUW
                </div>
                <div className="text-xs text-gray-600 -mt-1">Placement Portal</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Home Link */}
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>

            {/* Role-specific links */}
            {token && role === 'student' && (
              <Link 
                to="/student" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/student')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            )}
            {token && role === 'company' && (
              <Link 
                to="/company" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/company')
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            )}
            {token && role === 'admin' && (
              <Link 
                to="/admin" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/admin')
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side - Auth/User section */}
          <div className="flex items-center gap-3">
            {!token ? (
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  to="/auth/student" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Login
                </Link>
                <Link 
                  to="/auth/student" 
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                {/* Notifications for students */}
                {role === 'student' && <Notifications />}
                
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      role === 'student' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                      role === 'company' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                      'bg-gradient-to-br from-orange-500 to-red-600'
                    }`}>
                      {name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{name || 'User'}</div>
                      <div className="text-xs text-gray-500 capitalize">{role}</div>
                    </div>
                  </div>
                  <button 
                    onClick={logout} 
                    className="ml-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>

            {token && role === 'student' && (
              <Link 
                to="/student" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/student')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            )}
            {token && role === 'company' && (
              <Link 
                to="/company" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/company')
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            )}
            {token && role === 'admin' && (
              <Link 
                to="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/admin')
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            )}

            {!token ? (
              <>
                <Link 
                  to="/auth/student" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Login
                </Link>
                <Link 
                  to="/auth/student" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="px-4 py-2 flex items-center gap-2 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    role === 'student' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                    role === 'company' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                    'bg-gradient-to-br from-orange-500 to-red-600'
                  }`}>
                    {name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{name || 'User'}</div>
                    <div className="text-xs text-gray-500 capitalize">{role}</div>
                  </div>
                </div>
                <button 
                  onClick={logout} 
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
