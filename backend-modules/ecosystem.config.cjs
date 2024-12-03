module.exports = {
  apps : [{
    name: "converter",
    script: "./server.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }],
};
