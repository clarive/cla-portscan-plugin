(function(params) {

    var server = Cla.ui.ciCombo({
        name: 'server',
        value: params.data.server || '',
        class: 'generic_server',
        fieldLabel: _('Server'),
        allowBlank: false,
        with_vars: 1
    });

    var portType = Cla.ui.comboBox({
        name: 'portType',
        fieldLabel: _('Port Type'),
        data: [
            ['TCP', _('TCP')],
            ['UDP', _('UDP')],
        ],
        value: params.data.portType || 'TCP',
        allowBlank: false,
        anchor: '100%',
        singleMode: false
    });

    var initPort = Cla.ui.textField({
        name: 'initPort',
        value: params.data.initPort || '1',
        fieldLabel: _('Starting Port'),
        allowBlank: true
    });
    var endPort = Cla.ui.textField({
        name: 'endPort',
        value: params.data.endPort || '65535',
        fieldLabel: _('Finishing Port'),
        allowBlank: true
    });

    return [
        server,
        portType,
        initPort,
        endPort
    ]
})