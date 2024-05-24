module.exports = {
  apps: [
    {
      name: "FLS",
      script: "./app.js",
      instances: "1",
      exec_mode: "cluster",
      autorestart: true,
      max_memory_restart: "1G",
      watch: true,
      env_development: {
        PORT: 8888,
        FLS_PATH: "I:/Code/FLS_Web/Web2/fls",
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 80,
        FLS_PATH: "dist/project",
        NODE_ENV: "production",
      },
    },
  ],
};
