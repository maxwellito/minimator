export class VisualComponent {

  el: Element;
  bits = new Map<string, Element>();

  constructor (html: string) {
    // Build the node
    const container = document.createElement('div');
    container.innerHTML = html;
    if (container.children.length === 0) {
      throw new Error('VisualComponent has been created without HTML')
    }
    else if (container.children.length > 1) {
      throw new Error('VisualComponent has been created with more than one node')
    }
    this.el = container.children[0];

    // Find bits
    const bits = container.querySelectorAll('[data-bit]')
    bits.forEach(bit => {
      const bitName = bit.getAttribute('data-bit');
      if (bitName === null) {
        return;
      }
      this.bits.set(bitName, bit);
    });
  }
}