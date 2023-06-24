#!/bin/bash


# Run npx commands
npx sequelize db:migrate:undo:all
npx sequelize db:migrate
npx sequelize db:seed:all
clear
npm run devStart