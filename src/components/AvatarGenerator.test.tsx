import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AvatarGenerator from './AvatarGenerator';
import React from 'react';

// Mock fetch
global.fetch = vi.fn();

describe('AvatarGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the initial state', () => {
    render(<AvatarGenerator />);
    expect(screen.getByText('Cat Avatar Generator')).toBeDefined();
    expect(screen.getByText('Generate Random Avatar')).toBeDefined();
  });

  it('generates an avatar when clicking the button', async () => {
    const mockSvg = '<svg>cat</svg>';
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ svg: mockSvg, timestamp: Date.now() }),
    });

    render(<AvatarGenerator />);
    
    const button = screen.getByText('Generate Random Avatar');
    fireEvent.click(button);

    expect(screen.getByText('Generating...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('Download SVG')).toBeDefined();
    });

    // Check if the SVG is rendered (it's dangerouslySetInnerHTML, so we check for the container)
    const svgContainer = screen.getByText('Download SVG').parentElement?.parentElement?.querySelector('.bg-gray-50');
    expect(svgContainer?.innerHTML).toContain(mockSvg);
  });

  it('shows an error message when generation fails', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API Error' }),
    });

    render(<AvatarGenerator />);
    
    const button = screen.getByText('Generate Random Avatar');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeDefined();
    });
  });

  it('loads history from localStorage', () => {
    const history = [
      { svg: '<svg>cat1</svg>', timestamp: 123456789 },
    ];
    localStorage.setItem('avatar-history', JSON.stringify(history));

    render(<AvatarGenerator />);

    expect(screen.getByText('Recent Avatars')).toBeDefined();
  });
});
