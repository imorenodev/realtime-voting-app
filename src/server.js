import Server from 'socket.io';

export default function startServer() {
  const io = new Server().attach(8090);

  // emits a snapshot of the app state whenever there is a change
  // emits a snapshot to all connected clients
  // not very efficient, could optimize with diffs or only broadcasting relevant slices
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );
}
