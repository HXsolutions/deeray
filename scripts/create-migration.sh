#!/bin/bash
# Run this ONCE on your VPS after first deploy to create Prisma migration files
# Subsequent deploys will use: docker compose run --rm migrate

set -e

echo "Generating initial Prisma migration..."
docker compose run --rm app sh -c "
  npx prisma migrate dev --name init --create-only
  echo 'Migration created. Apply with: npx prisma migrate deploy'
"

echo "Migration files created in prisma/migrations/"
echo "Commit these to git so deploys can use 'prisma migrate deploy'"
