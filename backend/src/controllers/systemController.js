// backend/src/controllers/systemController.js
const db = require('../config/db');
const axios = require('axios');
const { getConnectedAgents } = require('../services/agentService');

class SystemController {
    /**
     * Get system health status
     */
    static async getSystemHealth(req, res) {
        try {
            const health = {
                backend: 'healthy',
                database: 'healthy',
                attackExecutor: 'healthy',
                redis: 'healthy',
                timestamp: new Date().toISOString()
            };

            // Test database connection
            try {
                await db.execute('SELECT 1');
            } catch (error) {
                health.database = 'error';
            }

            // Test attack-executor connection
            try {
                const attackExecutorUrl = process.env.ATTACK_EXECUTOR_URL || 'http://localhost:5001';
                await axios.get(`${attackExecutorUrl}/health`, { timeout: 5000 });
            } catch (error) {
                health.attackExecutor = 'error';
            }

            // Test Redis connection (via attack-executor health endpoint would be ideal)
            try {
                // This could be enhanced with actual Redis ping
                // For now, assume Redis is healthy if attack-executor is healthy
                if (health.attackExecutor === 'error') {
                    health.redis = 'warning';
                }
            } catch (error) {
                health.redis = 'error';
            }

            res.json(health);
        } catch (error) {
            console.error('System health check failed:', error);
            res.status(500).json({
                error: 'Failed to get system health',
                message: error.message
            });
        }
    }

    /**
     * Get dashboard metrics
     */
    static async getDashboardMetrics(req, res) {
        try {
            // Get agent metrics
            const [agentRows] = await db.execute(`
                SELECT status, COUNT(*) as count
                FROM agents
                WHERE status != 'deactivated'
                GROUP BY status
            `);

            const agentMetrics = agentRows.reduce((acc, row) => {
                acc[row.status] = row.count;
                return acc;
            }, { active: 0, offline: 0, inactive: 0 });

            // Get campaign metrics
            const [campaignRows] = await db.execute(`
                SELECT status, COUNT(*) as count
                FROM campaigns
                GROUP BY status
            `);

            const campaignMetrics = campaignRows.reduce((acc, row) => {
                acc[row.status] = row.count;
                return acc;
            }, { draft: 0, running: 0, completed: 0, scheduled: 0 });

            // Get simulation metrics
            const [simulationRows] = await db.execute(`
                SELECT status, COUNT(*) as count
                FROM simulations
                GROUP BY status
            `);

            const simulationMetrics = simulationRows.reduce((acc, row) => {
                acc[row.status] = row.count;
                return acc;
            }, { draft: 0, running: 0, completed: 0, failed: 0 });

            // Get staff metrics
            const [staffRows] = await db.execute(`
                SELECT
                    COUNT(*) as total,
                    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active
                FROM staff
            `);

            const staffMetrics = staffRows[0] || { total: 0, active: 0 };

            // Get recent activity (attack logs)
            const [recentLogs] = await db.execute(`
                SELECT
                    al.*,
                    a.agent_name,
                    s.name as simulation_name
                FROM attack_logs al
                LEFT JOIN agents a ON al.agent_id = a.agent_id
                LEFT JOIN simulations s ON al.simulation_id = s.id
                ORDER BY al.timestamp DESC
                LIMIT 10
            `);

            res.json({
                agents: {
                    online: agentMetrics.active || 0,
                    offline: agentMetrics.offline || 0,
                    total: (agentMetrics.active || 0) + (agentMetrics.offline || 0) + (agentMetrics.inactive || 0)
                },
                campaigns: {
                    active: campaignMetrics.running || 0,
                    completed: campaignMetrics.completed || 0,
                    total: Object.values(campaignMetrics).reduce((sum, count) => sum + count, 0)
                },
                simulations: {
                    running: simulationMetrics.running || 0,
                    completed: simulationMetrics.completed || 0,
                    total: Object.values(simulationMetrics).reduce((sum, count) => sum + count, 0)
                },
                staff: {
                    total: staffMetrics.total,
                    targeted: staffMetrics.active
                },
                recentLogs: recentLogs
            });
        } catch (error) {
            console.error('Failed to get dashboard metrics:', error);
            res.status(500).json({
                error: 'Failed to get dashboard metrics',
                message: error.message
            });
        }
    }

    /**
     * Get system statistics
     */
    static async getSystemStats(req, res) {
        try {
            const stats = {};

            // Connected agents (real-time)
            const connectedAgents = getConnectedAgents();
            stats.connectedAgents = connectedAgents.length;

            // Database statistics
            const [dbStats] = await db.execute(`
                SELECT
                    (SELECT COUNT(*) FROM users WHERE is_active = 1) as active_users,
                    (SELECT COUNT(*) FROM agents WHERE status = 'active') as active_agents,
                    (SELECT COUNT(*) FROM campaigns WHERE status IN ('running', 'scheduled')) as active_campaigns,
                    (SELECT COUNT(*) FROM simulations WHERE status = 'running') as running_simulations,
                    (SELECT COUNT(*) FROM attack_logs WHERE timestamp > DATE_SUB(NOW(), INTERVAL 24 HOUR)) as logs_24h
            `);

            stats.database = dbStats[0];

            // Performance metrics
            const [perfStats] = await db.execute(`
                SELECT
                    AVG(CASE WHEN outcome = 'success' THEN 1 ELSE 0 END) * 100 as avg_success_rate,
                    COUNT(*) as total_attacks_30d
                FROM attack_logs
                WHERE timestamp > DATE_SUB(NOW(), INTERVAL 30 DAY)
            `);

            stats.performance = perfStats[0];

            res.json(stats);
        } catch (error) {
            console.error('Failed to get system statistics:', error);
            res.status(500).json({
                error: 'Failed to get system statistics',
                message: error.message
            });
        }
    }
}

module.exports = SystemController;