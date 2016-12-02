var reg = require("cla/reg");

reg.register('service.port.scan', {
    name: 'Open Ports Scanner',
    icon: '/plugin/cla-portscan-plugin/icon/portscan.svg',
    form: '/plugin/cla-portscan-plugin/form/portscan-form.js',
    handler: function(ctx, config) {

        var ci = require("cla/ci");
        var log = require('cla/log');
        var fs = require('cla/fs');

        var initPort = config.initPort
        var endPort = config.endPort
        var scanServer = ci.findOne({
            mid: config.server + ''
        });
        var scanRangeServer = ' -p ' + initPort + '-' + endPort + ' ' + scanServer.hostname;

        function parseNmapOutput(type, output) {
            if (output.lastIndexOf('Failed to resolve') > 0 || output.lastIndexOf('Note: Host seems down.') > 0) {
                log.error("Unable to connect to server. It might be down or doesnt exist. ", output);
                throw new Error("Unable to connect to server. It might be down or doesnt exist. " + output);
            }

            var initIndex = output.lastIndexOf(' SERVICE\n');
            if (initIndex < 0) {
                log.error("No open ports in the server for " + type + ' ', output);
                return [];
            }
            var lasttIndex = output.lastIndexOf('Nmap done:');
            var portsString = output.substring(initIndex + 8, lasttIndex - 1);
            var lines = portsString.split(/\r?\n/);
            var ports = [];

            for (var i = 0; i < lines.length; i++) {
                var portLine = lines[i].split(/\s+/);
                if (portLine[1] == 'open') {
                    var barIndex = portLine[0].lastIndexOf('/');
                    var portNumber = portLine[0].substring(0, barIndex);
                    ports.push(portNumber);
                }
            }
            return ports;
        };

        var scanPorts = function(scanCommand, type) {
            var local = ci.build('GenericServer', {
                name: "localhost",
                hostname: "localhost"
            });
            var agent = local.connect()
            agent.execute(scanCommand);
            var response = agent.tuple().output;
            var ports = parseNmapOutput(type, response);

            if (agent.tuple().rc != 0) {
                log.error("Error with nmap: " + response, response);
                throw new Error("Error with nmap: " + response);
            } else if (ports.length == 0) {
                log.error("No open ports in the server for " + type + ' ', response);
            } else {
                log.info(ports.length + " Port(s) found for " + type + ' ', response);
            }
            return ports;
        };

        if (initPort > endPort) {
            log.error("Starting Port is bigger than finishing Port. ");
            throw new Error("Starting Port is bigger than finishing Port. ");
        }


        var portsScanned = {};
        var scanCommand;
        if (config.portType.indexOf('TCP') != -1) {
            scanCommand = 'nmap -sT' + scanRangeServer;
            var tcpPorts = scanPorts(scanCommand, "TCP");
            portsScanned.tcp = tcpPorts;
        }
        if (config.portType.indexOf('UDP') != -1) {
            scanCommand = 'sudo -n nmap -sU' + scanRangeServer;
            var udpPorts = scanPorts(scanCommand, "UDP");
            portsScanned.udp = udpPorts;
        }
        return portsScanned;
    }
});