import { createElement, type ReactNode } from "react";
import type { ThreeElements } from "@react-three/fiber";

// Three.js is not a DOM renderer. Keep preview-injected data attributes out
// of its property reconciler, including props arriving through a spread.
export function threeElement<T extends keyof ThreeElements>(
  type: T,
  props: ThreeElements[T],
  ...children: ReactNode[]
) {
  const safeProps = Object.fromEntries(Object.entries(props).filter(([key]) => !key.startsWith("data-")));
  return createElement(type, safeProps, ...children);
}