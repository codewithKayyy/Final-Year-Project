import React from 'react';
import { FaUserCircle, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center">
<<<<<<< HEAD
                <Link to="/dashboard" className="text-xl font-bold">Admin Console</Link>
=======
                <Link to="/dashboard" className="text-xl font-bold">CyberSim Dashboard</Link>
>>>>>>> origin/main
            </div>
            <nav className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FaBell size={20} />
                </button>
                {user && (
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
                )}
                {!user && (
                    <Link to="/login" className="text-white hover:text-gray-300">
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;