const baseDir = '/Users/asennyey/git/tutor-queue';
const username = require("os").userInfo().username;

module.exports = {
  apps : [{
    cwd: `${baseDir}/front-end/dist/tutor-queue`,
    watch: '.',
    name: 'front-end',
    script: "serve",
    env: {
      PM2_SERVE_PATH: '.',
      PM2_SERVE_PORT: 8080,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: 'index.html'
    }
  }, {
    name: 'server',
    cwd: `${baseDir}/server`,
    script: 'env/bin/gunicorn tutor_center.wsgi',
    args: '--threads 2',
    watch: '.'
  }],

  deploy : {
    production : {
      user : username,
      host : 'localhost -p 8090',
      ref  : 'origin/main',
      repo : 'https://github.com/connorbrett/tutor-queue',
      path : '/var/www/tutor-center',
      'post-setup': './prepare.sh',
      'post-deploy' : 'pm2 reload ecosystem.config.js --env production',
    }
  }
};
