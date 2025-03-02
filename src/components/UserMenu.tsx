import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 rounded-full bg-dark-darker p-1 text-sm text-gray-300 hover:bg-dark-lighter"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
          <User size={16} className="text-primary" />
        </div>
        <span className="hidden md:block">{user.username}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-dark-lighter shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-300 border-b border-white/10">
              <p className="font-medium">{user.username}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-darker"
            >
              <Settings size={16} />
              <span>Settings</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-darker"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;