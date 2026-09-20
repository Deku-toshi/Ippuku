import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("test environment", () => {
  it("renders and matches with jest-dom", () => {
    render(<button>ok</button>);
    expect(screen.getByRole("button", { name: "ok" })).toBeInTheDocument();
  });
});
