import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';
import { siteContent } from '@/content/site-content';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getAllByText(siteContent.hero.name).length).toBeGreaterThan(0);
  });

  it('renders all required sections', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: siteContent.about.title })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: siteContent.techStack.title })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', {
        name: siteContent.featuredProject.sectionTitle,
      })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: siteContent.contact.title })
    ).toBeDefined();
  });
});
