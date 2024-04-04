#!/bin/ash

LOG_FILE1=/root/xonefi.log
LOG_FILE2=/root/xonefix.log
LOG_FILE3=/root/xonefis.log
LOG_CAP=10000

roll_log() {
  log_size=$(wc -l < "$LOG_FILE1")
  if [ "$log_size" -gt "$LOG_CAP" ]; then
    tail -n "$LOG_CAP" "$LOG_FILE1" > "$LOG_FILE1.temp"
    mv "$LOG_FILE1.temp" "$LOG_FILE1"
  fi
  log_size=$(wc -l < "$LOG_FILE2")
  if [ "$log_size" -gt "$LOG_CAP" ]; then
    tail -n "$LOG_CAP" "$LOG_FILE2" > "$LOG_FILE2.temp"
    mv "$LOG_FILE2.temp" "$LOG_FILE2"
  fi
  log_size=$(wc -l < "$LOG_FILE3")
  if [ "$log_size" -gt "$LOG_CAP" ]; then
    tail -n "$LOG_CAP" "$LOG_FILE3" > "$LOG_FILE3.temp"
    mv "$LOG_FILE3.temp" "$LOG_FILE3"
  fi
}

roll_log
