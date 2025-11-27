const SUPABASE_URL = "https://xcpwonsiujlckyglegli.supabase.co";
const SUPABASE_KEY = "sb_publishable_YAmmAPO3ncT6OpAN07dQxA_R8H4kJgq";

let lastData = {};

async function fetchLiveState() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/live_state?id=eq.1`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  const data = await res.json();
  if(data[0]){
    const d = data[0];
    if(d.breaking !== lastData.breaking) document.getElementById("breaking").textContent = d.breaking;
    if(d.lt_title !== lastData.lt_title) document.getElementById("lt-title").textContent = d.lt_title;
    if(d.lt_sub !== lastData.lt_sub) document.getElementById("lt-sub").textContent = d.lt_sub;
    if(d.ticker !== lastData.ticker) document.getElementById("ticker").textContent = d.ticker;
    lastData = d;
  }
}

function updateClock() {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}

setInterval(fetchLiveState, 2000);
setInterval(updateClock, 1000);
updateClock();
fetchLiveState();
