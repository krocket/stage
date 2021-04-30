let delIcon = document.createElement('img');
delIcon.src = "/customizable_t-shirt/static/img/trash_icon.svg";

let rotateIcon = document.createElement('img');
rotateIcon.src = "/customizable_t-shirt/static/img/rotate_icon.svg";

let scaleIcon = document.createElement('img');
scaleIcon.src = "/customizable_t-shirt/static/img/scale_icon.svg";

const ArticleCanvas = {
    canvas: new fabric.Canvas('articleCanvas'),
    printWidth: 250,
    printHeight: 400,
    printTop: 100,
    printLeft: 125,
    cornSize: 15,
    borderColor: 'red',
    offSize: 10,
    clipPath : this.clipPath,
}
let clipPath = new fabric.Rect({
    width: ArticleCanvas.printWidth,
    height: ArticleCanvas.printHeight,
    top: ArticleCanvas.printTop,
    left: ArticleCanvas.printLeft,
    absolutePositioned: true,
    excludeFromExport: true
});
/* ----------------------------CHANGEMENTS SUR FABRIC------------------------------------------*/
fabric.Object.prototype.borderColor = ArticleCanvas.borderColor;
fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -ArticleCanvas.offSize,
    offsetX: ArticleCanvas.offSize,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    actionName: 'delete',
    render: renderIcon(delIcon),
    cornerSize: ArticleCanvas.offSize,
});
fabric.Object.prototype.controls.cmTop = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -5,
    offsetX: 2,
    cursorStyle: '',
    render: renderCMTop(),
});
fabric.Object.prototype.controls.cmLeft = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -5,
    offsetX: -5,
    cursorStyle: '',
    render: renderCMLeft(),
});
fabric.Object.prototype.controls.rotateControl = new fabric.Control({
  x: -0.5,
  y: 0.5,
  offsetY: ArticleCanvas.offSize,
  offsetX: -ArticleCanvas.offSize,
  cursorStyle: 'crosshair',
  actionHandler: fabric.controlsUtils.rotationWithSnapping,
  actionName: 'rotate',
  render: renderIcon(rotateIcon),
  cornerSize: ArticleCanvas.cornSize
});
fabric.Object.prototype.controls.scaleControl = new fabric.Control({
  x: 0.5,
  y: 0.5,
  offsetY: ArticleCanvas.offSize,
  offsetX: ArticleCanvas.offSize,
  cursorStyle: 'pointer',
  actionHandler: fabric.controlsUtils.scalingEqually,
  actionName: 'sclae',
  render: renderIcon(scaleIcon),
  cornerSize: ArticleCanvas.cornSize,
});


/*----------------------------------------------FONCTIONS--------------------------------------*/

function deleteObject() {
    ArticleCanvas.canvas.remove(ArticleCanvas.canvas.getActiveObject());
    ArticleCanvas.canvas.renderAll();
}

function renderCMTop() {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.font = "9px Courier";
        ctx.fillStyle = ArticleCanvas.borderColor;
        ctx.fillText(widthCm() + ' cm', 0, 0);
        ctx.restore();
    }
}

function renderCMLeft() {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle - 90));
        ctx.font = "9px Courier";
        ctx.fillStyle = ArticleCanvas.borderColor;
        ctx.fillText(heightCm() + ' cm', -40, 0);
        ctx.restore();
    }
}

function widthCm() {
    let actObj = ArticleCanvas.canvas.getActiveObject();
    let w = actObj.getScaledWidth();
    let width_cm = w/10 / (ArticleCanvas.printWidth / w);
    let wcm = Math.round(width_cm * 10) / 10;
    return wcm;
}

function heightCm() {
    let actObj = ArticleCanvas.canvas.getActiveObject();
    let h = actObj.getScaledHeight();
    let height_cm = h/10 / (ArticleCanvas.printHeight / h);
    let hcm = Math.round(height_cm * 10) / 10;
    return hcm;
}

function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        let size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}