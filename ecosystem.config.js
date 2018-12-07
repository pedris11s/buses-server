module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'wankar',
      script: 'app.js',
      // args: 'start',
      watch: true,
      // interpreter: './node_modules/.bin/babel-node',
      restart_delay: 1000,
      ignore_watch: [
        './node_modules/*',
        './.tmp/*',
        '^*.log$',
        './assets/*',
        './config/locales/*',
        './view/*',
        '.git',
        './out.log',
        './error.log',
        '.idea/*'
      ],
      out_file: 'out.log',
      error_file: 'error.log',
      env: {
        NODE_ENV: 'production',
        PORT: 1337
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 1337
      }
    }
  ]
};
