module.exports = {
  apps: [
    {
      name: "api-schema-columns",
      cwd: "/var/www/clients/client5/web26/private/api-schema-columns",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
}
