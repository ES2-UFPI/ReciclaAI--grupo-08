from abc import ABC, abstractmethod
from django.utils import timezone

# Base ------------------------
class ColetaState(ABC):
    def __init__(self, coleta):
        self.coleta = coleta

    @abstractmethod
    def aceitar(self): pass

    @abstractmethod
    def retirar(self): pass

    @abstractmethod
    def finalizar(self): pass


# Estados ---------------------

class PendenteState(ColetaState):
    def aceitar(self):
        self.coleta.status = "AGENDADA"
        self.coleta.data_coleta = timezone.now()
        self.coleta.save()
        return self.coleta

    def retirar(self):
        raise Exception("Coleta ainda não foi aceita.")

    def finalizar(self):
        raise Exception("Coleta ainda não está em trânsito.")


class AgendadaState(ColetaState):
    def aceitar(self):
        raise Exception("A coleta já foi aceita.")

    def retirar(self):
        self.coleta.status = "EM_TRANSITO"
        self.coleta.data_coleta = timezone.now()
        self.coleta.save()
        return self.coleta

    def finalizar(self):
        raise Exception("A coleta ainda não foi retirada.")


class EmTransitoState(ColetaState):
    def aceitar(self):
        raise Exception("A coleta já está em trânsito.")

    def retirar(self):
        raise Exception("A coleta já está em trânsito.")

    def finalizar(self):
        self.coleta.status = "FINALIZADA"
        self.coleta.save()
        return self.coleta


class FinalizadaState(ColetaState):
    def aceitar(self):  raise Exception("Coleta já finalizada.")
    def retirar(self):  raise Exception("Coleta já finalizada.")
    def finalizar(self): raise Exception("Coleta já finalizada.")


# Factory ----------------------

def get_coleta_state(coleta):
    status = coleta.status.upper()

    if status == "pendente":
        return PendenteState(coleta)

    if status == "agendada":
        return AgendadaState(coleta)

    if status == "em_transito":
        return EmTransitoState(coleta)

    if status == "finalizada":
        return FinalizadaState(coleta)

    raise Exception(f"Estado inválido: {coleta.status}")
