
# Port Scan Plugin

Port Scan Plugin is designed check open ports on a remote server.

## Requeriments

To be able to use the plugin correctly you must have [`nmap`](https://nmap.org/book/install.html) installed in your Clarive's instance.

## Installing

To install the plugin place the cla-portscan-plugin folder inside `CLARIVE_BASE/plugins`
directory in Clarive's platform.

## How to use

Once the plugin is placed in its folder, you can start using it going to your Clarive's
instance.

After restarting your Clarive's instance, you will have a new palette service:

### Open Ports Scanner:

This new palette service will look for the open ports in the server and ports range you specify.

The parameters available for this service are:

- **Server -** The GenericServer CI you want to scan.
- **Port type-** You can choose to look for TCP ports, UDP, or both.
- **Starting port -** The starting port to begin the scanner. If you let it empty, it will take port 1 as default.
- **Finishing port -** The last port you to scan. If you let it empty, it will take port 65535 as default.

The server will return a HASH structure with two arrays for the ports found for TCP and for UDP. The keys for each port array in the HASH will be `tcp` and `udp`.
If no open ports were found, the array will be empty.