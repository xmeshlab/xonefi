#!/bin/ash

# Usage: ./collect_file.ash <FILE>

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <FILE>"
  exit 1
fi

scp -i /root/.ssh/id_new $1 collector@137.184.243.11:.