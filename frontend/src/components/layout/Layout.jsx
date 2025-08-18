// frontend/src/components/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // <--- Add this import
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => { // <--- Remove { children } from props
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Outlet /> {/* <--- Replace {children} with <Outlet /> */}
                </main>
            </div>
        </div>
    );
};

export default Layout;
