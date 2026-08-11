import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "@/pages/NotFound";

describe("NotFound", () => {
  it("resolves the home link under the /portfolio/ basename, not the Pages root", () => {
    render(
      <MemoryRouter basename="/portfolio" initialEntries={["/portfolio/does-not-exist"]}>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole("link", { name: /return to home/i });
    const href = homeLink.getAttribute("href") ?? "";
    expect(href.startsWith("/portfolio")).toBe(true);
    expect(href).not.toBe("/");
  });
});
