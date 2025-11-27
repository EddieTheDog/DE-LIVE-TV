// server.js
const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

let broadcaster = null;

wss.on('connection', ws => {
  ws.on('message', msg => {
    const data = JSON.parse(msg);

    switch(data.type){
      case 'broadcaster':
        broadcaster = ws;
        break;

      case 'watcher':
        ws.id = data.id;
        if(broadcaster && broadcaster.readyState === WebSocket.OPEN){
          broadcaster.send(JSON.stringify({type:'watcher', id:data.id}));
        }
        break;

      case 'offer':
        wss.clients.forEach(client => {
          if(client.id === data.id && client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify({type:'offer', sdp:data.sdp, id:data.id}));
          }
        });
        break;

      case 'answer':
        if(broadcaster && broadcaster.readyState === WebSocket.OPEN){
          broadcaster.send(JSON.stringify({type:'answer', sdp:data.sdp, id:data.id}));
        }
        break;

      case 'candidate':
        wss.clients.forEach(client => {
          if(client.id === data.id && client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify({type:'candidate', candidate:data.candidate, id:data.id}));
          }
        });
        break;

      case 'control':
        if(broadcaster && broadcaster.readyState === WebSocket.OPEN){
          broadcaster.send(JSON.stringify({type:'control', action:data.action}));
        }
        break;
    }
  });

  ws.on('close', () => {
    if(ws === broadcaster) broadcaster = null;
  });
});

console.log(`WebSocket signaling server running on port ${PORT}`);
