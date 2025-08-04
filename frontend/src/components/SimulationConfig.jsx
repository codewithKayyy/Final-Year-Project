import React from 'react';

const SimulationConfig = () => {
    const templates = [
        {
            title: 'Fake Microsoft 365 Login',
            description: 'Credential harvesting simulation targeting Office 365 login credentials',
            difficulty: 'MEDIUM',
            successRate: '65% success rate',
            image: '/frontend/src/assets/template1.png',
        },
        {
            title: 'Fake IT Support Request',
            description: 'Tech support scam request immediate action',
            difficulty: 'EASY',
            successRate: '45% success rate',
            image: '/frontend/src/assets/template2.png',
        },
        {
            title: 'Targeted LinkedIn Invitation',
            description: 'Advanced spear phishing using social engineering techniques',
            difficulty: 'HARD',
            successRate: '85% success rate',
            image: '/frontend/src/assets/template3.png',
        },
    ];

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-2xl font-bold">Simulation Configuration</h2>
                <button className="bg-blue-900 text-white px-4 py-2 rounded ml-auto block">+ New Template</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
                {templates.map((template, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded shadow">
                        <img src={template.image} alt={template.title} className="w-full h-40 object-cover mb-2" />
                        <h3 className="text-lg font-bold">{template.title}</h3>
                        <p className="text-gray-600 mb-2">{template.description}</p>
                        <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded ${template.difficulty === 'EASY' ? 'bg-green-200 text-green-800' :
                                template.difficulty === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                                {template.difficulty}
                            </span>
                            <span>{template.successRate}</span>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded">Use Template</button>
                            <button className="bg-gray-300 px-2 py-1 rounded">Edit</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
                <div className="flex mb-2">
                    <button className="bg-blue-900 text-white px-2 py-1 rounded mr-2">Email Content</button>
                    <button className="bg-gray-300 px-2 py-1 rounded">Landing Page</button>
                    <button className="bg-gray-300 px-2 py-1 rounded">Settings</button>
                </div>
                <textarea className="w-full h-40 p-2 border rounded" placeholder="Enter email template content here..."></textarea>
            </div>
        </div>
    );
};

export default SimulationConfig;