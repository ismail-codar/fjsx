// @flow

// Same value used by react-jss
export const CHANNEL = "__THEMING__";

const themeListener = {
  initial: context => {
    debugger;
    if (!context[CHANNEL]) {
      return null;
    }

    return context[CHANNEL].getState();
  },
  subscribe: (context, cb) => {
    debugger;
    if (!context[CHANNEL]) {
      return null;
    }

    return context[CHANNEL].subscribe(cb);
  },
  unsubscribe(context, subscriptionId) {
    debugger;
    if (context[CHANNEL]) {
      context[CHANNEL].unsubscribe(subscriptionId);
    }
  }
};

export default themeListener;
