module.exports = {
    apps: [
        {
            name: "new-be",
            script: "server.js",
            instances: 1,
            exec_mode: "fork",
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
                instances: "max",
                exec_mode: "cluster",
            },
            watch: true,
            ignore_watch: ["node_modules", "logs", "*.log", ".git"],
            watch_delay: 1000,
        },
    ],
};
