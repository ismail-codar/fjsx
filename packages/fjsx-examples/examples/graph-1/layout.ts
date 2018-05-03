import { Layout, ID3StyleLayoutAdaptor, Event, EventType } from "webcola";
import { EventEmitter } from "events";

export class LayoutAdaptor extends Layout {
  ee = new EventEmitter();
  frameId = -1;
  constructor(width, height) {
    super();
    super
      .linkDistance(120)
      .avoidOverlaps(true)
      .size([width, height]);
    this.ee.addListener(EventType[EventType.end], () => {
      super.stop();
      this.frameId = 0;
      window.cancelAnimationFrame(this.frameId);
    });
  }
  animFn() {
    if (this.alpha()) {
      super.tick();
      this.frameId = window.requestAnimationFrame(this.animFn.bind(this));
    }
  }
  kick(): void {
    this.animFn();
  }

  trigger(e: Event) {
    this.ee.emit(EventType[e.type]);
  }

  on(e: EventType | string, listener: (event?: Event) => void): this {
    this.ee.addListener(e.toString(), listener);
    return this;
  }
}
