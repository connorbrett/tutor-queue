# Deployment Guide

## Pre-steps
Ensure you have access to lectura and the tutorqueue-vm.

You can test this by running

`ssh <your netID>@lectura.cs.arizona.edu`

For help with lectura, visit the CS lab [help desk](https://helpdesk.cs.arizona.edu/)

And then running

`ssh <your netID>@tutorqueue-vm.cs.arizona.edu`

If you have access issues with the tutorqueue-vm, email the [CS Lab (ericcollins@cs.arizona.edu)](mailto:ericcollins@cs.arizona.edu)

You may need to give yourself access to the tutor-queue folder on the VM. Run `sudo usermod -a -G tutor-admins $USER`.

You will also need to setup an ssh key between the VM and github, look through https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent.

## Deploying the app
1. `ssh <your username>@lectura.cs.arizona.edu`, this will log you into lectura.
2. `ssh <your username>@tutorqueue-vm.cs.arizona.edu`, this will log you into the vm.
3. `./build.prod.sh`, this will deploy all of the necessary code and changes.

# FAQs
### Access Error in Linux
Try prefixing commands with sudo, your user probably doesn't have permission to access what you were trying to access, but root does (most of the time).
For example: `git pull` would become `sudo git pull`.
*_Caveat_: the /home/ folder is mounted from lectura and inaccessible.

## Git Authentication Error
Ask one of the tutor coords for access to the tutor-queue repo and following [this](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) guide to use Github's personal access tokens to log in from the command line.

## Docker Error
Ensure the docker daemon is running with `sudo top` or `sudo systemctl status docker`.

## Location of Logs
Logs will be stored in each folder of the repository.
- For overall reverse proxy logs (to check for access stats and locations), go to `proxy/logs`, there will be an `access.log` file and an `error.log` file.
- A similar pattern is in place for the `server` folder.
- The front-end does not collect logs as any logs would be redundant to the reverse proxy logs.

## Reset the Cache
Run `sudo docker exec -it tutor-center_redis_1 redis-cli`, once a promp opens, run `flushall`. This will reset the cache. Type `quit` to exit the prompt.
