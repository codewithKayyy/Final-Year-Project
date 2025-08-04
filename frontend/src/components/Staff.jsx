import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaUpload, FaTrash, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const getRiskBadge = (level) => {
    const colors = {
        Low: 'bg-green-100 text-green-700',
        Medium: 'bg-yellow-100 text-yellow-700',
        High: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[level]}`}>{level}</span>;
};

const Staff = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCsvModal, setShowCsvModal] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingStaff, setEditingStaff] = useState(null);
    const [deletingStaff, setDeletingStaff] = useState(null);

    // Filter and search states
    const [collegeFilter, setCollegeFilter] = useState('');
    const [riskFilter, setRiskFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        college: '',
        role: '',
        risk: 'Low'
    });

    // College options
    const collegeOptions = [
        'All Colleges',
        'Humanities',
        'Health Sciences',
        'Basic and Applied Science',
        'Education'
    ];

    // Risk level options
    const riskOptions = [
        'All Risk Levels',
        'Low',
        'Medium',
        'High'
    ];

    // Fetch staff data from API with filters
    const fetchStaff = async () => {
        try {
            setLoading(true);

            // Build query parameters
            const params = new URLSearchParams();
            if (collegeFilter && collegeFilter !== 'All Colleges') {
                params.append('college', collegeFilter);
            }
            if (riskFilter && riskFilter !== 'All Risk Levels') {
                params.append('risk', riskFilter);
            }
            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }

            const queryString = params.toString();
            const url = queryString ?
                `http://localhost:5000/api/staff?${queryString}` :
                'http://localhost:5000/api/staff';

            const response = await axios.get(url);
            setStaffList(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
            setError('Failed to fetch staff data');
        } finally {
            setLoading(false);
        }
    };

    // Load staff data on component mount and when filters change
    useEffect(() => {
        fetchStaff();
    }, [collegeFilter, riskFilter, searchTerm]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle filter changes
    const handleCollegeFilterChange = (e) => {
        setCollegeFilter(e.target.value);
    };

    const handleRiskFilterChange = (e) => {
        setRiskFilter(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Clear all filters
    const clearFilters = () => {
        setCollegeFilter('');
        setRiskFilter('');
        setSearchTerm('');
    };

    // Reset form data
    const resetForm = () => {
        setFormData({
            id: '',
            name: '',
            email: '',
            college: '',
            role: '',
            risk: 'Low'
        });
        setError('');
        setEditingStaff(null);
        setDeletingStaff(null);
    };

    // Handle edit button click
    const handleEditClick = (staff) => {
        setEditingStaff(staff);
        setFormData({
            id: staff.id,
            name: staff.name,
            email: staff.email,
            college: staff.college,
            role: staff.role,
            risk: staff.risk
        });
        setShowEditModal(true);
    };

    // Handle delete button click
    const handleDeleteClick = (staff) => {
        setDeletingStaff(staff);
        setShowDeleteModal(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!deletingStaff) return;

        try {
            setLoading(true);
            setError('');

            const response = await axios.delete(`http://localhost:5000/api/staff/${deletingStaff.id}`);

            if (response.data.success) {
                // Close delete modal
                setShowDeleteModal(false);
                setDeletingStaff(null);

                // Refresh staff list
                await fetchStaff();

                alert('Staff member deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            setError(error.response?.data?.error || 'Failed to delete staff member');
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission for both add and edit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.college || !formData.role) {
            setError('Please fill in all required fields');
            return;
        }

        // For add operation, also check if ID is provided
        if (!editingStaff && !formData.id) {
            setError('Please provide a Staff ID');
            return;
        }

        try {
            setLoading(true);
            setError('');

            let response;
            if (editingStaff) {
                // Update existing staff
                response = await axios.put(`http://localhost:5000/api/staff/${editingStaff.id}`, {
                    name: formData.name,
                    email: formData.email,
                    college: formData.college,
                    role: formData.role,
                    risk: formData.risk
                });
            } else {
                // Add new staff
                response = await axios.post('http://localhost:5000/api/staff', formData);
            }

            if (response.data.success) {
                // Reset form
                resetForm();

                // Close modals
                setShowAddModal(false);
                setShowEditModal(false);

                // Refresh staff list
                await fetchStaff();

                alert(editingStaff ? 'Staff member updated successfully!' : 'Staff member added successfully!');
            }
        } catch (error) {
            console.error('Error saving staff:', error);
            setError(error.response?.data?.error || 'Failed to save staff member');
        } finally {
            setLoading(false);
        }
    };

    const handleCSVUpload = () => {
        if (csvFile) {
            alert(`CSV uploaded: ${csvFile.name}`);
            setCsvFile(null);
            setShowCsvModal(false);
        }
    };

    // Close modal handler
    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        resetForm();
    };

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Staff Management</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus className="mr-2" /> Add Staff
                    </button>
                    <button
                        onClick={() => setShowCsvModal(true)}
                        className="bg-gray-200 px-4 py-2 rounded inline-flex items-center hover:bg-gray-300 transition-colors"
                    >
                        <FaUpload className="mr-2" /> Import CSV
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <select
                    value={collegeFilter}
                    onChange={handleCollegeFilterChange}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {collegeOptions.map(college => (
                        <option key={college} value={college === 'All Colleges' ? '' : college}>
                            {college}
                        </option>
                    ))}
                </select>

                <select
                    value={riskFilter}
                    onChange={handleRiskFilterChange}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {riskOptions.map(risk => (
                        <option key={risk} value={risk === 'All Risk Levels' ? '' : risk}>
                            {risk}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Search by name, ID, or email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border rounded px-3 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {(collegeFilter || riskFilter || searchTerm) && (
                    <button
                        onClick={clearFilters}
                        className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors text-sm"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Results Summary */}
            {(collegeFilter || riskFilter || searchTerm) && (
                <div className="text-sm text-gray-600">
                    Showing {staffList.length} result{staffList.length !== 1 ? 's' : ''}
                    {collegeFilter && ` in ${collegeFilter}`}
                    {riskFilter && ` with ${riskFilter} risk`}
                    {searchTerm && ` matching "${searchTerm}"`}
                </div>
            )}

            {/* Table */}
            <div className="bg-white shadow rounded overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2">Loading...</p>
                    </div>
                ) : (
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100 text-left text-sm text-gray-600">
                        <tr>
                            <th className="p-3 font-medium">Staff ID</th>
                            <th className="p-3 font-medium">Name</th>
                            <th className="p-3 font-medium">College</th>
                            <th className="p-3 font-medium">Role</th>
                            <th className="p-3 font-medium">Risk Level</th>
                            <th className="p-3 font-medium">Simulations</th>
                            <th className="p-3 font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        {staffList.map((staff) => (
                            <tr key={staff.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="p-3 font-mono">{staff.id}</td>
                                <td className="p-3">
                                    <div className="font-medium">{staff.name}</div>
                                    <div className="text-gray-500 text-xs">{staff.email}</div>
                                </td>
                                <td className="p-3">{staff.college}</td>
                                <td className="p-3">{staff.role}</td>
                                <td className="p-3">{getRiskBadge(staff.risk)}</td>
                                <td className="p-3 text-green-600">{staff.simulations}</td>
                                <td className="p-3 space-x-2">
                                    <button
                                        onClick={() => handleEditClick(staff)}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors"
                                        title="Edit staff member"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(staff)}
                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                                        title="Delete staff member"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {staffList.length === 0 && !loading && (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-gray-500">
                                    {(collegeFilter || riskFilter || searchTerm) ?
                                        'No staff members found matching your criteria.' :
                                        'No staff members found. Click "Add Staff" to get started.'
                                    }
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-xl font-semibold mb-4">Add Staff Member</h3>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                name="id"
                                placeholder="Staff ID"
                                value={formData.id}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <select
                                name="college"
                                value={formData.college}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select College</option>
                                {collegeOptions.slice(1).map(college => (
                                    <option key={college} value={college}>{college}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="role"
                                placeholder="Role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <select
                                name="risk"
                                value={formData.risk}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Saving...' : 'Save Staff'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Staff Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-xl font-semibold mb-4">Edit Staff Member</h3>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <select
                                name="college"
                                value={formData.college}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select College</option>
                                {collegeOptions.slice(1).map(college => (
                                    <option key={college} value={college}>{college}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="role"
                                placeholder="Role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <select
                                name="risk"
                                value={formData.risk}
                                onChange={handleInputChange}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Updating...' : 'Update Staff'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deletingStaff && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-red-600">Delete Staff Member</h3>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-2">Are you sure you want to delete this staff member?</p>
                            <div className="bg-gray-50 p-3 rounded border">
                                <p className="font-medium">{deletingStaff.name}</p>
                                <p className="text-sm text-gray-600">{deletingStaff.email}</p>
                                <p className="text-sm text-gray-600">ID: {deletingStaff.id}</p>
                            </div>
                            <p className="text-red-600 text-sm mt-2">This action cannot be undone.</p>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={loading}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Deleting...' : 'Delete Staff'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import CSV Modal */}
            {showCsvModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-xl">
                        <button
                            onClick={() => setShowCsvModal(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-xl font-semibold mb-4">Import Staff from CSV</h3>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setCsvFile(e.target.files[0])}
                            className="w-full mb-4 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleCSVUpload}
                            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-colors"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;

