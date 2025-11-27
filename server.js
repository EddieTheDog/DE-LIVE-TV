// Requires Node.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let broadcaster = null;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    switch(data.type) {
      case 'broadcaster':
        broadcaster = ws;
        break;

      case 'watcher':
        if(broadcaster) {
          broadcaster.send(JSON.stringify({ type: 'watcher', id: data.id }));
        }
        break;

      case 'offer':
        // send offer from broadcaster to viewer
        wss.clients.forEach(client => {
          if(client !== broadcaster && client.readyState === WebSocket.OPEN && client.id === data.id) {
            client.send(JSON.stringify({ type: 'offer', sdp: data.sdp, id: data.id }));
          }
        });
        break;

      case 'answer':
        // send answer from viewer to broadcaster
        if(broadcaster && broadcaster.readyState === WebSocket.OPEN) {
          broadcaster.send(JSON.stringify({ type: 'answer', sdp: data.sdp, id: data.id }));
        }
        break;

      case 'candidate':
        // forward ICE candidate
        wss.clients.forEach(client => {
          if(client.id === data.id && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'candidate', candidate: data.candidate }));
          }
        });
        break;
    }
  });

  ws.on('close', function() {
    if(ws === broadcaster) {
      broadcaster = null;
    }
  });
});
