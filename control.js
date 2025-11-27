const SUPABASE_URL = "YOUR_PROJECT_URL"; // e.g. https://xyzcompany.supabase.co
const SUPABASE_KEY = "sb_publishable_YAmmAPO3ncT6OpAN07dQxA_R8H4kJgq";

async function updateLive() {
  const body = {
    breaking: document.getElementById("breakingInput").value,
    lt_title: document.getElementById("titleInput").value,
    lt_sub: document.getElementById("subInput").value,
    ticker: document.getElementById("tickerInput").value
  };

  await fetch(`${SUPABASE_URL}/rest/v1/live_state?id=eq.1`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify(body)
  });

  alert("LIVE TV updated!");
}
