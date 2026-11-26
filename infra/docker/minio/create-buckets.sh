#!/bin/sh
# Runs once, inside the minio-init container, after minio is healthy.
# Creates the two buckets this project needs and makes sure both are
# private (07-security-safeguarding.md section 8: files are "stored
# privately; served from a separate domain through short-lived signed
# links" — tl-public-assets still gets its access through signed links,
# it just holds assets that are not personal data).
set -eu

mc alias set local "http://minio:9000" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"

for bucket in tl-private tl-public-assets; do
  mc mb --ignore-existing "local/$bucket"
  mc anonymous set none "local/$bucket"
done

echo "MinIO buckets ready: tl-private, tl-public-assets (both private)."
