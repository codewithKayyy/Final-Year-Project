import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaUsers,
    FaEnvelopeOpenText,
    FaClipboardCheck,
    FaChartLine,
    FaFileAlt,
    FaShieldAlt,
    FaGraduationCap,
} from 'react-icons/fa';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', path: '/', icon: <FaTachometerAlt /> },
        { label: 'Staff Management', path: '/staff', icon: <FaUsers /> },
        { label: 'Phishing Campaigns', path: '/campaigns', icon: <FaEnvelopeOpenText /> },
        { label: 'Simulation Config', path: '/config', icon: <FaClipboardCheck /> },
        { label: 'Monitoring', path: '/monitoring', icon: <FaChartLine /> },
        { label: 'Reports', path: '/reports', icon: <FaFileAlt /> },
        { label: 'Security Controls', path: '/security', icon: <FaShieldAlt /> },
        // { label: 'Training', path: '/training', icon: <FaGraduationCap /> },
    ];

    return (
        <aside className="w-64 bg-white border-r shadow-sm min-h-screen px-6 py-6">
            <ul className="space-y-4 text-sm font-medium text-gray-700">
                {navItems.map(({ label, path, icon }) => (
                    <li key={label}>
                        <Link
                            to={path}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-900 transition ${
                                location.pathname === path ? 'bg-blue-100 text-blue-700 font-semibold' : ''
                            }`}
                        >
                            <span className="text-lg">{icon}</span>
                            <span>{label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
