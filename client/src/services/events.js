export class EventEmitter {
  callbacks = []

  then(fn) {
    this.callbacks.push(fn);
  }

  emit(data) {
    this.callbacks.forEach(cb => cb(data));
  }
}