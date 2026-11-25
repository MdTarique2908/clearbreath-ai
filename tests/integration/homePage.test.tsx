import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import HomePage from '../../src/app/page';

describe('HomePage Accessibility & Interactive Flows', () => {
  it('has zero WCAG accessibility violations', async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('updates live impact metrics when simulator actions are toggled', () => {
    render(<HomePage />);

    const transitButton = screen.getByRole('button', {
      name: /Switch Solo Rides to Metro \/ Shared Transit/i,
    });

    expect(transitButton).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(transitButton);
    expect(transitButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/-72%/i)).toBeInTheDocument();
  });

  it('switches between Household and Community planning modes', () => {
    render(<HomePage />);
    const communityRadio = screen.getByLabelText(/Neighborhood \/ Community/i);
    fireEvent.click(communityRadio);
    expect(communityRadio).toBeChecked();
  });
});
