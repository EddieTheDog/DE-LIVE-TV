const SUPABASE_URL = "https://xcpwonsiujlckyglegli.supabase.co";
const SUPABASE_KEY = "sb_publishable_YAmmAPO3ncT6OpAN07dQxA_R8H4kJgq";

async function fetchLiveState() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/live_state?id=eq.1`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const data = await res.json();
  if(data[0]){
    document.getElementById("breaking").textContent = data[0].breaking;
    document.getElementById("lt-title").textContent = data[0].lt_title;
    document.getElementById("lt-sub").textContent = data[0].lt_sub;
    document.getElementById("ticker").textContent = data[0].ticker;
  }
}

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

setInterval(fetchLiveState, 2000);
setInterval(updateClock, 1000);
updateClock();
fetchLiveState();
