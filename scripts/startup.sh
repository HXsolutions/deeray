#!/bin/bash
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding admin user..."
npx prisma db seed

echo "Done."
