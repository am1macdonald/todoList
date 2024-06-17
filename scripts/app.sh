#! /bin/bash

word="${1}"
environment="${2}"
case ${word} in
  start)
    cd ..
    if [[ "$environment" == "dev" ]]; then
      echo "Starting dev environment"
      docker compose -f compose.dev.yaml up
    else 
      echo "Starting application"
      docker compose -f compose.yaml up
    fi
    ;;
  stop)
    cd ..
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
