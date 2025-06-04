// Wait for the page to fully load
window.onload = () => {
  // Load your activity data from JSON file
  fetch('heatmap_data.json')
    .then(res => res.json())
    .then(data => {
      // Select the canvas element and define the viewing angle
      const canvas = document.getElementById('canvas');

      // Create an isometric camera perspective
      // Higher X → rotate left/right, higher Y → look from above
      const point = new obelisk.Point(600, 150);

      // Set up the 3D pixel rendering engine
      const pixelView = new obelisk.PixelView(canvas, point);

      // Define cube base size and spacing
      const cubeSize = 12;       // Width and depth of each cube
      const spacing = 3;         // Padding between cubes

      // Loop through each activity data point
      data.forEach(item => {
        const value = item.value;      // Activity intensity
        if (value === 0) return;       // Skip blank days (no cube)

        // Determine height of cube (scale by value)
        const h = value * 3;
        const height = Math.min(h, 60);  // Optional: limit height for readability

        // Color logic: shade of green (less activity = lighter green)
        const green = Math.max(0x003300, 0x00ff00 - value * 500);

        // Define cube size and height
        const dimension = new obelisk.CubeDimension(cubeSize, cubeSize, height);

        // Define cube color using horizontal shading
        const color = new obelisk.CubeColor().getByHorizontalColor(green);

        // Create the cube
        const cube = new obelisk.Cube(dimension, color);

        // Position the cube on a 3D grid:
        //  - X axis = weeks (left to right)
        //  - Y axis = day of week (top to bottom)
        const x = item.week * (cubeSize + spacing);
        const y = item.day * (cubeSize + spacing);
        const p3d = new obelisk.Point3D(x, y, 0);  // (X, Y, Z=0)

        // Draw the cube at the computed location
        pixelView.renderObject(cube, p3d);
      });
    });
};
