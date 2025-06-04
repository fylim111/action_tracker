window.onload = () => {
  fetch('heatmap_data.json')
    .then(res => res.json())
    .then(data => {
      const canvas = document.getElementById('canvas');
      const point = new obelisk.Point(400, 30);
      const pixelView = new obelisk.PixelView(canvas, point);

      data.forEach(item => {
        const h = item.value * 5;
        if (h === 0) return;

        const dimension = new obelisk.CubeDimension(16, 16, h);

        // Compute color based on activity intensity (value)
        const value = item.value;
        let colorValue = 0x00ff00 - (value * 1000);  // adjust green brightness
        if (colorValue < 0x003300) colorValue = 0x003300; // prevent going too dark

        const color = new obelisk.CubeColor().getByHorizontalColor(colorValue);
        const cube = new obelisk.Cube(dimension, color);
        const p3d = new obelisk.Point3D(item.week * 17, item.day * 17, 0);

        pixelView.renderObject(cube, p3d);
      });
    });
};
