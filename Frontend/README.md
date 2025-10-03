# OCL SERVICES - Modern Courier & Logistics Landing Page

A beautiful, responsive landing page for OCL SERVICES courier services built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

✨ **Modern Design System**
- Red border theme with light pastel backgrounds
- Smooth animations and hover effects
- Fully responsive design
- Dark/light mode support

🎠 **Hero Carousel**
- Full-screen image carousel with parallax effects
- Auto-play functionality with manual controls
- Smooth slide transitions
- Call-to-action buttons

🧭 **Navigation**
- Sticky transparent navbar
- Animated dropdown menus
- Mobile-friendly hamburger menu
- Smooth scroll to sections

📦 **Core Features**
- Track & Trace functionality
- Location finder
- Schedule pickup
- Real-time package tracking demo

📱 **Interactive Elements**
- App download modal
- Newsletter signup
- Social media integration
- Contact forms

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + CSS Custom Properties
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Animations**: CSS Animations + Framer Motion ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd oclservices-landing
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation with dropdowns
│   ├── HeroCarousel.tsx # Hero section with image carousel
│   ├── FeatureCards.tsx # Service feature cards
│   ├── TrackingSection.tsx # Package tracking demo
│   ├── Footer.tsx      # Footer with newsletter & social links
│   └── ui/             # shadcn/ui components
├── data/               # JSON data files
│   ├── nav.json        # Navigation structure
│   └── hero.json       # Hero carousel content
├── assets/             # Images and static files
└── pages/              # Page components
```

## Design System

The project uses a comprehensive design system with:

### Colors
- **Primary**: OCL SERVICES Blue (#0b57d0)
- **Brand Red**: For borders and accents (#dc2626)
- **Light Backgrounds**: Soft pastels (cream, mint, peach, soft blue)

### Components
- **Cards**: Red borders with light gradient backgrounds
- **Buttons**: Primary (gradient blue) and outline variants
- **Animations**: Fade-in, slide-up, float, and hover effects

### CSS Custom Properties
All colors and effects are defined in `src/index.css` using CSS custom properties for easy theming.

## Customization

### Adding New Sections
1. Create component in `src/components/`
2. Import and add to `src/pages/Index.tsx`
3. Update navigation in `src/data/nav.json` if needed

### Modifying Colors
Update CSS custom properties in `src/index.css`:
```css
:root {
  --brand-red: 0 84% 60%;
  --background-soft: 220 50% 98%;
  /* ... other colors */
}
```

### Adding New Hero Slides
Update `src/data/hero.json` and add corresponding images to `src/assets/`

## Integration Notes

The codebase includes TODO comments for future Supabase integration:

- Newsletter signup
- Contact forms  
- Package tracking API
- User authentication
- Content management

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images with lazy loading
- Tree-shaken icon imports
- CSS-in-JS avoided for better performance
- Minimal JavaScript bundle

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

Built with ❤️ using Lovable.dev