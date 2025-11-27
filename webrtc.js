import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://xcpwonsiujlckyglegli.supabase.co";
const SUPABASE_KEY = "sb_publishable_YAmmAPO3ncT6OpAN07dQxA_R8H4kJgq";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let pc;
let channel;

// **Phone Broadcast**
export async function startBroadcast() {
  pc = new RTCPeerConnection();
  const localVideo = document.getElementById('localVideo');
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  stream.getTracks().forEach(track => pc.addTrack(track, stream));
  localVideo.srcObject = stream;

  pc.onicecandidate = event => {
    if(event.candidate) {
      supabase.from('webrtc_channel').insert([{type:'ice', data:JSON.stringify(event.candidate)}]);
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  await supabase.from('webrtc_channel').insert([{type:'offer', data:JSON.stringify(offer)}]);

  // Listen for answers from viewers
  supabase.channel('webrtc_channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'webrtc_channel' }, payload => {
      const record = payload.new;
      if(record.type === 'answer') {
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(record.data)));
      } else if(record.type === 'ice') {
        pc.addIceCandidate(JSON.parse(record.data));
      }
    })
    .subscribe();
}

// **Viewer Page**
export async function startViewer() {
  pc = new RTCPeerConnection();
  const remoteVideo = document.getElementById('remoteVideo');

  pc.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
  }

  pc.onicecandidate = event => {
    if(event.candidate) {
      supabase.from('webrtc_channel').insert([{type:'ice', data:JSON.stringify(event.candidate)}]);
    }
  };

  // Listen for offer from broadcaster
  const { data } = await supabase.from('webrtc_channel').select('*').eq('type','offer').limit(1).single();
  await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(data.data)));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  await supabase.from('webrtc_channel').insert([{type:'answer', data:JSON.stringify(answer)}]);

  // Listen for ICE from broadcaster
  supabase.channel('webrtc_channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'webrtc_channel' }, payload => {
      const record = payload.new;
      if(record.type === 'ice') {
        pc.addIceCandidate(JSON.parse(record.data));
      }
    })
    .subscribe();
}
