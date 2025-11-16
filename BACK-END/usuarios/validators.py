from django.core.exceptions import ValidationError
from validate_docbr import CPF, CNPJ

def validate_cpf(value):
    cpf_validator = CPF()
    if not cpf_validator.validate(value):
        raise ValidationError('CPF inválido.', code='invalid_cpf')

def validate_cnpj(value):
    cnpj_validator = CNPJ()
    if not cnpj_validator.validate(value):
        raise ValidationError('CNPJ inválido.', code='invalid_cnpj')