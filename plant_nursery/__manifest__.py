# -*- coding: utf-8 -*-

{
    'name': 'Plant nursery',
    'version': '1.0',
    'category': 'Tools',
    'summary': 'Plants and Customers Management',
    'depends': ['web', 'mail', 'rating', 'utm'],
    'data': [
        'security/ir.model.access.csv',
        'views/nursery_plant_views.xml',
        'views/nursery_customer_views.xml',
        'views/nursery_order_views.xml',
        'data/ir_sequence_data.xml',
        'data/mail_template_data.xml'
    ],
    'demo': [
    ],
    'css': [],
    'installable': True,
    'auto_install': False,
    'application': True,
}