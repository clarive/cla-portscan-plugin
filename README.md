# Port Scan Plugin

<img src="https://cdn.jsdelivr.net/gh/clarive/cla-portscan-plugin/public/icon/portscan.svg?sanitize=true" alt="PortScan Plugin" title="PortScan Plugin" width="120" height="120">

Port Scan Plugin is designed check open ports on a remote server using nmap.

# What is nmap?

Nmap ("Network Mapper") is a free and open source utility for network discovery and security auditing.
Nmap uses raw IP packets in novel ways to determine what hosts are available on the network, what services, etc.

## Requirements

To be able to use the plugin correctly you must have [nmap](https://nmap.org/book/install.html) installed in your Clarive's instance.

## Installing

To install the plugin place the cla-portscan-plugin folder inside `$CLARIVE_BASE/plugins`
directory in Clarive's instance.

### Parameters

This new palette service will look for the open ports in the server and ports range you specify.

The parameters available for this service are:

- **Server (variable name: server)** - The GenericServer CI you want to scan.
- **User (user)** - User which will be used to connect to the server.
- **Port type (port_type)** - You can choose to look for TCP ports, UDP, or both.
- **Starting port (init_port)** - The starting port to begin the scanner. If you let it empty, it will take port 1 as default.
- **Finishing port (end_port)** - The last port you to scan. If you let it empty, it will take port 65535 as default.

NOTE: UPD scan runs under sudo and needs to be configured so it doesn't ask for the password.

**Only Clarive EE**

- **Errors and output** - These two fields deal with managing control errors. The options are:
   - **Fail and output error** - Search for configured error pattern in script output. If found, an error message is
     displayed in the monitor showing the match.
   - **Warning and output warning** - Search for configured warning pattern in script output. If found, an error message
     is displayed in the monitor showing the match.
   - **Custom** - If combo box errors is set to custom, a new form is displayed to define the behavior with these
     fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in the monitor.
   - **Warning** - Range of return code values to warn the user. A warning will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in the
     monitor.

## How to use

### In Clarive EE

You can find this service in the Rule Designer palette.

Op Name: **Open Ports Scanner**

Example:

```yaml
      Server: scan_server
      Port Type: TCP
      Starting port: 1
      Finishing port: 345
      Errors: fail 
``` 

### In Clarive SE

#### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

```yaml
rule: Port scan demo
do:
   - ports_scanner:
       server: scan_server   # Required. Use the mid set to the resource you created
       user: ${username}
       port_type: ["TCP", "UDP"]
       init_port: "1"            
       end_port: "43"
```

##### Outputs

###### Success

The server will return a HASH structure with two arrays for the ports found for TCP and for UDP. The keys for each port array in the HASH will be `tcp` and `udp`.
If no open ports were found, the array will be empty.

```yaml
do:
    - myvar = ports_scanner:
       server: scan_server   # Required. Use the mid set to the resource you created
       user: "clarive_user"
       port_type: ["TCP", "UDP"]
       init_port: "1"            
       end_port: "43"
    - echo: ${myvar}
```

For this command the output will be similar to this one:

```yaml
{"tcp":["22"],"udp":[]}
```

###### Possible configuration failures

**Nmap error**

```yaml
Error with nmap
```

Make sure you have Nmap installed and all requeriments to run the scanner.

**Variable required**

```yaml
Error in rulebook (compile): Required argument(s) missing for op "ports_scanner": "server"
```

Make sure you have all required variables defined.

**Not allowed variable**

```yaml
Error in rulebook (compile): Argument `maps` not available for op "ports_scanner"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.