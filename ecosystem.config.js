module.exports = {
  apps: [
    {
      name: "testapi-v0",
      cwd: "/var/www/clients/client5/web21/home/gmlogict/testapi-v0",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
}
