class CrossStitchGenerator {
    constructor() {
        this.canvas = document.getElementById('pattern-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 10; // Base grid size
        this.showGrid = false;
        this.zoomLevel = 1; // Zoom level for viewing
        this.currentPattern = null; // Store current pattern data
        
        // Font size mappings
        this.fontSizes = {
            'small': { size: 8, grid: 8 },
            'medium': { size: 12, grid: 10 },
            'large': { size: 16, grid: 12 },
            'extra-large': { size: 20, grid: 14 }
        };
        
        // Line spacing mappings
        this.lineSpacing = {
            'tight': 0.8,
            'normal': 1.2,
            'loose': 1.5,
            'extra-loose': 2.0
        };
        
        // Fabric color mappings
        this.fabricColors = {
            'white': '#ffffff',
            'cream': '#fdf6e3',
            'light-gray': '#f5f5f5',
            'beige': '#f5f5dc',
            'light-blue': '#f0f8ff',
            'light-pink': '#fff0f5'
        };
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        const form = document.getElementById('pattern-form');
        const downloadPattern = document.getElementById('download-pattern');
        const downloadGrid = document.getElementById('download-grid');
        const downloadPdf = document.getElementById('download-pdf');
        
        // Zoom controls
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        const zoomReset = document.getElementById('zoom-reset');
        
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
        
        downloadPdf.addEventListener('click', () => {
            this.downloadPatternPDF();
        });
        
        // Zoom event listeners
        zoomIn.addEventListener('click', () => {
            this.adjustZoom(0.2);
        });
        
        zoomOut.addEventListener('click', () => {
            this.adjustZoom(-0.2);
        });
        
        zoomReset.addEventListener('click', () => {
            this.resetZoom();
        });
        
        // Remove real-time updates - pattern only generates when button is clicked
        // All pattern generation is now controlled by the form submit button
    }
    
    generatePattern() {
        const text = document.getElementById('text-input').value.trim();
        const maxLines = parseInt(document.getElementById('max-lines').value);
        const lineSpacing = document.getElementById('line-spacing').value;
        const fontSize = document.getElementById('font-size').value;
        const fontFamily = document.getElementById('font-family').value;
        const stitchColor = document.getElementById('stitch-color').value;
        const fabricColor = document.getElementById('fabric-color').value;
        const showGrid = document.getElementById('show-grid').checked;
        
        if (!text) {
            this.clearCanvas();
            return;
        }
        
        const textLines = this.prepareTextLines(text, maxLines);
        this.renderPattern(textLines, fontSize, fontFamily, stitchColor, lineSpacing, fabricColor, showGrid);
        this.showPatternInfo();
    }
    
    prepareTextLines(text, maxLines) {
        // Split text into lines by newline characters
        let lines = text.split('\n');
        
        // Remove any leading/trailing whitespace from each line
        lines = lines.map(line => line.trim());
        
        // If we have more lines than requested, take the first ones
        if (lines.length > maxLines) {
            lines = lines.slice(0, maxLines);
        }
        
        // Filter out completely empty lines
        lines = lines.filter(line => line.length > 0);
        
        return lines;
    }
    
    renderPattern(textLines, fontSize, fontFamily, stitchColor, lineSpacing, fabricColor, showGrid) {
        const fontConfig = this.fontSizes[fontSize];
        const spacingMultiplier = this.lineSpacing[lineSpacing];
        this.gridSize = fontConfig.grid;
        
        // Clear canvas
        this.clearCanvas();
        
        // Set up temporary canvas for text rendering
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Configure font - updated font family mapping
        const fontFamilyMap = {
            'press-start': '"Press Start 2P", monospace',
            'orbitron': '"Orbitron", sans-serif',
            'fredoka': '"Fredoka", sans-serif',
            'bungee': '"Bungee", sans-serif',
            'righteous': '"Righteous", sans-serif',
            'bangers': '"Bangers", sans-serif',
            'serif': 'serif',
            'sans-serif': 'Arial, sans-serif',
            'monospace': 'monospace',
            'creepster': '"Creepster", cursive',
            'nosifer': '"Nosifer", cursive'
        };
        
        tempCtx.font = `${fontConfig.size}px ${fontFamilyMap[fontFamily]}`;
        tempCtx.textBaseline = 'top';
        tempCtx.fillStyle = 'black';
        
        // Calculate dimensions with line spacing
        let maxWidth = 0;
        const lineHeight = Math.round(fontConfig.size * spacingMultiplier);
        
        textLines.forEach(line => {
            const lineWidth = tempCtx.measureText(line).width;
            maxWidth = Math.max(maxWidth, lineWidth);
        });
        
        const totalHeight = textLines.length * lineHeight;
        
        // Set temp canvas size
        tempCanvas.width = Math.ceil(maxWidth) + 20;
        tempCanvas.height = totalHeight + 20;
        
        // Re-apply font after canvas resize
        tempCtx.font = `${fontConfig.size}px ${fontFamilyMap[fontFamily]}`;
        tempCtx.textBaseline = 'top';
        tempCtx.fillStyle = 'black';
        
        // Render text to temp canvas with centering
        textLines.forEach((line, index) => {
            const lineWidth = tempCtx.measureText(line).width;
            const x = (tempCanvas.width - lineWidth) / 2; // Center the text
            const y = 10 + (index * lineHeight);
            tempCtx.fillText(line, x, y);
        });
        
        // Get image data and convert to cross stitch pattern
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        this.convertToStitchPattern(imageData, stitchColor, fabricColor, showGrid);
    }
    
    convertToStitchPattern(imageData, stitchColor, fabricColor, showGrid) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // Calculate pattern dimensions - improved scaling
        const scaleFactor = Math.max(1, Math.round(this.gridSize / 8)); // Better scaling based on grid size
        const patternWidth = Math.ceil(width / scaleFactor) * this.gridSize;
        const patternHeight = Math.ceil(height / scaleFactor) * this.gridSize;
        
        // Resize canvas with adequate padding
        this.canvas.width = patternWidth + 60;
        this.canvas.height = patternHeight + 60;
        
        // Clear with fabric color background
        const bgColor = this.fabricColors[fabricColor] || '#ffffff';
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Convert pixels to stitches with better algorithm
        let stitchCount = 0;
        const threshold = 180; // Adjustable brightness threshold
        
        for (let y = 0; y < height; y += scaleFactor) {
            for (let x = 0; x < width; x += scaleFactor) {
                // Sample multiple pixels for better quality
                let totalAlpha = 0;
                let totalBrightness = 0;
                let samples = 0;
                
                // Sample area instead of single pixel
                for (let sy = 0; sy < scaleFactor && y + sy < height; sy++) {
                    for (let sx = 0; sx < scaleFactor && x + sx < width; sx++) {
                        const pixelIndex = ((y + sy) * width + (x + sx)) * 4;
                        const alpha = data[pixelIndex + 3];
                        
                        if (alpha > 50) { // Only consider visible pixels
                            const red = data[pixelIndex];
                            const green = data[pixelIndex + 1];
                            const blue = data[pixelIndex + 2];
                            const brightness = (red + green + blue) / 3;
                            
                            totalAlpha += alpha;
                            totalBrightness += brightness;
                            samples++;
                        }
                    }
                }
                
                // Create stitch if area has enough dark content
                if (samples > 0) {
                    const avgAlpha = totalAlpha / samples;
                    const avgBrightness = totalBrightness / samples;
                    
                    if (avgAlpha > 128 && avgBrightness < threshold) {
                        const stitchX = 30 + (x / scaleFactor) * this.gridSize;
                        const stitchY = 30 + (y / scaleFactor) * this.gridSize;
                        
                        this.drawStitch(stitchX, stitchY, stitchColor);
                        stitchCount++;
                    }
                }
            }
        }
        
        // Draw grid if needed
        if (showGrid) {
            this.drawGrid(patternWidth, patternHeight, fabricColor);
        }
        
        // Update stitch count with better calculations
        const gridWidth = Math.ceil(width / scaleFactor);
        const gridHeight = Math.ceil(height / scaleFactor);
        this.updateStitchCount(stitchCount, gridWidth, gridHeight);
    }
    
    drawStitch(x, y, color) {
        const size = this.gridSize - 1;
        
        // Draw X stitch with better styling
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = Math.max(1.5, this.gridSize / 6);
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Add slight shadow for depth
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 1;
        this.ctx.shadowOffsetX = 0.5;
        this.ctx.shadowOffsetY = 0.5;
        
        // Draw the cross stitch X
        this.ctx.beginPath();
        // First diagonal: top-left to bottom-right
        this.ctx.moveTo(x + 1, y + 1);
        this.ctx.lineTo(x + size - 1, y + size - 1);
        // Second diagonal: top-right to bottom-left
        this.ctx.moveTo(x + size - 1, y + 1);
        this.ctx.lineTo(x + 1, y + size - 1);
        this.ctx.stroke();
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // Add a subtle center dot for larger stitches
        if (this.gridSize > 10) {
            this.ctx.fillStyle = color;
            const centerSize = Math.max(1, this.gridSize / 8);
            this.ctx.fillRect(
                x + size/2 - centerSize/2, 
                y + size/2 - centerSize/2, 
                centerSize, 
                centerSize
            );
        }
    }
    
    drawGrid(patternWidth, patternHeight, fabricColor) {
        // Base grid lines (light)
        this.ctx.strokeStyle = '#e8e8e8';
        this.ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = 30; x <= 30 + patternWidth; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 30);
            this.ctx.lineTo(x, 30 + patternHeight);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 30; y <= 30 + patternHeight; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(30, y);
            this.ctx.lineTo(30 + patternWidth, y);
            this.ctx.stroke();
        }
        
        // Thicker lines every 10 stitches (medium)
        this.ctx.strokeStyle = '#c0c0c0';
        this.ctx.lineWidth = 1;
        
        for (let x = 30; x <= 30 + patternWidth; x += this.gridSize * 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 30);
            this.ctx.lineTo(x, 30 + patternHeight);
            this.ctx.stroke();
        }
        
        for (let y = 30; y <= 30 + patternHeight; y += this.gridSize * 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(30, y);
            this.ctx.lineTo(30 + patternWidth, y);
            this.ctx.stroke();
        }
        
        // Extra thick lines every 50 stitches for major sections
        this.ctx.strokeStyle = '#888888';
        this.ctx.lineWidth = 2;
        
        for (let x = 30; x <= 30 + patternWidth; x += this.gridSize * 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 30);
            this.ctx.lineTo(x, 30 + patternHeight);
            this.ctx.stroke();
        }
        
        for (let y = 30; y <= 30 + patternHeight; y += this.gridSize * 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(30, y);
            this.ctx.lineTo(30 + patternWidth, y);
            this.ctx.stroke();
        }
        
        // Add fabric texture background
        this.drawFabricTexture(patternWidth, patternHeight, fabricColor);
    }
    
    drawFabricTexture(patternWidth, patternHeight, fabricColor) {
        // Add subtle fabric texture to simulate Aida cloth
        const originalGlobalAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = 0.03;
        
        // Choose texture color based on fabric color
        const bgColor = this.fabricColors[fabricColor] || '#ffffff';
        const textureColor = this.darkenColor(bgColor, 0.1);
        
        // Create a subtle weave pattern
        this.ctx.fillStyle = textureColor;
        for (let x = 30; x < 30 + patternWidth; x += 2) {
            for (let y = 30; y < 30 + patternHeight; y += 2) {
                if ((x + y) % 4 === 0) {
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
        
        this.ctx.globalAlpha = originalGlobalAlpha;
    }
    
    darkenColor(color, amount) {
        // Simple function to darken a hex color
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
        const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
        const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
        return `rgb(${r}, ${g}, ${b})`;
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
        
        // Calculate estimated time (assuming 200 stitches per hour for beginners)
        const hoursEstimate = Math.ceil(count / 200);
        let timeText = '';
        if (hoursEstimate < 1) {
            timeText = 'Less than 1 hour';
        } else if (hoursEstimate === 1) {
            timeText = '1 hour';
        } else {
            timeText = `${hoursEstimate} hours`;
        }
        document.getElementById('estimated-time').textContent = timeText;
        
        // Recommend fabric size (add 3 inches on each side)
        const fabricWidth = Math.ceil((width * 14 + 84) / 25.4); // Convert to cm, 14 count Aida
        const fabricHeight = Math.ceil((height * 14 + 84) / 25.4);
        document.getElementById('fabric-recommendation').textContent = 
            `${fabricWidth}cm × ${fabricHeight}cm (14-count Aida)`;
        
        // Estimate floss needed (1 skein per 1000 stitches is conservative)
        const skeinsNeeded = Math.max(1, Math.ceil(count / 1000));
        document.getElementById('floss-needed').textContent = 
            `${skeinsNeeded} skein${skeinsNeeded > 1 ? 's' : ''} of embroidery floss`;
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
    
    downloadPatternPDF() {
        // Create PDF with pattern and instructions
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Add title
        pdf.setFontSize(20);
        pdf.text('Cross Stitch Pattern', 20, 20);
        
        // Add pattern details
        pdf.setFontSize(12);
        const text = document.getElementById('text-input').value;
        const dimensions = document.getElementById('pattern-dimensions').textContent;
        const stitchCount = document.getElementById('stitch-count').textContent;
        const fontFamily = document.getElementById('font-family').selectedOptions[0].text;
        const fontSize = document.getElementById('font-size').selectedOptions[0].text;
        const stitchColor = document.getElementById('stitch-color').value;
        
        pdf.text(`Text: "${text}"`, 20, 35);
        pdf.text(`Dimensions: ${dimensions}`, 20, 45);
        pdf.text(`Total Stitches: ${stitchCount}`, 20, 55);
        pdf.text(`Font: ${fontFamily} - ${fontSize}`, 20, 65);
        pdf.text(`Stitch Color: ${stitchColor}`, 20, 75);
        
        // Add pattern image
        const imgData = this.canvas.toDataURL('image/png');
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        // Calculate dimensions to fit on page
        const maxWidth = 170; // mm
        const maxHeight = 200; // mm
        const ratio = Math.min(maxWidth / canvasWidth, maxHeight / canvasHeight);
        const imgWidth = canvasWidth * ratio * 0.264583; // Convert px to mm
        const imgHeight = canvasHeight * ratio * 0.264583;
        
        pdf.addImage(imgData, 'PNG', 20, 85, imgWidth, imgHeight);
        
        // Add instructions on a new page
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('Cross Stitch Instructions', 20, 20);
        
        pdf.setFontSize(10);
        const instructions = [
            '1. Use the specified stitch color for all stitches.',
            '2. Each X on the pattern represents one cross stitch.',
            '3. Work from the center outward for best results.',
            '4. Use 2 strands of embroidery floss for standard coverage.',
            '5. Complete all cross stitches before adding any back stitching.',
            '6. Press finished work face down on a clean towel.'
        ];
        
        instructions.forEach((instruction, index) => {
            pdf.text(instruction, 20, 40 + (index * 8));
        });
        
        // Save the PDF
        pdf.save('cross-stitch-pattern.pdf');
    }
    
    adjustZoom(delta) {
        this.zoomLevel = Math.max(0.2, Math.min(3.0, this.zoomLevel + delta));
        this.updateZoomDisplay();
        this.applyZoom();
    }
    
    resetZoom() {
        this.zoomLevel = 1;
        this.updateZoomDisplay();
        this.applyZoom();
    }
    
    updateZoomDisplay() {
        document.getElementById('zoom-level').textContent = Math.round(this.zoomLevel * 100) + '%';
    }
    
    applyZoom() {
        this.canvas.style.transform = `scale(${this.zoomLevel})`;
        this.canvas.style.transformOrigin = 'top left';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CrossStitchGenerator();
});