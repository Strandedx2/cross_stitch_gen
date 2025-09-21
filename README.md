# Cross Stitch Pattern Generator

A beautiful web application that converts text into cross stitch patterns with customizable options.

## Features

- **Text Input**: Enter any text to convert into cross stitch patterns
- **Multi-line Support**: Create patterns with multiple lines of text
- **Font Size Options**: Choose from Small (8x8), Medium (12x12), Large (16x16), or Extra Large (20x20) stitch sizes
- **Font Style Selection**: Pick from Pixel Art, Serif, Sans Serif, Monospace, or Script fonts
- **Custom Colors**: Select any color for your stitches using the color picker
- **Real-time Preview**: See your pattern update instantly as you make changes
- **Pattern Information**: View pattern dimensions and total stitch count
- **Export Options**: Download patterns as PNG files with or without grid lines

## How to Use

1. **Open the App**: Open `index.html` in your web browser
2. **Enter Text**: Type your desired text in the "Text to Convert" field
3. **Customize Settings**:
   - Set the number of lines for multi-line patterns
   - Choose your preferred font size
   - Select a font style that suits your design
   - Pick a stitch color using the color picker
4. **Generate Pattern**: Click "Generate Pattern" or make changes to see real-time updates
5. **Download**: Use the download buttons to save your pattern as a PNG file

## Technical Details

### Files Structure
- `index.html` - Main application interface
- `styles.css` - Responsive styling and layout
- `script.js` - Pattern generation logic and user interactions

### Technology Stack
- **HTML5** - Structure and form controls
- **CSS3** - Modern styling with gradients and responsive design
- **Vanilla JavaScript** - Pattern generation and Canvas API rendering
- **Canvas API** - Cross stitch pattern visualization

### Pattern Generation Process
1. Text is rendered to a temporary canvas using specified font settings
2. Pixel data is analyzed to identify text areas
3. Pixels are converted to cross stitch symbols (X marks)
4. Patterns are scaled based on selected grid size
5. Final pattern is rendered with customizable stitch colors

## Browser Compatibility

This application works in all modern web browsers that support:
- HTML5 Canvas API
- CSS3 Features
- ES6 JavaScript

## Local Development

To run the application locally:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your web browser.

## Example Patterns

The application can generate patterns for:
- Single words: "Hello"
- Phrases: "Cross Stitch"
- Multi-line text: 
  ```
  Cross Stitch
  Pattern
  ```
- Custom fonts and sizes for different aesthetic effects

## License

This project is open source and available under the MIT License. 
