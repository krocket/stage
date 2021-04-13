from odoo import fields, models, api


class ProductProductInherit(models.Model):
    _inherit = 'product.product'

    custom_image = fields.Image(string='Custom Image')
