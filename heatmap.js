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
        const color = new obelisk.CubeColor().getByHorizontalHue(120 - item.value * 10);
        const cube = new obelisk.Cube(dimension, color);
        const p3d = new obelisk.Point3D(item.week * 17, item.day * 17, 0);
        pixelView.renderObject(cube, p3d);
      });
    });
};
