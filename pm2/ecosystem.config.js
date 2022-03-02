module.exports = {
  apps : [{
    cwd: '/Users/asennyey/git/tutor-queue/front-end/dist/tutor-queue',
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
    cwd: '/Users/asennyey/git/tutor-queue/server',
    script: 'python3 manage.py',
    args: 'runserver',
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
