# -*- coding: utf-8 -*-

{
    'name': 'Plant nursery',
    'version': '1.1',
    'category': 'Tools',
    'summary': 'Plants and Customers Management',
    'depends': ['web', 'mail', 'rating', 'utm', 'website', 'portal'],
    'data': [
        'security/ir.model.access.csv',
        'views/nursery_plant_views.xml',
        'views/nursery_customer_views.xml',
        'views/nursery_order_views.xml',
        'views/nursery_plant_templates.xml',
        'views/nursery_plant_quote_ask.xml',
        'views/nursery_order_portal_templates.xml',
        'data/ir_sequence_data.xml',
        'data/mail_template_data.xml',
        'data/plant_data.xml',
        'security/security.xml',
    ],
    'demo': [
    ],
    'css': [],
    'installable': True,
    'auto_install': False,
    'application': True,
}