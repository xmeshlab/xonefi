#!/bin/ash

LOG_FILE=/root/xonefi.log
LOG_CAP=100000

roll_log() {
  log_size=$(wc -l < "$LOG_FILE")
  if [ "$log_size" -gt "$LOG_CAP" ]; then
    tail -c "$LOG_CAP" "$LOG_FILE" > "$LOG_FILE.temp"
    mv "$LOG_FILE.temp" "$LOG_FILE"
  fi
}

roll_log
