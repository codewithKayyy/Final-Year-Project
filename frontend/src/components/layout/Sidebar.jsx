import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaUsers,
    FaFlask,
    FaRobot,
    FaClipboardList,
    FaCog,
    FaShieldAlt,
    FaBullhorn,
} from 'react-icons/fa';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
        { name: 'Staff Management', icon: FaUsers, path: '/staff' },
        { name: 'Agent Management', icon: FaRobot, path: '/agents' },
        { name: 'Campaign Management', icon: FaBullhorn, path: '/campaigns' },
        { name: 'Simulation Config', icon: FaFlask, path: '/simulations' },
        { name: 'Attack Logs', icon: FaClipboardList, path: '/attack-logs' },
        { name: 'Security Controls', icon: FaShieldAlt, path: '/security-controls' },
        { name: 'Settings', icon: FaCog, path: '/settings' },
    ];

    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
            <div className="p-4 text-2xl font-semibold border-b border-gray-700">
                CyberSim Platform
            </div>
            <nav className="flex-1 mt-4">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                className={`flex items-center p-4 hover:bg-gray-700 transition-colors duration-200
                  ${location.pathname === item.path ? 'bg-blue-600' : ''}`}
                            >
                                <item.icon className="mr-3" />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 text-sm text-gray-400 border-t border-gray-700">
                &copy; {new Date().getFullYear()} University of Ghana
            </div>
        </aside>
    );
};

export default Sidebar;