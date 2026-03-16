import StartTag from "./startTag";
import { render, screen } from "@testing-library/react";

describe('StartTag', () => {
  it('should contain "Not Started"', () => {
    render (<StartTag />);
    expect(screen.getByText('Not Started')).toBeInTheDocument();
  })
})