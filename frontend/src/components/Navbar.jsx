import React from 'react';

const Navbar = () => (
    <nav className="bg-blue-900 text-white px-8 py-7 flex justify-between items-center shadow-md">
        <div className="flex items-center">
            <img
                src="../assets/logo.png"
                className="h-12 w-auto mr-4"
            />
            <div>
                <h1 className="text-2xl pb-1 font-semibold leading-tight">
                    Cybersecurity Simulation Platform
                </h1>
                <p className="text-sm opacity-80">
                    University of Ghana - Administrative Dashboard
                </p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <i className="fas fa-moon text-lg" />
            <div className="text-right">
                <span className="block text-xl font-medium">Admin User</span>
                <span className="text-sm text-gray-300">System Administrator</span>
            </div>
            <img
                src="frontend/src/assets/profile.png"
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-white"
            />
        </div>
    </nav>
);

export default Navbar;
