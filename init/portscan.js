var reg = require("cla/reg");

reg.register('service.port.scan', {
    name: _('Open Ports Scanner'),
    icon: '/plugin/cla-portscan-plugin/icon/portscan.svg',
    form: '/plugin/cla-portscan-plugin/form/portscan-form.js',
    handler: function(ctx, config) {

        var ci = require("cla/ci");
        var log = require('cla/log');
        var fs = require('cla/fs');

        var initPort = Number(config.initPort);
        var endPort = Number(config.endPort);
        var scanServer = ci.findOne({
            mid: config.server + ''
        });
        if (!scanServer){
            log.fatal(_("Server CI doesn't exist"));
        }
        var scanRangeServer = ' -p ' + initPort + '-' + endPort + ' ' + scanServer.hostname;

        function parseNmapOutput(type, output) {
            if (output.lastIndexOf('Failed to resolve') > 0 || output.lastIndexOf('Note: Host seems down.') > 0) {
                log.fatal(_("Unable to connect to server. It might be down or doesnt exist. "), output);
            }

            var initIndex = output.lastIndexOf(' SERVICE\n');
            if (initIndex < 0) {
                log.error(_("No open ports in the server for ") + type + ' ', output);
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
                log.fatal(_("Error with nmap: "), response);
            } else if (ports.length == 0) {
                log.error(_("No open ports in the server for ") + type + ' ', response);
            } else {
                log.info(ports.length + _(" Port(s) found for ") + type + ' ', response);
            }
            return ports;
        };

        if (initPort == NaN || endPort == NaN) {
            log.fatal(_("Uncorrect ports: ") + initPort + " " + endPort);
        }
        if (initPort > 65535) {
            log.fatal(_("Starting port can't overpass 65535: ") + initPort);
        }
        if (endPort > 65535) {
            log.fatal(_("Finishing port can't overpass 65535: ") + endPort);
        }
        if (initPort > endPort) {
            log.error(_("Starting Port is bigger than finishing Port. "));
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