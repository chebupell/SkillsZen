import { render, screen } from "@testing-library/react";
import RetryTag from "./retryTag";

describe('RetryTag', () => {
  it('should contain "Try again"', () => {
    render(<RetryTag />)
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });
})