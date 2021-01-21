# -*- coding: utf-8 -*-

from odoo import fields, models


class Plants(models.Model):
    _name = 'nursery plant'
    _description = 'Nursery Plant'

    name = fields.Char("Plant Name")
    price = fields.Float()