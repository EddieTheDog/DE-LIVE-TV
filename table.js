// table.js
const LiveTable = {
  broadcast_on: false,
  breaking: "",
  lt_title: "",
  lt_sub: "",
  ticker: ""
};

function getLiveState() { return {...LiveTable}; }
function updateLiveState(updates) { Object.assign(LiveTable, updates); }
