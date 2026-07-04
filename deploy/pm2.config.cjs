module.exports = {
  apps: [{
    name: "deeray",
    script: "server.js",
    cwd: "/opt/deeray",
    exec_mode: "cluster",
    instances: "max",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
    },
    env_file: ".env.production",
    max_memory_restart: "1G",
    error_file: "/var/log/deeray/error.log",
    out_file: "/var/log/deeray/out.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    kill_timeout: 10000,
    listen_timeout: 5000,
    shutdown_with_message: true,
    wait_ready: true,
  }]
}
