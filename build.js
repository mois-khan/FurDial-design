const fs = require('fs');

try {
    let html = fs.readFileSync('index.html', 'utf8');

    function processSvg(filename) {
        let svg = fs.readFileSync(filename, 'utf8');
        // Replace fills and strokes, but keep "none" and "white" if necessary?
        // Let's replace any specific hex color so that it can be controlled by currentColor
        svg = svg.replace(/fill="#[A-Fa-f0-9]{3,6}"/gi, 'fill="currentColor"');
        svg = svg.replace(/stroke="#[A-Fa-f0-9]{3,6}"/gi, 'stroke="currentColor"');
        
        // Also strip width and height from the root <svg> tag so it scales
        svg = svg.replace(/<svg([^>]*)width="[^"]*"([^>]*)>/i, '<svg$1$2>');
        svg = svg.replace(/<svg([^>]*)height="[^"]*"([^>]*)>/i, '<svg$1$2>');
        
        // Make sure it has 100% width/height so it fills our canvas wrapper correctly
        svg = svg.replace(/<svg/i, '<svg style="width:100%; height:100%; object-fit:contain;"');
        
        return svg;
    }

    const iconSvg = processSvg('furdial_icononly_navy.svg');
    const horzSvg = processSvg('furdial_horizontal_navy.svg');
    const fullSvg = processSvg('furdial_full_navy-icon.svg');

    // Replace Placeholder 1
    const p1Regex = /(<!-- Placeholder 1: Icon Only -->\s*<div class="svg-icon active" id="svg-icon">)[\s\S]*?(<\/div>\s*<!-- Placeholder 2: Horizontal -->)/;
    html = html.replace(p1Regex, `$1\n${iconSvg}\n$2`);

    // Replace Placeholder 2
    const p2Regex = /(<!-- Placeholder 2: Horizontal -->\s*<div class="svg-horizontal" id="svg-horizontal">)[\s\S]*?(<\/div>\s*<!-- Placeholder 3: Full Logo -->)/;
    html = html.replace(p2Regex, `$1\n${horzSvg}\n$2`);

    // Replace Placeholder 3
    const p3Regex = /(<!-- Placeholder 3: Full Logo -->\s*<div class="svg-full" id="svg-full">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/;
    html = html.replace(p3Regex, `$1\n${fullSvg}\n$2`);

    fs.writeFileSync('index.html', html);
    console.log('Successfully embedded SVGs into index.html');
} catch (error) {
    console.error('Error:', error);
}
