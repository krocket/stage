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
            'change input[id="image-loader"]': '_onLoadFile',
            'click #btn-clear-all': '_onClickClearAll',
            'click #btn-clear-selected': '_onClickClearSelected',
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
        },

        init: function () {
            this._super.apply(this, arguments);
            // this.canvas = new fabric.Canvas('tshirt-canvas');
            this.designerActive = false;
            this.creator_images_tab = Array.prototype.slice.call(document.querySelectorAll('.creator_images')).map(function (element) {
                console.log(element.value);
                return element.value;
            });
            console.log(this.creator_images_tab);
            this.canvas = ArticleCanvas.canvas;

            this.clipPath = new fabric.Rect({
                width: ArticleCanvas.printWidth,
                height: ArticleCanvas.printHeight,
                top: ArticleCanvas.printTop,
                left: ArticleCanvas.printLeft,
                absolutePositioned: true,
                excludeFromExport: true
            });
            let printArea = new fabric.Rect({
                width: ArticleCanvas.printWidth,
                height: ArticleCanvas.printHeight,
                top: ArticleCanvas.printTop,
                left: ArticleCanvas.printLeft,
                fill: null,
                stroke: ArticleCanvas.borderColor,
                selectable: false,
                strokeDashArray: [5, 5],
                strokeWidth: 1,
                name: 'printArea',
                excludeFromExport: true
            });

            this.canvas.add(printArea);
            let w = printArea.getScaledWidth();
            let width_cm = w / 10 / (ArticleCanvas.printWidth / w);
            let wcm = Math.round(width_cm * 10) / 10;
            let h = printArea.getScaledHeight();
            let height_cm = h / 10 / (ArticleCanvas.printHeight / h);
            let hcm = Math.round(height_cm * 10) / 10;
            let tx = wcm + "x" + hcm + "cm Printable Area";

            let txt = new fabric.Text(tx, {
                excludeFromExport: true,
                fontFamily: 'courier',
                fontSize: 10,
                textAlign: 'left',
                left: ArticleCanvas.printLeft,
                top: ArticleCanvas.printTop - 14,
                fill: ArticleCanvas.borderColor,
                name: '35cm'
            });
            txt.setCoords();
            this.canvas.add(txt);
        },

        start() {
            const def = this._super(...arguments);
            this.$('select[id="tshirt-design"]').change();
            this.$('select[id="select-font-text"]').change();
            this.$('input[id="image-loader"]').change();
            return def;
        },

        _onClickBtnSave: function () {
            let node = document.getElementById('t-shirt-div');
            domtoimage.toPng(node).then(function (dataURL) {
                console.log(dataURL);
                document.getElementById("custom_image").value = dataURL;
                document.getElementById("btn-save").type = "submit";
                document.getElementById("btn-save").click();
            }).catch(function (e) {
                console.error('error', e);
            });
        },

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
        },

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
        },

        _onClickLeftDesignerArrow: function () {
            let length = document.getElementById("creator_images_length").value;
            let old_index = parseInt(document.getElementById("creator_images_index").value);
            let new_index = old_index - 1;
            for (let i = 0; i < length; i++) {
                if (new_index < 0) new_index = length - 1;
                if (i === old_index) document.getElementById("creator_image_" + i).style.display = 'none';
                else if (i === new_index) document.getElementById("creator_image_" + i).style.display = 'block';
            }
            document.getElementById("creator_images_index").value = new_index;
        },

        _onClickRightDesignerArrow: function () {
            let length = document.getElementById("creator_images_length").value;
            let old_index = parseInt(document.getElementById("creator_images_index").value);
            let new_index = old_index + 1;
            for (let i = 0; i < length; i++) {
                if (new_index >= length) new_index = 0;
                if (i === old_index) document.getElementById("creator_image_" + i).style.display = 'none';
                else if (i === new_index) document.getElementById("creator_image_" + i).style.display = 'block';
            }
            document.getElementById("creator_images_index").value = new_index;
        },

        _SwapMode: function () {
            if (!this.designerActive) {
                $('#prodImg').css({display: 'none'});
                $('#designer').css({display: 'flex'});
                $('#descBody').css({display: 'none'});
                $('#inbasket').css({display: 'flex'});
                $('#editor').css({display: 'flex'});
                $('#wkcon').css({display: 'flex'});
                this.designerActive = true;
            } else {
                $('#prodImg').css({display: 'flex'});
                $('#designer').css({display: 'none'});
                $('#descBody').css({display: 'flex'});
                $('#inbasket').css({display: 'none'});
                $('#editor').css({display: 'none'});
                $('#wkcon').css({display: 'none'});
                this.designerActive = false;
            }

        },

        _onClickClearAll: function () {
            this.canvas.clear();
        },

        _onClickClearSelected: function () {
            this.canvas.remove(this.canvas.getActiveObject());
        },

        _onClickBtnColour: function () {
            let color = document.getElementById("input-colour").value;
            this.canvas.getActiveObject().set('fill', color);
            this.canvas.renderAll();
        },

        _onClickBtnBold: function () {
            this.canvas.getActiveObject().fontWeight === 'normal' ? this.canvas.getActiveObject().set('fontWeight', 'bold') : this.canvas.getActiveObject().set('fontWeight', 'normal');
            this.canvas.renderAll();
        },

        _onClickBtnItalic: function () {
            this.canvas.getActiveObject().fontStyle === 'normal' ? this.canvas.getActiveObject().set('fontStyle', 'italic') : this.canvas.getActiveObject().set('fontStyle', 'normal');
            this.canvas.renderAll();
        },

        _onClickBtnText: function () {
            this.text = new fabric.IText("Saisir \nTexte");
            this.text.set({
                fontSize: 40,
                fontFamily: "Calibri Bold",
                fill: "black",
                top: ArticleCanvas.printTop + 40,
                left: 150,
                clipPath: this.clipPath,
                originX: 'center',
                originY: 'center',
                name: {}
            });
            this.canvas.add(this.text);
            this.canvas.setActiveObject(this.text);
            this.canvas.renderAll();
        },

        _onChangeFontText: function () {
            let self = this;
            document.getElementById("select-font-text").addEventListener("change", function () {
                self.canvas.getActiveObject().fontFamily = this.value;
                self.canvas.renderAll();
            }, false);
        },

        _onLoadFile: function () {
            let self = this;
            document.getElementById('image-loader').addEventListener("change", function (e) {
                let reader = new FileReader();
                reader.onload = function (event) {
                    let imgObj = new Image();
                    imgObj.src = event.target.result;
                    // When the picture loads, create the image in Fabric.js
                    imgObj.onload = function () {
                        let img = new fabric.Image(imgObj);
                        img.set({
                            clipPath: self.clipPath,
                        });
                        img.scaleToHeight(300);
                        img.scaleToWidth(300);
                        self.canvas.centerObject(img);
                        self.canvas.add(img);
                        self.canvas.renderAll();
                    };
                };
                // If the user selected a picture, load it
                if (e.target.files[0]) {
                    reader.readAsDataURL(e.target.files[0]);
                    e.target.value = null;
                }
            }, false);
        },
    });
});

// odoo.define('customisable_t-shirt.customisable_t-shirt', (require) => {
//     'use strict';
//
//     const core = require('web.core');
//     const config = require('web.config');
//     const publicWidget = require('web.public.widget');
//     require("web.zoomodoo");
//
//     publicWidget.registry.CustomisableTShirt = publicWidget.Widget.extend({
//         selector: '.oe_customisable_t-shirt',
//         events: {
//             'change select[id="tshirt-design"]': '_onChangeTShirtDesign',
//             'change select[id="select-font-text"]': '_onChangeFontText',
//             'change input[id="tshirt-custompicture"]': '_onChangeCustomPicture',
//             'click #btn-clear-all': '_onClickClearAll',
//             'click #btn-clear-selected': '_onClickClearSelected',
//             'click #btn-text': '_onClickBtnText',
//             'click #btn-bold': '_onClickBtnBold',
//             'click #btn-italic': '_onClickBtnItalic',
//             'click #btn-colour': '_onClickBtnColour',
//             'click input[id="btn-save"]': '_onClickBtnSave',
//         },
//         jsLibs: ['/customizable_t-shirt/static/lib/fabric.min.js', '/customizable_t-shirt/static/lib/dom-to-image.min.js'],
//
//         init: function () {
//             this._super.apply(this, arguments);
//             // this.canvas = new fabric.Canvas('tshirt-canvas');
//             this.canvas = new fabric.Canvas('articleCanvas');
//         },
//
//         start() {
//             const def = this._super(...arguments);
//             this.$('select[id="tshirt-design"]').change();
//             this.$('select[id="select-font-text"]').change();
//             this.$('input[id="tshirt-custompicture"]').change();
//             return def;
//         },
//
//         _onClickBtnSave: function () {
//             let node = document.getElementById('t-shirt-div');
//             domtoimage.toPng(node).then(function (dataURL) {
//                 console.log(dataURL);
//                 document.getElementById("custom_image").value = dataURL;
//                 document.getElementById("btn-save").type = "submit";
//                 document.getElementById("btn-save").click();
//
//             }).catch(function (e) {
//                 console.error('error', e);
//             });
//         },
//
//         _onClickClearAll: function () {
//             this.canvas.clear();
//         },
//
//         _onClickClearSelected: function () {
//             this.canvas.remove(this.canvas.getActiveObject());
//         },
//
//         _onClickBtnColour: function () {
//             let color = document.getElementById("input-colour").value;
//             this.canvas.getActiveObject().set('fill', color);
//             this.canvas.renderAll();
//         },
//
//         _onClickBtnBold: function () {
//             this.canvas.getActiveObject().fontWeight === 'normal' ? this.canvas.getActiveObject().set('fontWeight', 'bold') : this.canvas.getActiveObject().set('fontWeight', 'normal');
//             this.canvas.renderAll();
//         },
//
//         _onClickBtnItalic: function () {
//             this.canvas.getActiveObject().fontStyle === 'normal' ? this.canvas.getActiveObject().set('fontStyle', 'italic') : this.canvas.getActiveObject().set('fontStyle', 'normal');
//             this.canvas.renderAll();
//         },
//
//         _onClickBtnText: function () {
//             this.text = new fabric.IText("Saisir \nTexte");
//             this.canvas.add(this.text);
//             this.canvas.renderAll();
//         },
//
//         _onChangeFontText: function () {
//             let self = this;
//             document.getElementById("select-font-text").addEventListener("change", function () {
//                 self.canvas.getActiveObject().fontFamily = this.value;
//                 self.canvas.renderAll();
//             }, false);
//         },
//
//         _onChangeTShirtDesign: function () {
//             let self = this;
//             document.getElementById("tshirt-design").addEventListener("change", function () {
//                 // Call the updateTshirtImage method providing as first argument the URL
//                 // of the image provided by the select
//                 if (!this.value) {
//                     self.canvas.clear();
//                 }
//                 // Create a new image that can be used in Fabric with the URL
//                 fabric.Image.fromURL(this.value, function (img) {
//                     // Define the image as background image of the Canvas
//                     self.canvas.setBackgroundImage(img, self.canvas.renderAll.bind(self.canvas), {
//                         // Scale the image to the canvas size
//                         scaleX: self.canvas.width / img.width,
//                         scaleY: self.canvas.height / img.height
//                     });
//                 });
//             }, false);
//         },
//
//         _onChangeCustomPicture: function () {
//             let canvas = this.canvas;
//             // if (!this.value) {
//             //     canvas.clear();
//             // }
//             document.getElementById('tshirt-custompicture').addEventListener("change", function (e) {
//                 let reader = new FileReader();
//                 reader.onload = function (event) {
//                     let imgObj = new Image();
//                     imgObj.src = event.target.result;
//                     // When the picture loads, create the image in Fabric.js
//                     imgObj.onload = function () {
//                         let img = new fabric.Image(imgObj);
//
//                         img.scaleToHeight(300);
//                         img.scaleToWidth(300);
//                         canvas.centerObject(img);
//                         canvas.add(img);
//                         canvas.renderAll();
//                     };
//                 };
//
//                 // If the user selected a picture, load it
//                 if (e.target.files[0]) {
//                     reader.readAsDataURL(e.target.files[0]);
//                 }
//             }, false);
//         },
//     });
// });