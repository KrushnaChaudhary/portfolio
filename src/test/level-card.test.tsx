import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LevelCard from "@/components/screens/LevelCard";
import { ProjectData } from "@/data/projectsData";

const baseProject: ProjectData = {
  title: "Test Game",
  subtitle: "Test Genre • Test Studio",
  description: "A test game.",
  image: null,
  tags: ["Unity"],
  highlights: ["Highlight"],
  myRole: ["Role"],
  fullDescription: "Full description.",
};

describe("LevelCard", () => {
  it("renders title, status badge, and stat cells from meta", () => {
    render(
      <MemoryRouter>
        <LevelCard
          slug="test-game"
          project={{
            ...baseProject,
            meta: {
              studio: "Kwalee",
              genre: "Puzzle",
              year: "2024",
              platforms: ["Android"],
              engine: "Unity",
              status: "Shipped",
            },
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
    expect(screen.getByText("Puzzle · Kwalee")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("Android")).toBeInTheDocument();
  });

  it("falls back to subtitle when meta is absent", () => {
    render(
      <MemoryRouter>
        <LevelCard slug="test-game" project={baseProject} />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Genre • Test Studio")).toBeInTheDocument();
  });
});
