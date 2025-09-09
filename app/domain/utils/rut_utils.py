"""
Utilidades para validación y formateo de RUT chileno.
"""
import re
from typing import Optional


def limpiar_rut(rut: str) -> str:
    """
    Limpia un RUT eliminando puntos, guiones y espacios.
    
    Args:
        rut: RUT a limpiar (ej: "12.345.678-9")
        
    Returns:
        RUT limpio (ej: "123456789")
    """
    return re.sub(r'[.\-\s]', '', rut.upper())


def formatear_rut(rut: str) -> str:
    """
    Formatea un RUT al formato chileno estándar xx.xxx.xxx-x.
    
    Args:
        rut: RUT sin formato (ej: "123456789") o con formato
        
    Returns:
        RUT formateado (ej: "12.345.678-9")
    """
    # Limpiar el RUT primero
    rut_limpio = limpiar_rut(rut)
    
    # Verificar que tenga al menos 8 caracteres (7 números + 1 dígito verificador)
    if len(rut_limpio) < 8:
        raise ValueError("RUT debe tener al menos 8 caracteres")
    
    # Separar números y dígito verificador
    numeros = rut_limpio[:-1]
    digito = rut_limpio[-1]
    
    # Formatear números con puntos
    if len(numeros) >= 7:
        numeros_formateados = f"{numeros[:-6]}.{numeros[-6:-3]}.{numeros[-3:]}"
    elif len(numeros) >= 4:
        numeros_formateados = f"{numeros[:-3]}.{numeros[-3:]}"
    else:
        numeros_formateados = numeros
    
    return f"{numeros_formateados}-{digito}"


def validar_rut(rut: str) -> bool:
    """
    Valida si un RUT chileno es válido usando el algoritmo del dígito verificador.
    
    Args:
        rut: RUT a validar (con o sin formato)
        
    Returns:
        True si el RUT es válido, False en caso contrario
    """
    try:
        rut_limpio = limpiar_rut(rut)
        
        # Verificar que tenga al menos 8 caracteres
        if len(rut_limpio) < 8 or len(rut_limpio) > 9:
            return False
        
        # Separar números y dígito verificador
        numeros = rut_limpio[:-1]
        digito_verificador = rut_limpio[-1]
        
        # Verificar que los números sean dígitos
        if not numeros.isdigit():
            return False
        
        # Calcular dígito verificador
        suma = 0
        multiplicador = 2
        
        for i in reversed(numeros):
            suma += int(i) * multiplicador
            multiplicador += 1
            if multiplicador > 7:
                multiplicador = 2
        
        resto = suma % 11
        digito_calculado = 11 - resto
        
        if digito_calculado == 11:
            digito_calculado = '0'
        elif digito_calculado == 10:
            digito_calculado = 'K'
        else:
            digito_calculado = str(digito_calculado)
        
        return digito_verificador == digito_calculado
        
    except (ValueError, IndexError):
        return False


def normalizar_rut(rut: str) -> Optional[str]:
    """
    Normaliza un RUT: lo valida y lo devuelve en formato estándar.
    
    Args:
        rut: RUT a normalizar
        
    Returns:
        RUT normalizado en formato xx.xxx.xxx-x o None si es inválido
    """
    try:
        if validar_rut(rut):
            return formatear_rut(rut)
        return None
    except ValueError:
        return None


# Constantes para tests
RUT_TEST_VALIDO = "11.111.111-1"
RUT_TEST_INVALIDO = "12.345.678-0"

# Lista de RUTs de prueba válidos
RUTS_TEST = [
    "11.111.111-1",
    "22.222.222-2", 
    "33.333.333-3",
    "12.345.678-9",
    "98.765.432-1"
]
