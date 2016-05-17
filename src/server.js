import Server from 'socket.io';

// The server operates like this
// - Client sents an action to the server.
// - The server hands the action to the Redux Store.
// - The store calls the reducer and the reducer executes the logic related to the action
// - The store updates its state based on the return value of the reducer
// - The store executes the listener function subscribed by the server
// - The server emits a state event
// - All connected clients - including the one that initiated the original action - receive the new state
export default function startServer(store) {
  const io = new Server().attach(8090);

  // emits a snapshot of the app state whenever there is a change
  // emits a snapshot to all connected clients
  // not very efficient, could optimize with diffs or only broadcasting relevant slices
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );

  // when a client connects to the socket.io server
  // send them the current state right away
  io.on('connection', (socket) => {
    socket.emit('state', store.getState().toJS());
    // when a client emits an action we feed it directly
    // to our redux store
    socket.on('action', store.dispatch.bind(store));
  });
}
