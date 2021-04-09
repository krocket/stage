odoo.define('customisable_t-shirt.customisable_t-shirt', (require) => {
    'use strict';

    const publicWidget = require('web.public.widget');

    publicWidget.registry.CustomisableTShirt = publicWidget.Widget.extend({
        selector: '.oe_customisable_t-shirt',
        events: {
            'change select[id="tshirt-design"]': '_onChangeTShirtDesign',
            'change select[id="select-font-text"]': '_onChangeFontText',
            'change input[id="tshirt-custompicture"]': '_onChangeCustomPicture',
            'click #btn-clear-all': '_onClickClearAll',
            'click #btn-clear-selected': '_onClickClearSelected',
            'click #btn-text': '_onClickBtnText',
            'click #btn-colour': '_onClickBtnColour',
        },
        jsLibs: ['/customizable_t-shirt/static/lib/fabric.min.js'],

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

        _onClickBtnText: function () {
            let text = document.getElementById("input-text").value;
            this.text = new fabric.Text(text);
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
            if (!this.value) {
                canvas.clear();
            }
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