from django import forms

class AddSessionsForm(forms.Form):
    amount = forms.IntegerField(label='Cantidad de sesiones', min_value=1)
