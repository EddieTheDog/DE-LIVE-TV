// Replace with your signaling server / Supabase Realtime channels
const signalingChannel = new EventTarget();
let pc;

// Phone broadcasts live feed
async function startBroadcast() {
  pc = new RTCPeerConnection();
  const localVideo = document.getElementById('localVideo');
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  stream.getTracks().forEach(track => pc.addTrack(track, stream));
  localVideo.srcObject = stream;

  // ICE candidates
  pc.onicecandidate = event => {
    if (event.candidate) signalingChannel.dispatchEvent(new CustomEvent('ice-candidate', {detail: event.candidate}));
  }

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  signalingChannel.dispatchEvent(new CustomEvent('offer', {detail: offer}));

  signalingChannel.addEventListener('answer', e => pc.setRemoteDescription(new RTCSessionDescription(e.detail)));
  signalingChannel.addEventListener('ice-candidate', e => pc.addIceCandidate(e.detail));
}

// Viewer receives live feed
async function startViewer() {
  pc = new RTCPeerConnection();
  const remoteVideo = document.getElementById('remoteVideo');

  pc.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
  }

  pc.onicecandidate = event => {
    if (event.candidate) signalingChannel.dispatchEvent(new CustomEvent('ice-candidate', {detail: event.candidate}));
  }

  signalingChannel.addEventListener('offer', async e => {
    await pc.setRemoteDescription(new RTCSessionDescription(e.detail));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    signalingChannel.dispatchEvent(new CustomEvent('answer', {detail: answer}));
  });

  signalingChannel.addEventListener('ice-candidate', e => pc.addIceCandidate(e.detail));
}
