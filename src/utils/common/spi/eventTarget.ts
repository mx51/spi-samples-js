class SpiEventTarget {
  private listeners: Any;

  private mappers: Any;

  spiClient: Any;

  constructor() {
    this.listeners = {};
    this.mappers = {};

    this.addEventListener = this.addEventListener.bind(this);
    this.dispatchEvent = this.dispatchEvent.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
    this.setEventMapper = this.setEventMapper.bind(this);
  }

  addEventListener(type: Any, callback: Any): () => void {
    if (!(type in this.listeners)) this.listeners[type] = [];
    this.listeners[type].push(callback);

    return () => this.removeEventListener(type, callback);
  }

  dispatchEvent(event: Any): boolean {
    if (!event.type || !(event.type in this.listeners)) return true;

    const stack = this.listeners[event.type].slice();
    const mapper = this.mappers[event.type];
    const mappedEvent = mapper ? mapper(event) : event;

    for (let i = 0, { length } = stack; i < length; i += 1) {
      stack[i].call(this, mappedEvent);
    }

    return !mappedEvent.defaultPrevented;
  }

  removeEventListener(type: Any, callback: Any): void {
    if (!this.listeners[type]) return;

    const stack = this.listeners[type];
    for (let i = 0, { length } = stack; i < length; i += 1) {
      if (stack[i] === callback) {
        stack.splice(i, 1);
        return;
      }
    }
  }

  setEventMapper(type: Any, mapper: Any): () => void {
    this.mappers[type] = mapper;

    return () => {
      this.mappers[type] = undefined;
    };
  }
}

export default SpiEventTarget;
