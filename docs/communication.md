# OneFi Communication Protocol

## UDP JSON Message

```
{
    "command": {
        "from": "...",
        "op": "...",
        "uuid": "...",
        "timestamp": ...,
        "session": "...",
        "re": "...",
        "arguments": { ... }
    },

    "signature": "0x...."
}
```

### UDP JSON Message Fields

* **command**: universal JSON object that describes the command or response

* **signature**: public key signature of the command proving the authenticity of the sender

* **command.from**: Ethereum public address of the sender

* **command.op**: Operation: `HELLO`, `HELLO-OK`, `SACK`, `SACK-OK`, etc.

* **command.uuid**: A unique UUIDv4 identifier of the message - each message must have a unique UUID

* **command.timestamp**: UNIX timestamp (number of seconds since the beginning of the Time Epoch)

* **command.session**: A unique UIIDv4 identifier of a session - the session UUID is unique for one session, but not unique for each message

* **command.re**: The UUID of the transaction this message is replying to - if this message is the first in the session, it should be empty

* **command.arguments**: A JSON object with arguments of the current command - the format of this JSON is different for different operations


### PAFREN

In the `PAFREN` command, the `arguments` parameter is the following JSON object:

```
{
    "pafren": {
        "client": "0x...",
        "hotspot": "0x...",
        "amount": ...,
        "timestamp": ...,
        "proof": "0x..."
    }

}
```

* **command.arguments.pafren**: JSON object consisting the PAFREN data
* **command.arguments.pafren.client**: public address of the client/sender (must be equal to **command.from**
* **command.arguments.pafren.hotspot**: public address of the router/provider
* **command.arguments.pafren.amount**: the amount of money the client endorses the smart contract to freeze on behalf of the router/provider (TODO: find out in which units it is measured)
* **command.arguments.pafren.timestamp**: UNIX timestamp of the current pafren (TODO: find out whether it is the expiration timestamp or not)
* **command.arguments.pafren.proof**: The digital signature of the serialized PAFREN with the prefix symbol 0x50 (signed by the client' private key). NOTE: the prefix is used to avoid using SACK instead of pafren because they both have similar format.


### SACK
In the `SACK` command, the `arguments` parameter is the following JSON object:

```
{
    "sack": {
        "client": "0x...",
        "hotspot": "0x...",
        "amount": ...,
        "timestamp": ...,
        "proof": "0x..."
    }
}
```

* **command.arguments.sack**: JSON object consisting the SACK data
* **command.arguments.sack.client**: public address of the client/sender (must be equal to **command.from**
* **command.arguments.sack.hotspot**: public address of the router/provider
* **command.arguments.sack.amount**: the amount of money the client endorses the smart contract to release on behalf of the router/provider (TODO: find out in which units it is measured)
* **command.arguments.sack.timestamp**: UNIX timestamp of the current SACK (TODO: find out whether it is the expiration timestamp or not)
* **command.arguments.sack.proof**: The digital signature of the serialized SACK with the prefix symbol `0x53` (signed by the client' private key). NOTE: the prefix is used to avoid using PAFREN instead of SACK and vice versa because they both have similar format.
