export default {
  setPendingReportsCounter(state, count) {
    state.pendingReportsCounter = count;
  },
  setTechnicianItem(state, item) {
    state.item = item;
  },
  setTechnicianMode(state, mode) {
    state.mode = mode;
  },
  openTechnicianDialog(state) {
    state.dialog = true;
  },
  closeTechnicianDialog(state) {
    state.dialog = false;
  },
};
