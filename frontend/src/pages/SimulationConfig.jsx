//frontend/src/pages/SimulationConfig.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getSimulations, deleteSimulation, startSimulation } from '../services/simulationService';
import { socket } from '../services/socket';

const SimulationConfig = () => {
    const [simulations, setSimulations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSimulations = async () => {
        setLoading(true);
        try {
            const data = await getSimulations();
            setSimulations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this simulation?")) return;
        try {
            await deleteSimulation(id);
            fetchSimulations();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleStart = async (sim) => {
        try {
            await startSimulation({ simulationId: sim.id });
            alert("Simulation started!");
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchSimulations();

        socket.on("simulationCompleted", (data) => {
            fetchSimulations();
            console.log("Simulation completed:", data);
        });

        return () => {
            socket.off("simulationCompleted");
        };
    }, []);

    return (
        <div>
            <h4>Simulation Config</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? <Spinner animation="border" /> :
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {simulations.map(sim => (
                        <tr key={sim.id}>
                            <td>{sim.id}</td>
                            <td>{sim.name}</td>
                            <td>{sim.type}</td>
                            <td>{sim.status}</td>
                            <td>{new Date(sim.created_at).toLocaleString()}</td>
                            <td>
                                <Button size="sm" variant="success" onClick={() => handleStart(sim)}>Start</Button>{' '}
                                <Button size="sm" variant="danger" onClick={() => handleDelete(sim.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            }
        </div>
    );
};

export default SimulationConfig;

