import { applyProps } from "@react-three/fiber";
import { Mesh } from "three";
import { describe, expect, it } from "vitest";
import { threeElement } from "./three-element";

describe("Three.js preview metadata boundary", () => {
  it("reproduces the invalid source attribute and strips it before reconciliation", () => {
    const metadata = { "data-tsd-source": "/scene.tsx:1:1" };
    const invalidMesh = Object.assign(new Mesh(), { data: "preview metadata" });
    expect(() => applyProps(invalidMesh, metadata)).toThrow('Cannot set "data-tsd-source"');
    const element = threeElement("mesh", { ...metadata, visible: false });
    expect(element.props).not.toHaveProperty("data-tsd-source");
    const mesh = Object.assign(new Mesh(), { data: "preview metadata" });
    applyProps(mesh, element.props);
    expect(mesh.visible).toBe(false);
  });
});