var http = require('http');

function GetStatus(addr) {
	var state = 'notset';

	var body = '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\n' +
                '  <s:Body>\n' +
                '    <u:GetBinaryState xmlns:u="urn:Belkin:service:basicevent:1"></u:GetBinaryState>\n' +
                '  </s:Body>\n' +
                '</s:Envelope>';
    var soapaction = '"urn:Belkin:service:basicevent:1#GetBinaryState"';

    var postRequest = {
        host: addr,
        path: '/upnp/control/basicevent1',
        port: 49153,
        method: 'POST',
        headers: {
            'Accept': '',
            'Content-Type': 'text/xml; charset=\"UTF-8"',
            'SOAPAction': soapaction
        }
    };
    
    var req = http.request( postRequest, function( res ) {
    
        console.log('HTTP Return Code: ' + res.statusCode );
        var buffer = "";
        res.on( "data", function( data ) { buffer = buffer + data; } );
        res.on( "end", function( data ) { console.log('Return XML: ' + buffer );   
    
        if (buffer.indexOf("<BinaryState>1</BinaryState>") > -1) {
            state = "On";
        }
        if (buffer.indexOf("<BinaryState>0</BinaryState>") > -1) {
            state = "Off";
        };    
        console.log(state);
        return state;
        }); 
    });
    
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        return e;
    });
      
    req.write(body);
    req.end();
}

function SetStatus(addr) {
    var status = GetStatus(addr);
    var state;
	if (status === 'On') {
        state = 0;
    }
    if (status === 'Off') {
        state = 1;
    };

	var body = '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\n' +
                '  <s:Body>\n' +
                '    <u:SetBinaryState xmlns:u="urn:Belkin:service:basicevent:1">\n' +
                '      <BinaryState>' + state + '</BinaryState>\n' +
                '    </u:SetBinaryState>\n' +
                '  </s:Body>\n' +
                '</s:Envelope>';
    var soapaction = '"urn:Belkin:service:basicevent:1#SetBinaryState"';

    var postRequest = {
        host: addr,
        path: '/upnp/control/basicevent1',
        port: 49153,
        method: 'POST',
        headers: {
            'Accept': '',
            'Content-Type': 'text/xml; charset=\"UTF-8"',
            'SOAPAction': soapaction
        }
    };
    
    var req = http.request( postRequest, function( res )    {
    
        console.log( res.statusCode );
        var buffer = "";
        res.on( "data", function( data ) { buffer = buffer + data; } );
        res.on( "end", function( data ) { console.log( buffer );
            console.log('Switch state changed to: ' + state);
        });
    
    });
    
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    
    req.write( body );
    req.end();
}
GetStatus('192.168.0.26');
SetStatus("192.168.0.26");