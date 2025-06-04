// Wait for the page to fully load
window.onload = () => {
  fetch('heatmap_data.json')
    .then(res => res.json())
    .then(data => {
      const canvas = document.getElementById('canvas');
      const point = new obelisk.Point(600, 150);
      const pixelView = new obelisk.PixelView(canvas, point);

      const cubeSize = 12;
      const spacing = 3;

      // Create shared base tile: height = 1, color = light grey
      const baseDimension = new obelisk.CubeDimension(cubeSize, cubeSize, 1);
      const baseColor = new obelisk.CubeColor().getByHorizontalColor(0x444444);

      data.forEach(item => {
        const value = item.value;

        // Compute position
        const x = item.week * (cubeSize + spacing);
        const y = item.day * (cubeSize + spacing);
        const basePos = new obelisk.Point3D(x, y, 0);

        // Always draw the grey floor tile
        const baseCube = new obelisk.Cube(baseDimension, baseColor, false);
        pixelView.renderObject(baseCube, basePos);

        // Only draw activity cube if value > 0
        if (value > 0) {
          const h = value * 3;
          const height = Math.min(h, 60);
          const green = Math.max(0x003300, 0x00ff00 - value * 500);

          const dimension = new obelisk.CubeDimension(cubeSize, cubeSize, height);
          const color = new obelisk.CubeColor().getByHorizontalColor(green);
          const cube = new obelisk.Cube(dimension, color);

          // Draw the activity cube on top of the base tile
          pixelView.renderObject(cube, basePos);
        }
      });

      // === OPTIONAL: Overlay labels (same as before, keep if working) ===
      const labelContainer = document.getElementById('labels');
      labelContainer.style.position = 'absolute';
      labelContainer.style.top = '0';
      labelContainer.style.left = '0';

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      days.forEach((day, i) => {
        const label = document.createElement('div');
        label.textContent = day;
        label.style.position = 'absolute';
        label.style.top = `${i * (cubeSize + spacing) + 80}px`;
        label.style.left = `5px`;
        label.style.fontSize = '11px';
        label.style.color = '#ccc';
        label.style.fontFamily = 'monospace';
        labelContainer.appendChild(label);
      });

      for (let w = 0; w <= 52; w += 4) {
        const label = document.createElement('div');
        label.textContent = `W${w}`;
        label.style.position = 'absolute';
        label.style.top = `5px`;
        label.style.left = `${w * (cubeSize + spacing) + 40}px`;
        label.style.fontSize = '11px';
        label.style.color = '#ccc';
        label.style.fontFamily = 'monospace';
        labelContainer.appendChild(label);
      }
    });
};
