# Cross Stitch Pattern Generator

A beautiful, modern web application that converts text into professional cross stitch patterns with extensive customization options.

## Features

### Text Input & Formatting
- **Multi-line Text Support**: Enter text with multiple lines using Enter key
- **Smart Line Management**: Control maximum lines displayed from your input
- **Line Spacing Options**: Choose from Tight, Normal, Loose, or Extra Loose spacing
- **Automatic Text Centering**: Each line is automatically centered for balanced patterns

### Font & Style Options
- **Google Fonts Integration**: Premium fonts optimized for cross-stitch patterns
- **11 Font Choices**: From Pixel Perfect to Gothic styles
  - Pixel Perfect (Press Start 2P) - Retro gaming style
  - Modern Tech (Orbitron) - Futuristic look
  - Friendly Round (Fredoka) - Approachable and clear
  - Bold Display (Bungee) - Strong impact
  - Strong Sans (Righteous) - Clean and bold
  - Comic Style (Bangers) - Fun and playful
  - Classic Serif - Traditional elegance
  - Clean Sans Serif - Modern simplicity
  - Monospace - Uniform spacing
  - Halloween (Creepster) - Spooky themed
  - Gothic (Nosifer) - Dark and dramatic
- **4 Size Options**: Small (8x8), Medium (12x12), Large (16x16), Extra Large (20x20)

### Color & Fabric Customization
- **Custom Stitch Colors**: Full color picker for thread selection
- **6 Fabric Colors**: White, Cream, Light Gray, Natural Beige, Light Blue, Light Pink
- **Aida Cloth Simulation**: Realistic fabric texture rendering
- **Smart Grid System**: Toggle-able grid with multiple line weights for easy counting

### Professional Pattern Information
- **Pattern Dimensions**: Exact stitch count (width × height)
- **Total Stitch Count**: Complete count for material planning
- **Time Estimation**: Projected completion time for beginners
- **Fabric Recommendations**: Suggested fabric size with seam allowances
- **Floss Requirements**: Estimated number of embroidery floss skeins needed

### Advanced Viewing Options
- **Zoom Functionality**: 20% to 300% zoom levels
- **Reset View**: Quick return to 100% zoom
- **Responsive Canvas**: Adapts to different screen sizes
- **Real-time Updates**: Instant pattern preview as you type

### Export Options
- **PNG Downloads**: High-quality pattern images
- **Grid Overlay Option**: Downloadable patterns with or without grid lines
- **PDF Export**: Professional pattern sheets with complete instructions
- **Print-Ready Formats**: Optimized for home and professional printing

## How to Use

1. **Enter Your Text**
   - Type your desired text in the input area
   - Use Enter for multiple lines
   - Adjust max lines if needed

2. **Customize Your Pattern**
   - Choose your preferred font style and size
   - Select line spacing for optimal readability
   - Pick your thread color and fabric type
   - Toggle grid overlay for counting assistance

3. **Preview & Adjust**
   - Watch your pattern update in real-time
   - Use zoom controls for detailed viewing
   - Check pattern information for planning

4. **Export Your Pattern**
   - Download PNG for digital viewing
   - Export PDF for complete instructions
   - Choose grid overlay options as needed

## Technical Features

### Modern Web Technologies
- **Vanilla JavaScript**: No framework dependencies, fast loading
- **HTML5 Canvas**: High-performance pattern rendering
- **CSS3**: Modern styling with responsive design
- **Google Fonts API**: Professional typography
- **jsPDF Integration**: Client-side PDF generation

### Smart Pattern Generation
- **Multi-pixel Sampling**: Better quality stitch detection
- **Adaptive Scaling**: Automatic sizing based on font selection
- **Brightness Thresholding**: Intelligent text-to-stitch conversion
- **Anti-aliasing Support**: Smooth font rendering

### Cross-Platform Compatibility
- **Mobile Responsive**: Touch-friendly controls for tablets and phones
- **Modern Browser Support**: Works in Chrome, Firefox, Safari, Edge
- **Offline Capable**: No server dependencies after initial load

## Mobile Features

- **Touch-Optimized Controls**: Larger buttons and inputs for mobile
- **Responsive Layout**: Single-column layout on smaller screens
- **Zoom Controls**: Mobile-friendly zoom interface
- **Swipe-Friendly Canvas**: Easy pattern navigation on touch devices

## Perfect For

- **Beginners**: Clear instructions and time estimates
- **Experienced Stitchers**: Professional-grade patterns with detailed information
- **Gift Making**: Personalized text patterns for special occasions
- **Home Decorating**: Custom quotes and sayings for wall art
- **Educational Projects**: Teaching cross-stitch techniques

## Pro Tips

1. **Font Selection**: Pixel Perfect works great for retro designs, while Fredoka is excellent for readable text
2. **Size Planning**: Use the fabric recommendation to plan your project size
3. **Color Choice**: Dark colors on light fabrics provide the best contrast
4. **Grid Usage**: Download with grid for easier counting during stitching
5. **PDF Export**: Include the PDF export for complete project documentation

## Local Development

To run locally:
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## License

This project is open source and available under the MIT License. 
