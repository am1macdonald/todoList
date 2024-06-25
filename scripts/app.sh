#!/bin/bash

: '
run from within the root directory of the application
'


word="${1}"
environment="${2}"
case ${word} in
  start)
    if [[ "$environment" == "dev" ]]; then
      echo "Starting dev environment"
      docker compose -f compose.dev.yaml up --detach
    else 
      echo "Starting application"
      docker compose -f compose.yaml up --detach
    fi
    ;;
  stop)
    if [[ "$environment" == "dev" ]]; then
      echo "Stopping dev environment"
      docker compose -f compose.dev.yaml down
    else 
      echo "Stopping application"
      docker compose -f compose.yaml down
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop}"
    exit 1
    ;;
esac
