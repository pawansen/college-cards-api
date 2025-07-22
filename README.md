# CMS-backend

## Node version

above version 18

tested on local with version v18.13.0

## Redis Install

version ^2.0.0

## Mysql version

tested on local with version MySQL 8.0

## Go to the project directory

cd CMS-backend

## Install dependencies

npm install

## Create a .env from the sample

cp env-sample .env

## Database setup by code command line

run commad 

npm run db:migrate

## Database setup

install mysql on your machine

CMS-backend/database/cms-backend.sql

mysql -u username -p cms-backend < cms-backend.sql

## Start server with PM2

npm install pm2 -g

npm run dev:start

## Every update restart server

npm run dev:flush

## delete pme server

npm run delete

## Start the server local

## Install nodemon run command

npm install nodemon -g

npm run start:nodemon

## Delete local logs files & upload files

## Delete logs

npm run rm:log

## Delete uploads
npm run rm:upload

## Delete all
npm run rm:files




