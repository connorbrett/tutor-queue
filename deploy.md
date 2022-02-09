# Deployment Guide

## SSH into Lectura

`ssh <your netID here>@lectura.cs.arizona.edu`

For help with lectura, visit the CS lab [help desk](https://helpdesk.cs.arizona.edu/)

## SSH into the tutorqueue-vm

`ssh <you netID here>@tutorqueue-vm.cs.arizona.edu`

If you have access issues with the tutorqueue-vm, email the [CS Lab (ericcollins@cs.arizona.edu)](mailto:ericcollins@cs.arizona.edu)

##  cd into tutorqueue directory

`cd /var/www/tutorqueue/tutor-queue`

### Note:

*If you get an access error, try prefxing your command with `sudo`.*

*Example: if the `git pull origin main` doesn't work, try `sudo git pull origin main`* 


## Deploying the app

Pull from git in order to get the most up to date version of the site

`sudo git pull origin main`

Ask one of the tutor coords for access to the tutor-queue repo and following [this](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) guide to use Github's personal access tokens to log in from the command line.

Coming soon...