#!/bin/sh /etc/rc.common

START=99
STOP=15

USE_PROCD=1
PROG=/root/xonefi/start-router.ash

start_service() {
	procd_open_instance
	/root/xonefi/start-router.ash
	procd_close_instance
}
