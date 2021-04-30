odoo.define('customisable_t-shirt.select_t-shirt', (require) => {
    'use strict';

    const publicWidget = require('web.public.widget');

    publicWidget.registry.Select_tshirt = publicWidget.Widget.extend({
        selector: '.oe_select_t-shirt',
        events: {
            'click #products_btn_send': '_onClickBtntestforcustom',
        },

        _onClickBtntestforcustom: function () {
            // const checkboxes = document.querySelectorAll(`input[class="tshirts_choices"]:checked`);
            let values = [];
            let product_ids = [];
            document.querySelectorAll(`input[class="tshirts_choices form-control"]`)
                .forEach((checkbox) => {
                    // Le || ne fonctionnait pas, bizarre ....
                    if (checkbox.value !== '') {
                        if (checkbox.value !== '0') {
                            values.push(checkbox.value);
                            product_ids.push(checkbox.getAttribute('product_id'));
                        }
                    }
                });
            console.log(values);
            console.log(product_ids);
            document.getElementById("product_qty_to_send").value = values;
            document.getElementById("product_ids_to_send").value = product_ids;
            console.log(document.getElementById("product_qty_to_send").value)
            console.log(document.getElementById("product_ids_to_send").value)
            document.getElementById("products_btn_send").type = "submit";
            document.getElementById("products_btn_send").click();
        },
    });
});