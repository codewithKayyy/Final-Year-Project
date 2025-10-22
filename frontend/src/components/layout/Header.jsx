// frontend/src/components/common/Header.jsx
import React from 'react';
import { FaUserCircle, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect after logout
    };

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
            {/* Logo / Dashboard link */}
            <div className="flex items-center">
                <Link to="/dashboard" className="text-xl font-bold">
                    Admin Console
                </Link>
            </div>

            {/* Right-side navigation */}
            <nav className="flex items-center space-x-4">
                {/* Notifications button */}
                <button
                    className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Notifications"
                >
                    <FaBell size={20} />
                </button>

                {/* Authenticated user info */}
                {user ? (
                    <div className="flex items-center space-x-2">
                        <FaUserCircle size={24} />
                        <span>{user.username || 'Admin User'}</span>
                        <button
                            onClick={handleLogout}
                            className="ml-4 p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Logout"
                        >
                            <FaSignOutAlt size={20} />
                        </button>
                    </div>
                ) : (
                    // Not logged in
                    <Link to="/login" className="text-white hover:text-gray-300">
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
