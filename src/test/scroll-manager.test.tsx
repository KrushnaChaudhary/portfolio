import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ScrollManager } from "@/components/ScrollManager";

// Each anchor gets its own spy. Spying on Element.prototype instead would make
// every element share one mock, so "this anchor was scrolled to and that one
// wasn't" becomes impossible to assert.
const mountAnchor = (id: string) => {
  const el = document.createElement("div");
  el.id = id;
  el.scrollIntoView = vi.fn();
  document.body.appendChild(el);
  return el;
};

describe("ScrollManager", () => {
  let scrollTo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollTo = vi.fn();
    // jsdom does not implement scrollIntoView at all; give the prototype a
    // no-op so anchors without their own spy don't throw.
    Element.prototype.scrollIntoView = vi.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("scrolls to top when there is no hash", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ScrollManager />
      </MemoryRouter>
    );
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
  });

  // The regression that made every kiosk in the arcade land in the same place:
  // navigating to /#skills used to force scrollTo(top:0) and ignore the hash.
  it("scrolls to the anchor when a hash is present, and not to top", () => {
    const el = mountAnchor("skills");

    render(
      <MemoryRouter initialEntries={["/#skills"]}>
        <ScrollManager />
      </MemoryRouter>
    );

    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: "instant", block: "start" });
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("distinct hashes resolve to their own distinct anchors", () => {
    const skills = mountAnchor("skills");
    const contact = mountAnchor("contact");

    render(
      <MemoryRouter initialEntries={["/#contact"]}>
        <ScrollManager />
      </MemoryRouter>
    );

    expect(contact.scrollIntoView).toHaveBeenCalled();
    expect(skills.scrollIntoView).not.toHaveBeenCalled();
  });

  // /arcade is lazy(), so the target section is not in the DOM on the effect's
  // first tick. The rAF retry has to bridge that gap.
  it("keeps retrying for an anchor that mounts a frame later", async () => {
    render(
      <MemoryRouter initialEntries={["/#career"]}>
        <ScrollManager />
      </MemoryRouter>
    );

    const late = mountAnchor("career");
    await waitFor(() => expect(late.scrollIntoView).toHaveBeenCalled());
  });
});
