# -*- coding: utf-8 -*-

from odoo import fields, models


class Customer(models.Model):
    _name = 'nursery.customer'
    _description = 'Nursery Customer'

    name = fields.Char("Customer Name", required=True)
    email = fields.Char(help='To receive the newsletter')
    image = fields.Binary('Photo', attachment=True)
    address = fields.Char('Address')
    country_id = fields.Many2one('res.country', string='Country')
