import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";
import ownerDocument from "dom-helpers/ownerDocument";
import getScrollbarSize from "dom-helpers/util/scrollbarSize";
import isOverflowing from "./isOverflowing";
import { ariaHidden, hideSiblings, showSiblings } from "./manageAriaHidden";

/**
 * @ignore - do not document.
 *
 * Proper state managment for containers and the modals in those containers.
 * Simplified, but inspired by react-overlay's ModalManager class
 * Used by the Modal to ensure proper styling of containers.
 */
class ModalManager {
  hideSiblingNodes;
  handleContainerOverflow;
  modals;
  containers;
  data;
  constructor({
    hideSiblingNodes = true,
    handleContainerOverflow = true
  } = {}) {
    this.hideSiblingNodes = hideSiblingNodes;
    this.handleContainerOverflow = handleContainerOverflow;
    // this.modals[modalIdx] = modal
    this.modals = [];
    // this.containers[containerIdx] = container
    this.containers = [];
    // this.data[containerIdx] = {
    //   modals: [],
    // }
    this.data = [];
  }

  add(modal, container) {
    let modalIdx = this.modals.indexOf(modal);
    const containerIdx = this.containers.indexOf(container);

    if (modalIdx !== -1) {
      return modalIdx;
    }

    modalIdx = this.modals.length;
    this.modals.push(modal);

    if (this.hideSiblingNodes) {
      hideSiblings(container, modal.mountNode);
    }

    if (containerIdx !== -1) {
      this.data[containerIdx].modals.push(modal);
      return modalIdx;
    }

    const data = {
      modals: [modal],
      overflowing: isOverflowing(container),
      prevPaddings: []
    };

    if (this.handleContainerOverflow) {
      setContainerStyle(data, container);
    }

    this.containers.push(container);
    this.data.push(data);

    return modalIdx;
  }

  remove(modal) {
    const modalIdx = this.modals.indexOf(modal);

    if (modalIdx === -1) {
      return modalIdx;
    }

    const containerIdx = findContainer(this.data, modal);
    const data = this.data[containerIdx];
    const container = this.containers[containerIdx];

    data.modals.splice(data.modals.indexOf(modal), 1);
    this.modals.splice(modalIdx, 1);

    // If that was the last modal in a container, clean up the container.
    if (data.modals.length === 0) {
      if (this.handleContainerOverflow) {
        removeContainerStyle(data, container);
      }

      if (this.hideSiblingNodes) {
        showSiblings(container, modal.mountNode);
      }
      this.containers.splice(containerIdx, 1);
      this.data.splice(containerIdx, 1);
    } else if (this.hideSiblingNodes) {
      // Otherwise make sure the next top modal is visible to a SR.
      ariaHidden(false, data.modals[data.modals.length - 1].mountNode);
    }

    return modalIdx;
  }

  isTopModal(modal) {
    return (
      !!this.modals.length && this.modals[this.modals.length - 1] === modal
    );
  }
}
