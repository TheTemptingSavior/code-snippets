#!/bin/sh

if [ ! -f "$DATABASE_PATH" ]; then
  touch "$DATABASE_PATH";
  npx prisma migrate deploy
fi


node server.js
