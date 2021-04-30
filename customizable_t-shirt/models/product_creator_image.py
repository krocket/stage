# -*- coding: utf-8 -*-

from odoo import fields, models, api


class ProductCreatorImage(models.Model):
    _name = 'product.creator.image'
    _description = 'Product Creator Image'
    _inherit = ['image.mixin']
    _order = 'sequence, id'

    name = fields.Char("Name", required=True)
    sequence = fields.Integer(default=10, index=True)

    image_1920 = fields.Image(required=True)
    product_tmpl_id = fields.Many2one('product.template', "Product Template", index=True, ondelete='cascade')

    @api.model_create_multi
    def create(self, vals_list):
        """
            We don't want the default_product_tmpl_id from the context
            to be applied if we have a product_variant_id set to avoid
            having the variant images to show also as template images.
            But we want it if we don't have a product_variant_id set.
        """
        context_without_template = self.with_context(
            {k: v for k, v in self.env.context.items() if k != 'default_product_tmpl_id'})
        normal_vals = []
        variant_vals_list = []

        for vals in vals_list:
            if 'default_product_tmpl_id' in self.env.context:
                variant_vals_list.append(vals)
            else:
                normal_vals.append(vals)

        return super().create(normal_vals) + super(ProductCreatorImage, context_without_template).create(variant_vals_list)


class ProductCreatorImageCanvas(models.Model):
    _name = 'product.creator.image.canvas'
    _description = 'Product Creator Image Canvas'

    # product_creator_image_id = fields.
