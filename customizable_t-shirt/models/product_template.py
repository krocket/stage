# -*- coding: utf-8 -*-

from odoo import api, fields, models


class ProductTemplateExtension(models.Model):
    _inherit = 'product.template'

    is_customizable = fields.Boolean(string="Is customizable ?")
    is_creator = fields.Boolean(string="Is creator ?")
    product_template_creator_image_ids = fields.One2many('product.creator.image', 'product_tmpl_id',
                                                         string="Extra creator content", copy=True)


class ProductCreatorImage(models.Model):
    _name = 'product.creator.image'
    _description = 'Product Creator Image'
    _inherit = ['image.mixin']
    _order = 'sequence, id'

    name = fields.Char("Name", required=True)
    sequence = fields.Integer(default=10, index=True)

    image_1920 = fields.Image(required=True)
    product_tmpl_id = fields.Many2one('product.template', "Product Template", index=True, ondelete='cascade')
    print_width = fields.Float()
    print_height = fields.Float()
    print_top = fields.Float()
    print_left = fields.Float()

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

        return super().create(normal_vals) + super(ProductCreatorImage, context_without_template).create(
            variant_vals_list)
