import { Layout, ID3StyleLayoutAdaptor, Event, EventType } from "webcola";
import { EventEmitter } from "events";

export class LayoutAdaptor extends Layout {
  ee = new EventEmitter();
  constructor(width, height) {
    super();
    super
      .linkDistance(120)
      .avoidOverlaps(true)
      .size([width, height]);
  }
  kick(): void {
    let frameId = 0;
    const animFn = () => {
      if (this.alpha()) {
        super.tick();
        frameId = window.requestAnimationFrame(animFn);
      }
    };
    this.ee.addListener(EventType[EventType.end], () => {
      super.stop();
      frameId = 0;
      window.cancelAnimationFrame(frameId);
    });
    animFn();
  }

  trigger(e: Event) {
    this.ee.emit(EventType[e.type]);
  }

  on(e: EventType | string, listener: (event?: Event) => void): this {
    this.ee.addListener(e.toString(), listener);
    return this;
  }
}
