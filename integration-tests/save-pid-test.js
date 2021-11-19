const process_mgmt = require("../api/process_mgmt");
console.log(`CALL 1 RETURNS: ${process_mgmt.save_pid(process_mgmt.get_client_pid_path())}`);
console.log(`CALL 2 RETURNS: ${process_mgmt.save_pid(process_mgmt.get_provider_pid_path())}`);