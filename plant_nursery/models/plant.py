# -*- coding: utf-8 -*-

from odoo import api, fields, models


class Plants(models.Model):
    _name = 'nursery.plant'
    _description = 'Nursery Plant'

    name = fields.Char("Plant Name")
    price = fields.Float()
    order_ids = fields.One2many("nursery.order", "plant_id", strings="Orders")
    order_count = fields.Integer(compute='_compute_order_count',
                                 store=True,
                                 string="Total sold")

    @api.depends('order_ids')
    def _compute_order_count(self):
        for plant in self:
            plant.order_count = len(plant.order_ids)
