import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-32 py-4 flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link to="/">Dashboard</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/topics" className="hover:underline">
              Topics
            </Link>
          </li>
          <li>
            <Link to="/progress" className="hover:underline">
              Progress
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="border border-white hover:bg-blue-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4">
          <ul className="space-y-3">
            <li>
              <Link to="/profile" className="block hover:underline" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <Link to="/topics" className="block hover:underline" onClick={() => setIsOpen(false)}>
                Topics
              </Link>
            </li>
            <li>
              <Link to="/progress" className="block hover:underline" onClick={() => setIsOpen(false)}>
                Progress
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className=" border border-white hover:bg-blue-700 px-3 py-1 rounded text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
