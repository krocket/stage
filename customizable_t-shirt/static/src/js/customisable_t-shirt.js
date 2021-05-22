odoo.define('customisable_t-shirt.customisable_t-shirt', (require) => {
    'use strict';

    const core = require('web.core');
    const config = require('web.config');
    const publicWidget = require('web.public.widget');
    require("web.zoomodoo");


    publicWidget.registry.CustomisableTShirt = publicWidget.Widget.extend({
        selector: '.oe_customisable_t-shirt',
        events: {
            'change select[id="select-font-text"]': '_onChangeFontText',
            'change input[id="oe_image_loader"]': '_onLoadFile',
            'click #btn-text': '_onClickBtnText',
            'click #btn-bold': '_onClickBtnBold',
            'click #btn-italic': '_onClickBtnItalic',
            'click #btn-colour': '_onClickBtnColour',
            'click input[id="btn-save"]': '_onClickBtnSave',
            'click #gestalt2': '_SwapMode',
            'click .gstbtn1': '_SwapMode',
            'click #right_designer_arrow': '_onClickRightDesignerArrow',
            'click #left_designer_arrow': '_onClickLeftDesignerArrow',
            'click #right_arrow': '_onClickRightArrow',
            'click #left_arrow': '_onClickLeftArrow',
            'keyup #textarea': '_onKeyupTextArea',
        },

        _onKeyupTextArea: function () {
            let activeObject = this.canvas[this.canvas_index].getActiveObject();
            activeObject.text = $(`#textarea`).val();
            console.log($('#textarea').val());
            this.canvas[this.canvas_index].renderAll();
        },

        init_fabric_object: function () {
            fabric.Object.prototype.controls.mtr.visible = false;
            fabric.Object.prototype.controls.mr.visible = false;
            fabric.Object.prototype.controls.ml.visible = false;
            fabric.Object.prototype.controls.mt.visible = false;
            fabric.Object.prototype.controls.tl.visible = false;
            fabric.Object.prototype.controls.tr.visible = false;
            fabric.Object.prototype.controls.bl.visible = false;
            fabric.Object.prototype.controls.br.visible = false;
            fabric.Object.prototype.controls.mb.visible = false;
        },

        init: function () {
            this._super.apply(this, arguments);
            this.init_fabric_object();
            this.designerActive = false;
            this.canvas = [];
            this.clipPath = [];
            let length = document.getElementById("creator_images_length").value;
            for (let i = 0; i < length; i++) {
                this.canvas.push(new fabric.Canvas("articleCanvas_" + i));
                this.canvas[i].has_canvas = false;
            }
            this.delIcon = document.createElement('img');
            this.delIcon.src = "/customizable_t-shirt/static/img/trash_icon.svg";

            let rotateIcon = document.createElement('img');
            rotateIcon.src = "/customizable_t-shirt/static/img/rotate_icon.svg";

            let scaleIcon = document.createElement('img');
            scaleIcon.src = "/customizable_t-shirt/static/img/scale_icon.svg";
            this.cornSize = 15;
            this.borderColor = 'red';
            this.offSize = 10;
            this.canvas_index = 0;
            fabric.Object.prototype.borderColor = this.borderColor;
            fabric.Object.prototype.controls.deleteControl = new fabric.Control({
                x: 0.5,
                y: -0.5,
                offsetY: -this.offSize,
                offsetX: this.offSize,
                cursorStyle: 'pointer',
                mouseUpHandler: this.deleteObject,
                actionName: 'delete',
                render: this.renderIcon(this.delIcon),
                cornerSize: this.offSize,
            });
            fabric.Object.prototype.controls.cmTop = new fabric.Control({
                x: -0.5,
                y: -0.5,
                offsetY: -5,
                offsetX: 2,
                cursorStyle: '',
                render: this.renderCMTop(),
            });
            fabric.Object.prototype.controls.cmLeft = new fabric.Control({
                x: -0.5,
                y: -0.5,
                offsetY: -5,
                offsetX: -5,
                cursorStyle: '',
                render: this.renderCMLeft(),
            });
            fabric.Object.prototype.controls.rotateControl = new fabric.Control({
                x: -0.5,
                y: 0.5,
                offsetY: this.offSize,
                offsetX: -this.offSize,
                cursorStyle: 'crosshair',
                actionHandler: fabric.controlsUtils.rotationWithSnapping,
                actionName: 'rotate',
                render: this.renderIcon(rotateIcon),
                cornerSize: this.cornSize
            });
            fabric.Object.prototype.controls.scaleControl = new fabric.Control({
                x: 0.5,
                y: 0.5,
                offsetY: this.offSize,
                offsetX: this.offSize,
                cursorStyle: 'pointer',
                actionHandler: fabric.controlsUtils.scalingEqually,
                actionName: 'sclae',
                render: this.renderIcon(scaleIcon),
                cornerSize: this.cornSize,
            });
        }
        ,

        deleteObject: function (eventData, transform) {
            let target = transform.target;
            let canvas = target.canvas;
            canvas.remove(target);
            canvas.requestRenderAll();
        }
        ,

        renderCMTop: function () {
            let self = this;
            return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
                ctx.save();
                ctx.translate(left, top);
                ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
                ctx.font = "9px Courier";
                ctx.fillStyle = self.borderColor;
                ctx.fillText(self.widthCm(self.canvas, self.canvas_index, self.printWidth) + ' cm', 0, 0);
                ctx.restore();
            }
        }
        ,

        renderCMLeft: function () {
            let self = this;
            return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
                ctx.save();
                ctx.translate(left, top);
                ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle - 90));
                ctx.font = "9px Courier";
                ctx.fillStyle = self.borderColor;
                ctx.fillText(self.heightCm(self.canvas, self.canvas_index, self.printHeight) + ' cm', -40, 0);
                ctx.restore();
            }
        }
        ,

        widthCm(canvas, canvas_index, printWidth) {
            let actObj = canvas[canvas_index].getActiveObject();
            let w = actObj.getScaledWidth();
            let width_cm = w / 10 / (printWidth / w);
            let wcm = Math.round(width_cm * 10) / 10;
            return wcm;
        }
        ,

        heightCm(canvas, canvas_index, printHeight) {
            let actObj = canvas[canvas_index].getActiveObject();
            let h = actObj.getScaledHeight();
            let height_cm = h / 10 / (printHeight / h);
            let hcm = Math.round(height_cm * 10) / 10;
            return hcm;
        }
        ,

        renderIcon(icon) {
            return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
                let size = this.cornerSize;
                ctx.save();
                ctx.translate(left, top);
                ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
                ctx.drawImage(icon, -size / 2, -size / 2, size, size);
                ctx.restore();
            }
        }
        ,

        _setPosition: function (printTop, printLeft) {
            this.printTop = printTop;
            this.printLeft = printLeft;
        }
        ,

        _drawEditableCanvas(printWidth, printHeight) {
            this.canvas[this.canvas_index].has_canvas = true;
            this.clipPath[this.canvas_index] = new fabric.Rect({
                width: printWidth,
                height: printHeight,
                top: this.printTop,
                left: this.printLeft,
                absolutePositioned: true,
            });
            let printArea = new fabric.Rect({
                width: printWidth,
                height: printHeight,
                top: this.printTop,
                left: this.printLeft,
                fill: null,
                stroke: this.borderColor,
                selectable: false,
                strokeDashArray: [5, 5],
                strokeWidth: 1,
                name: 'printArea',
            });

            this.canvas[this.canvas_index].add(printArea);
            let w = printArea.getScaledWidth();
            let width_cm = w / 10 / (printWidth / w);
            let wcm = Math.round(width_cm * 10) / 10;
            let h = printArea.getScaledHeight();
            let height_cm = h / 10 / (printHeight / h);
            let hcm = Math.round(height_cm * 10) / 10;
            let tx = wcm + "x" + hcm + "cm Printable Area";

            let txt = new fabric.Text(tx, {
                fontFamily: 'courier',
                fontSize: 10,
                textAlign: 'left',
                left: this.printLeft,
                top: this.printTop - 14,
                fill: this.borderColor,
                name: '35cm'
            });
            txt.setCoords();
            this.canvas[this.canvas_index].add(txt);
        }
        ,

        start() {
            const def = this._super(...arguments);
            this.$('select[id="tshirt-design"]').change();
            this.$('select[id="select-font-text"]').change();
            this.$('input[id="oe_image_loader"]').change();
            return def;
        }
        ,

        _onClickBtnSave: async function () {
            let length = document.getElementById("creator_images_length").value;
            $('.oe_prod').css({display: 'none'});
            $('.oe_design_img').css({display: 'flex'});
            let old_index = parseInt(document.getElementById("product_images_index").value);
            $('#img_container_' + old_index).css({display: 'none'});
            for (let i = 0; i < length; i++) {
                let img_container = document.getElementById('img_container_' + i);
                img_container.style.display = 'flex';
                await domtoimage.toPng(img_container).then(function (dataURL) {
                    document.getElementById("img_to_send_" + i).value = dataURL;
                }).catch(function (e) {
                    console.error('error', e);
                });
                img_container.style.display = 'none';
            }
            document.getElementById("btn-save").type = "submit";
            document.getElementById("btn-save").click();
        }
        ,

        _onClickLeftArrow: function () {
            let length = document.getElementById("product_images_length").value;
            let old_index = parseInt(document.getElementById("product_images_index").value);
            let new_index = old_index - 1;
            for (let i = 0; i < length; i++) {
                if (new_index < 0) new_index = length - 1;
                if (i === old_index) document.getElementById("product_image_" + i).style.display = 'none';
                else if (i === new_index) document.getElementById("product_image_" + i).style.display = 'block';
            }
            document.getElementById("product_images_index").value = new_index;
        }
        ,

        _onClickRightArrow: function () {
            let length = document.getElementById("product_images_length").value;
            let old_index = parseInt(document.getElementById("product_images_index").value);
            let new_index = old_index + 1;
            for (let i = 0; i < length; i++) {
                if (new_index >= length) new_index = 0;
                if (i === old_index) document.getElementById("product_image_" + i).style.display = 'none';
                else if (i === new_index) document.getElementById("product_image_" + i).style.display = 'block';
            }
            document.getElementById("product_images_index").value = new_index;
        }
        ,

        _changeImage: async function (old_index, new_index, i) {
            if (i === old_index) {
                document.getElementById("img_container_" + i).style.display = 'none';
            } else if (i === new_index) {
                document.getElementById("img_container_" + this.canvas_index).style.display = 'none';
                this.canvas_index = i;
                document.getElementById("img_container_" + i).style.display = 'flex';
                let values = await this._rpc({
                    route: "/creator/get_values/" + $('#crea_img_' + i).val(),
                });
                this._setPosition(values.print_top, values.print_left)
                this.printWidth = values.print_width;
                this.printHeight = values.print_height;
                if (!this.canvas[this.canvas_index].has_canvas) {
                    this._drawEditableCanvas(this.printWidth, this.printHeight);
                }
            }
        }
        ,

        _onClickLeftDesignerArrow: async function () {
            let length = document.getElementById("creator_images_length").value;
            let old_index = parseInt(document.getElementById("creator_images_index").value);
            let new_index = old_index - 1;
            for (let i = 0; i < length; i++) {
                if (new_index < 0) new_index = length - 1;
                await this._changeImage(old_index, new_index, i);
            }
            document.getElementById("creator_images_index").value = new_index;
        }
        ,

        _onClickRightDesignerArrow: async function () {
            let length = document.getElementById("creator_images_length").value;
            let old_index = parseInt(document.getElementById("creator_images_index").value);
            let new_index = old_index + 1;
            for (let i = 0; i < length; i++) {
                if (new_index >= length) new_index = 0;
                await this._changeImage(old_index, new_index, i);
            }
            document.getElementById("creator_images_index").value = new_index;
        }
        ,

        _SwapMode: async function () {
            if (!this.designerActive) {
                $('.oe_prod').css({display: 'none'});
                $('.oe_design_img').css({display: 'flex'});
                $('#oe_prod_info').css({display: 'none'});
                $('#oe_design_info').css({display: 'flex'});
                this.canvas_index = 0;
                document.getElementById("img_container_0").style.display = 'flex';
                let values = await this._rpc({
                    route: "/creator/get_values/" + $('#crea_img_0').val(),
                });
                this._setPosition(values.print_top, values.print_left)
                this.printWidth = values.print_width;
                this.printHeight = values.print_height;
                if (!this.canvas[0].has_canvas) {
                    this._drawEditableCanvas(this.printWidth, this.printHeight);
                }
                this.designerActive = true;
            } else {
                document.getElementById("img_container_" + this.canvas_index).style.display = 'none';
                this.canvas_index = 0;
                document.getElementById("img_container_0").style.display = 'flex';
                $('.oe_prod').css({display: 'flex'});
                $('.oe_design_img').css({display: 'none'});
                $('#oe_prod_info').css({display: 'flex'});
                $('#oe_design_info').css({display: 'none'});
                this.designerActive = false;
            }
        }
        ,

        _onClickBtnColour: function () {
            let color = document.getElementById("input-colour").value;
            this.canvas[this.canvas_index].getActiveObject().set('fill', color);
            this.canvas[this.canvas_index].renderAll();
        }
        ,

        _onClickBtnBold: function () {
            this.canvas[this.canvas_index].getActiveObject().fontWeight === 'normal' ? this.canvas[this.canvas_index].getActiveObject().set('fontWeight', 'bold') : this.canvas[this.canvas_index].getActiveObject().set('fontWeight', 'normal');
            this.canvas[this.canvas_index].renderAll();
        }
        ,

        _onClickBtnItalic: function () {
            this.canvas[this.canvas_index].getActiveObject().fontStyle === 'normal' ? this.canvas[this.canvas_index].getActiveObject().set('fontStyle', 'italic') : this.canvas[this.canvas_index].getActiveObject().set('fontStyle', 'normal');
            this.canvas[this.canvas_index].renderAll();
        }
        ,

        _onClickBtnText: function () {
            this.text = new fabric.IText("Saisir \nTexte");
            this.text.set({
                fontSize: 40,
                fontFamily: "Calibri Bold",
                fill: "black",
                top: this.printTop + 40,
                left: 150,
                clipPath: this.clipPath[this.canvas_index],
                originX: 'center',
                originY: 'center',
                name: {}
            });
            this.canvas[this.canvas_index].add(this.text);
            this.canvas[this.canvas_index].setActiveObject(this.text);
            this.canvas[this.canvas_index].renderAll();
        }
        ,

        _onChangeFontText: function () {
            let self = this;
            document.getElementById("select-font-text").addEventListener("change", function () {
                self.canvas[self.canvas_index].getActiveObject().fontFamily = this.value;
                self.canvas[self.canvas_index].renderAll();
            }, false);
        }
        ,

        _onLoadFile: function () {
            let self = this;
            document.getElementById('oe_image_loader').addEventListener("change", function (e) {
                let reader = new FileReader();
                reader.onload = function (event) {
                    let imgObj = new Image();
                    imgObj.src = event.target.result;
                    // When the picture loads, create the image in Fabric.js
                    imgObj.onload = function () {
                        let img = new fabric.Image(imgObj);
                        img.set({
                            clipPath: self.clipPath[self.canvas_index],
                        });
                        img.scaleToHeight(300);
                        img.scaleToWidth(300);
                        self.canvas[self.canvas_index].centerObject(img);
                        self.canvas[self.canvas_index].add(img);
                        self.canvas[self.canvas_index].renderAll();
                    };
                };
                // If the user selected a picture, load it
                if (e.target.files[0]) {
                    reader.readAsDataURL(e.target.files[0]);
                    e.target.value = null;
                }
            }, false);
        }
        ,
    })
    ;
});
