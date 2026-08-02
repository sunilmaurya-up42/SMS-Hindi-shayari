const mongoose = require("mongoose");
const os = require("os");

exports.health = async (req, res) => {

    const memory = process.memoryUsage();

    res.status(200).json({

        success: true,

        status: "healthy",

        uptime: process.uptime(),

        timestamp: new Date(),

        node: process.version,

        platform: process.platform,

        hostname: os.hostname(),

        memory: {

            rss: memory.rss,

            heapTotal: memory.heapTotal,

            heapUsed: memory.heapUsed,

            external: memory.external

        },

        database: mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected"

    });

};

exports.ready = async (req, res) => {

    const dbReady = mongoose.connection.readyState === 1;

    if (!dbReady) {

        return res.status(503).json({

            success: false,

            status: "not_ready",

            database: "disconnected"

        });

    }

    res.json({

        success: true,

        status: "ready"

    });

};

exports.live = (req, res) => {

    res.json({

        success: true,

        status: "alive",

        uptime: process.uptime(),

        timestamp: new Date()

    });

};

exports.system = (req, res) => {

    const cpus = os.cpus();

    res.json({

        success: true,

        system: {

            hostname: os.hostname(),

            platform: os.platform(),

            release: os.release(),

            architecture: os.arch(),

            cpuModel: cpus[0]?.model,

            cpuCores: cpus.length,

            totalMemory: os.totalmem(),

            freeMemory: os.freemem(),

            loadAverage: os.loadavg(),

            uptime: os.uptime()

        }

    });

};

exports.environment = (req, res) => {

    res.json({

        success: true,

        environment: {

            nodeEnv: process.env.NODE_ENV,

            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

            nodeVersion: process.version,

            pid: process.pid

        }

    });

};

exports.database = (req, res) => {

    const states = {

        0: "disconnected",

        1: "connected",

        2: "connecting",

        3: "disconnecting"

    };

    res.json({

        success: true,

        state: states[mongoose.connection.readyState]

    });

};

exports.metrics = (req, res) => {

    const memory = process.memoryUsage();

    res.json({

        success: true,

        metrics: {

            uptime: process.uptime(),

            rss: memory.rss,

            heapUsed: memory.heapUsed,

            heapTotal: memory.heapTotal,

            external: memory.external,

            cpuUsage: process.cpuUsage()

        }

    });

};
