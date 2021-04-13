odoo.define('customisable_t-shirt.customisable_t-shirt', (require) => {
    'use strict';

    const core = require('web.core');
    const config = require('web.config');
    const publicWidget = require('web.public.widget');
    require("web.zoomodoo");

    publicWidget.registry.CustomisableTShirt = publicWidget.Widget.extend({
        selector: '.oe_customisable_t-shirt',
        events: {
            'change select[id="tshirt-design"]': '_onChangeTShirtDesign',
            'change select[id="select-font-text"]': '_onChangeFontText',
            'change input[id="tshirt-custompicture"]': '_onChangeCustomPicture',
            'click #btn-clear-all': '_onClickClearAll',
            'click #btn-clear-selected': '_onClickClearSelected',
            'click #btn-text': '_onClickBtnText',
            'click #btn-bold': '_onClickBtnBold',
            'click #btn-italic': '_onClickBtnItalic',
            'click #btn-colour': '_onClickBtnColour',
            'click input[id="btn-save"]': '_onClickBtnSave',
        },
        jsLibs: ['/customizable_t-shirt/static/lib/fabric.min.js', '/customizable_t-shirt/static/lib/dom-to-image.min.js'],

        init: function () {
            this._super.apply(this, arguments);
            this.canvas = new fabric.Canvas('tshirt-canvas');
        },

        start() {
            const def = this._super(...arguments);
            this.$('select[id="tshirt-design"]').change();
            this.$('select[id="select-font-text"]').change();
            this.$('input[id="tshirt-custompicture"]').change();
            return def;
        },

        _onClickBtnSave: function () {
            let node = document.getElementById('t-shirt-div');
            domtoimage.toPng(node).then(function (dataURL) {
                //console.log(dataURL);
                document.getElementById("custom_image").value = dataURL;
                document.getElementById("btn-save").type = "submit";
                document.getElementById("btn-save").click();

            }).catch(function (e) {
                console.error('error', e);
            });
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
            this.canvas.add(this.text);
            this.canvas.renderAll();
        },

        _onChangeFontText: function () {
            let self = this;
            document.getElementById("select-font-text").addEventListener("change", function () {
                self.canvas.getActiveObject().fontFamily = this.value;
                self.canvas.renderAll();
            }, false);
        },

        _onChangeTShirtDesign: function () {
            let self = this;
            document.getElementById("tshirt-design").addEventListener("change", function () {
                // Call the updateTshirtImage method providing as first argument the URL
                // of the image provided by the select
                if (!this.value) {
                    self.canvas.clear();
                }
                // Create a new image that can be used in Fabric with the URL
                fabric.Image.fromURL(this.value, function (img) {
                    // Define the image as background image of the Canvas
                    self.canvas.setBackgroundImage(img, self.canvas.renderAll.bind(self.canvas), {
                        // Scale the image to the canvas size
                        scaleX: self.canvas.width / img.width,
                        scaleY: self.canvas.height / img.height
                    });
                });
            }, false);
        }

        ,

        _onChangeCustomPicture: function () {
            let canvas = this.canvas;
            // if (!this.value) {
            //     canvas.clear();
            // }
            document.getElementById('tshirt-custompicture').addEventListener("change", function (e) {
                let reader = new FileReader();
                reader.onload = function (event) {
                    let imgObj = new Image();
                    imgObj.src = event.target.result;
                    // When the picture loads, create the image in Fabric.js
                    imgObj.onload = function () {
                        let img = new fabric.Image(imgObj);

                        img.scaleToHeight(300);
                        img.scaleToWidth(300);
                        canvas.centerObject(img);
                        canvas.add(img);
                        canvas.renderAll();
                    };
                };

                // If the user selected a picture, load it
                if (e.target.files[0]) {
                    reader.readAsDataURL(e.target.files[0]);
                }
            }, false);
        }
        ,
    });
})
;