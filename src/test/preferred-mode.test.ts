import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePreferredMode } from "@/hooks/usePreferredMode";

describe("usePreferredMode", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("defaults to ui mode", () => {
    const { result } = renderHook(() => usePreferredMode());
    expect(result.current.mode).toBe("ui");
  });

  it("markArcade persists and switches the mode", () => {
    const { result } = renderHook(() => usePreferredMode());
    act(() => result.current.markArcade());
    expect(result.current.mode).toBe("arcade");
    expect(localStorage.getItem("kc.mode")).toBe("arcade");
  });

  it("?ui=1 clears a stored arcade preference back to ui", () => {
    localStorage.setItem("kc.mode", "arcade");
    window.history.pushState({}, "", "/?ui=1");
    const { result } = renderHook(() => usePreferredMode());
    expect(result.current.mode).toBe("ui");
    expect(localStorage.getItem("kc.mode")).toBeNull();
  });

  it("falls back to ui when localStorage throws", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { result } = renderHook(() => usePreferredMode());
    expect(result.current.mode).toBe("ui");
    spy.mockRestore();
  });
});
