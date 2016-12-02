(function(params) {

    var server = Cla.ui.ciCombo({
        name: 'server',
        value: params.data.server || '',
        class: 'BaselinerX::CI::generic_server',
        fieldLabel: 'Server',
        allowBlank: false,
        with_vars: 1
    });

    var portType = Cla.ui.comboBox({
        name: 'portType',
        fieldLabel: 'Port Type',
        data: [
            ['TCP'],
            ['UDP'],
        ],
        value: params.data.portType || 'TCP',
        allowBlank: false,
        anchor: '100%',
        singleMode: false
    });

    var initPort = Cla.ui.textField({
        name: 'initPort',
        value: params.data.initPort || '1',
        fieldLabel: 'Starting Port',
        allowBlank: true,
        maxLength: 5
    });
    var endPort = Cla.ui.textField({
        name: 'endPort',
        value: params.data.endPort || '65535',
        fieldLabel: 'Finishing Port',
        allowBlank: true,
        maxLength: 5
    });

    return [
        server,
        portType,
        initPort,
        endPort
    ]
})