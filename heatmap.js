// Wait for the page to fully load
window.onload = () => {
  // Load your activity data from JSON file
  fetch('heatmap_data.json')
    .then(res => res.json())
    .then(data => {
      // Select the canvas element and define the viewing angle
      const canvas = document.getElementById('canvas');

      // Create an isometric camera perspective
      const point = new obelisk.Point(600, 150);

      // Set up the 3D pixel rendering engine
      const pixelView = new obelisk.PixelView(canvas, point);

      // Define cube base size and spacing
      const cubeSize = 12;
      const spacing = 3;

      // Loop through each activity data point
      data.forEach(item => {
        const value = item.value;
        if (value === 0) return;

        // Cube height and clamped max height
        const h = value * 3;
        const height = Math.min(h, 60);

        // Green shade based on activity
        const green = Math.max(0x003300, 0x00ff00 - value * 500);
        const dimension = new obelisk.CubeDimension(cubeSize, cubeSize, height);
        const color = new obelisk.CubeColor().getByHorizontalColor(green);
        const cube = new obelisk.Cube(dimension, color);

        // Position based on week and weekday
        const x = item.week * (cubeSize + spacing);
        const y = item.day * (cubeSize + spacing);
        const p3d = new obelisk.Point3D(x, y, 0);

        // Render the cube
        pixelView.renderObject(cube, p3d);
      });

      // === ADD LABELS (HTML Overlay) ===

      // Get the container for labels
      const labelContainer = document.getElementById('labels');
      labelContainer.style.position = 'absolute';
      labelContainer.style.top = '0';
      labelContainer.style.left = '0';

      // Add weekday labels (Mon–Sun)
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

      // Add week number labels (every 4 weeks)
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
