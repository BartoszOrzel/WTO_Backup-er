module.exports = {
  apps: [{
    name: "backuper",
    script: "./backuper.js",
    env: {
      "NODE_ENV": "production"
    },
    error_file: "./logs/errors.log",
    out_file: "./logs/out.log",
    log_date_format: "DD-MM-YYYY HH:mm:ss",
    log_type: "format",
    merge_logs: true
  }]
}
