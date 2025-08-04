import React from 'react';
import { FaDownload, FaFileAlt, FaUsers, FaShieldAlt, FaChartLine, FaPlus } from 'react-icons/fa';

const Reports = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Reporting Dashboard</h2>
                <div className="space-x-2">
                    <button className="bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center">
                        <FaPlus className="mr-2" /> Generate Report
                    </button>
                    <button className="bg-gray-200 px-4 py-2 rounded inline-flex items-center">
                        <FaDownload className="mr-2" /> Export Data
                    </button>
                </div>
            </div>

            {/* Report Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded shadow text-center">
                    <FaFileAlt className="text-3xl text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">Executive Summary</h3>
                    <p className="text-sm text-gray-600">High-level overview for leadership team</p>
                    <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded">Generate</button>
                </div>
                <div className="bg-white p-6 rounded shadow text-center">
                    <FaUsers className="text-3xl text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">Department Analysis</h3>
                    <p className="text-sm text-gray-600">Detailed departmental security metrics</p>
                    <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded">Generate</button>
                </div>
                <div className="bg-white p-6 rounded shadow text-center">
                    <FaShieldAlt className="text-3xl text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">Compliance Report</h3>
                    <p className="text-sm text-gray-600">Regulatory compliance and audit trail</p>
                    <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded">Generate</button>
                </div>
                <div className="bg-white p-6 rounded shadow text-center">
                    <FaChartLine className="text-3xl text-blue-600 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">Trend Analysis</h3>
                    <p className="text-sm text-gray-600">Historical performance and improvements</p>
                    <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded">Generate</button>
                </div>
            </div>

            {/* Latest Executive Summary */}
            <div className="bg-white p-6 rounded shadow space-y-4">
                <div>
                    <h3 className="text-lg font-semibold mb-1">Latest Executive Summary</h3>
                    <div className="flex items-center space-x-4">
                        <img src="/assets/logo.png" alt="UG logo" className="h-12" />
                        <div>
                            <p className="font-bold">Cybersecurity Simulation Report</p>
                            <p className="text-sm text-gray-600">University of Ghana – December 2024</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-1">Executive Summary</h4>
                    <p className="text-gray-700">
                        The University of Ghana’s cybersecurity simulation program has shown significant improvement in staff awareness and response rates. Over the past quarter, we have seen a 12.4% improvement in phishing detection rates and a 24% increase in proper incident reporting.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-1">Key Findings</h4>
                    <ul className="list-disc ml-6 text-gray-700">
                        <li>228 staff members actively participating in simulation programs</li>
                        <li>Average click rate decreased to 24.7% (target: &lt;20%)</li>
                        <li>Report rate increased to 17.3% (improvement of +4.2%)</li>
                        <li>Finance department identified as highest risk area</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Reports;
