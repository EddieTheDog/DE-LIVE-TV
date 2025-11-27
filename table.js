// Simulate a live_state table in the browser
const LiveTable = {
    id: 1,
    broadcast_on: false,
    breaking: "",
    lt_title: "",
    lt_sub: "",
    ticker: ""
};

// Functions to access the table
function getLiveState() {
    return {...LiveTable}; // return copy
}

function updateLiveState(updates) {
    Object.assign(LiveTable, updates);
}
