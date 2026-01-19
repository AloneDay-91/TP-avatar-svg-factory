import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';
import React from 'react';

describe('PageHeader', () => {
  it('renders the title', () => {
    render(<PageHeader title="My Title" />);
    expect(screen.getByText('My Title')).toBeDefined();
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
  });

  it('renders the description when provided', () => {
    render(<PageHeader title="My Title" description="My Description" />);
    expect(screen.getByText('My Description')).toBeDefined();
  });

  it('does not render description when not provided', () => {
    render(<PageHeader title="My Title" />);
    const description = screen.queryByText('My Description');
    expect(description).toBeNull();
  });
});
