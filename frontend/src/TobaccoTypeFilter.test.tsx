import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TobaccoTypeFilter } from "./TobaccoTypeFilter";

describe("TobaccoTypeFilter", () => {
  it('display as many buttons as there are FILTER OPTIONS', () => {
    render(<TobaccoTypeFilter params={{}} setParams={vi.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
  it('when inactive button is pressed, setParams is called with argument tobaccoTypeId', async () => {
    const setParams = vi.fn();
    const user = userEvent.setup();
    render(<TobaccoTypeFilter params={{}} setParams={setParams} />);

    await user.click(screen.getByRole("button", { name: /紙タバコ/ }));

    expect(setParams).toHaveBeenCalledWith({ tobaccoTypeId: 1 });
  });
  it('when inactive button is pressed, setParams is called with argument electronicOnly set to true', async () => {
    const setParams = vi.fn();
    const user = userEvent.setup();
    render(<TobaccoTypeFilter params={{}} setParams={setParams} />);

    await user.click(screen.getByRole("button", { name: /電子タバコ/ }));

    expect(setParams).toHaveBeenCalledWith({ electronicOnly: true});
  });
  it("setParams is called with empty object when active button is pressed again", async () => {
    const setParams = vi.fn();
    const user = userEvent.setup();
    render(<TobaccoTypeFilter params={{ tobaccoTypeId: 1 }} setParams={setParams} />);

    await user.click(screen.getByRole("button", { name: /紙タバコ/ }));
    expect(setParams).toHaveBeenCalledWith({});
  });
  it("aria-pressed is set correctly according to params", () => {
    render(<TobaccoTypeFilter params={{ tobaccoTypeId: 1 }} setParams={vi.fn()} />);

    const cigaretteButton = screen.getByRole("button", { name: /紙タバコ/});
    const electronicButton = screen.getByRole("button", { name: /電子タバコ/});

    expect(cigaretteButton).toHaveAttribute("aria-pressed", "true");
    expect(electronicButton).toHaveAttribute("aria-pressed", "false");
  });
});
