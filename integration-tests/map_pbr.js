var session_ips = new Map();

function add_ip(ips, k, v) {
    ips.set(k, v);
}

console.log(`session_ips: ${Array.from(session_ips.values())}`);
add_ip(session_ips, "1", "192.168.0.1");
add_ip(session_ips, "2", "10.20.30.40");
console.log(`session_ips: ${Array.from(session_ips.values())}`);
