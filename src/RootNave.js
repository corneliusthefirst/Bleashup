// RootNavigation.js

import * as React from "react";
import { StackActions } from "react-navigation";

export const navigationRef = React.createRef();
export const isMountedRef = React.createRef();
export function navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current?.navigate(name, params);
  } else {
  }
}

export function push(args) {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current?.dispatch(StackActions.push(...args));
  } else {
  }
}

// add other navigation functions that you need and export them
