class CrossStitchGenerator {
    constructor() {
        this.canvas = document.getElementById('pattern-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 10; // Base grid size
        this.showGrid = false;
        
        // Font size mappings
        this.fontSizes = {
            'small': { size: 8, grid: 8 },
            'medium': { size: 12, grid: 10 },
            'large': { size: 16, grid: 12 },
            'extra-large': { size: 20, grid: 14 }
        };
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        const form = document.getElementById('pattern-form');
        const downloadPattern = document.getElementById('download-pattern');
        const downloadGrid = document.getElementById('download-grid');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generatePattern();
        });
        
        downloadPattern.addEventListener('click', () => {
            this.downloadPattern(false);
        });
        
        downloadGrid.addEventListener('click', () => {
            this.downloadPattern(true);
        });
        
        // Real-time updates
        document.getElementById('text-input').addEventListener('input', () => {
            this.debounceGenerate();
        });
        
        document.getElementById('font-size').addEventListener('change', () => {
            this.generatePattern();
        });
        
        document.getElementById('font-family').addEventListener('change', () => {
            this.generatePattern();
        });
        
        document.getElementById('stitch-color').addEventListener('change', () => {
            this.generatePattern();
        });
    }
    
    debounceGenerate() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.generatePattern();
        }, 300);
    }
    
    generatePattern() {
        const text = document.getElementById('text-input').value.trim();
        const lines = parseInt(document.getElementById('lines-input').value);
        const fontSize = document.getElementById('font-size').value;
        const fontFamily = document.getElementById('font-family').value;
        const stitchColor = document.getElementById('stitch-color').value;
        
        if (!text) {
            this.clearCanvas();
            return;
        }
        
        const textLines = this.prepareTextLines(text, lines);
        this.renderPattern(textLines, fontSize, fontFamily, stitchColor);
        this.showPatternInfo();
    }
    
    prepareTextLines(text, maxLines) {
        // Split text into lines
        let lines = text.split('\n');
        
        // If we have more lines than requested, take the first ones
        if (lines.length > maxLines) {
            lines = lines.slice(0, maxLines);
        }
        
        // If we have fewer lines than requested, pad with empty strings
        while (lines.length < maxLines) {
            lines.push('');
        }
        
        return lines.filter(line => line.trim() !== '');
    }
    
    renderPattern(textLines, fontSize, fontFamily, stitchColor) {
        const fontConfig = this.fontSizes[fontSize];
        this.gridSize = fontConfig.grid;
        
        // Clear canvas
        this.clearCanvas();
        
        // Set up temporary canvas for text rendering
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Configure font
        const fontFamilyMap = {
            'pixel': 'monospace',
            'serif': 'serif',
            'sans-serif': 'Arial, sans-serif',
            'monospace': 'monospace',
            'script': 'cursive'
        };
        
        tempCtx.font = `${fontConfig.size}px ${fontFamilyMap[fontFamily]}`;
        tempCtx.textBaseline = 'top';
        tempCtx.fillStyle = 'black';
        
        // Calculate dimensions
        let maxWidth = 0;
        const lineHeight = fontConfig.size + 2;
        
        textLines.forEach(line => {
            const lineWidth = tempCtx.measureText(line).width;
            maxWidth = Math.max(maxWidth, lineWidth);
        });
        
        const totalHeight = textLines.length * lineHeight;
        
        // Set temp canvas size
        tempCanvas.width = Math.ceil(maxWidth) + 10;
        tempCanvas.height = totalHeight + 10;
        
        // Re-apply font after canvas resize
        tempCtx.font = `${fontConfig.size}px ${fontFamilyMap[fontFamily]}`;
        tempCtx.textBaseline = 'top';
        tempCtx.fillStyle = 'black';
        
        // Render text to temp canvas
        textLines.forEach((line, index) => {
            tempCtx.fillText(line, 5, 5 + (index * lineHeight));
        });
        
        // Get image data and convert to cross stitch pattern
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        this.convertToStitchPattern(imageData, stitchColor);
    }
    
    convertToStitchPattern(imageData, stitchColor) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // Calculate pattern dimensions
        const patternWidth = Math.ceil(width / 2) * this.gridSize;
        const patternHeight = Math.ceil(height / 2) * this.gridSize;
        
        // Resize canvas
        this.canvas.width = patternWidth + 40; // Add padding
        this.canvas.height = patternHeight + 40;
        
        // Clear with white background
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Convert pixels to stitches
        let stitchCount = 0;
        
        for (let y = 0; y < height; y += 2) {
            for (let x = 0; x < width; x += 2) {
                const pixelIndex = (y * width + x) * 4;
                const alpha = data[pixelIndex + 3];
                
                // If pixel is not transparent and not white
                if (alpha > 128) {
                    const red = data[pixelIndex];
                    const green = data[pixelIndex + 1];
                    const blue = data[pixelIndex + 2];
                    const brightness = (red + green + blue) / 3;
                    
                    if (brightness < 200) { // Not too bright (not white)
                        const stitchX = 20 + (x / 2) * this.gridSize;
                        const stitchY = 20 + (y / 2) * this.gridSize;
                        
                        this.drawStitch(stitchX, stitchY, stitchColor);
                        stitchCount++;
                    }
                }
            }
        }
        
        // Draw grid if needed
        if (this.showGrid) {
            this.drawGrid(patternWidth, patternHeight);
        }
        
        // Update stitch count
        this.updateStitchCount(stitchCount, Math.ceil(width / 2), Math.ceil(height / 2));
    }
    
    drawStitch(x, y, color) {
        const size = this.gridSize - 2;
        
        // Draw X stitch
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        // Draw X
        this.ctx.beginPath();
        this.ctx.moveTo(x + 1, y + 1);
        this.ctx.lineTo(x + size - 1, y + size - 1);
        this.ctx.moveTo(x + size - 1, y + 1);
        this.ctx.lineTo(x + 1, y + size - 1);
        this.ctx.stroke();
        
        // Optional: Add a small filled square in the center
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x + size/2 - 1, y + size/2 - 1, 2, 2);
    }
    
    drawGrid(patternWidth, patternHeight) {
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = 20; x <= 20 + patternWidth; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 20);
            this.ctx.lineTo(x, 20 + patternHeight);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 20; y <= 20 + patternHeight; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(20, y);
            this.ctx.lineTo(20 + patternWidth, y);
            this.ctx.stroke();
        }
        
        // Thicker lines every 10 stitches
        this.ctx.strokeStyle = '#aaa';
        this.ctx.lineWidth = 1;
        
        for (let x = 20; x <= 20 + patternWidth; x += this.gridSize * 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 20);
            this.ctx.lineTo(x, 20 + patternHeight);
            this.ctx.stroke();
        }
        
        for (let y = 20; y <= 20 + patternHeight; y += this.gridSize * 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(20, y);
            this.ctx.lineTo(20 + patternWidth, y);
            this.ctx.stroke();
        }
    }
    
    clearCanvas() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.hidePatternInfo();
    }
    
    showPatternInfo() {
        document.getElementById('pattern-info').style.display = 'block';
        document.getElementById('export-controls').style.display = 'flex';
    }
    
    hidePatternInfo() {
        document.getElementById('pattern-info').style.display = 'none';
        document.getElementById('export-controls').style.display = 'none';
    }
    
    updateStitchCount(count, width, height) {
        document.getElementById('pattern-dimensions').textContent = `${width} × ${height} stitches`;
        document.getElementById('stitch-count').textContent = count;
    }
    
    downloadPattern(withGrid) {
        this.showGrid = withGrid;
        this.generatePattern(); // Regenerate with/without grid
        
        // Create download link
        const link = document.createElement('a');
        link.download = `cross-stitch-pattern${withGrid ? '-with-grid' : ''}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
        
        // Reset grid state
        this.showGrid = false;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CrossStitchGenerator();
});