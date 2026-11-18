

class Heap:
    

    def __init__(self, modo: str = "min", dados: "list[int] | None" = None) -> None:
        
        if modo not in ("min", "max"):
            raise ValueError("modo deve ser 'min' ou 'max'")
        self.modo: str = modo
        self.dados: list[int] = []
        self.comparacoes: int = 0  
        self.trocas: int = 0       
        if dados:
            self.dados = list(dados)
            for i in range(len(self.dados) // 2 - 1, -1, -1):
                self._descer(i)

    def _prioridade(self, a: int, b: int) -> bool:
      
        self.comparacoes += 1
        return a < b if self.modo == "min" else a > b

    def _trocar(self, i: int, j: int) -> None:
      
        self.dados[i], self.dados[j] = self.dados[j], self.dados[i]
        self.trocas += 1

    def _subir(self, i: int) -> None:
        
        while i > 0:
            pai = (i - 1) // 2
            if self._prioridade(self.dados[i], self.dados[pai]):
                self._trocar(i, pai)
                i = pai
            else:
                break

    def _descer(self, i: int) -> None:
        
        n = len(self.dados)
        while True:
            esq, dir_, melhor = 2 * i + 1, 2 * i + 2, i
            if esq < n and self._prioridade(self.dados[esq], self.dados[melhor]):
                melhor = esq
            if dir_ < n and self._prioridade(self.dados[dir_], self.dados[melhor]):
                melhor = dir_
            if melhor == i:
                break
            self._trocar(i, melhor)
            i = melhor

    def inserir(self, valor: int) -> None:
        
        self.dados.append(valor)
        self._subir(len(self.dados) - 1)

    def extrair(self) -> int:
       
        if not self.dados:
            raise IndexError("heap vazio")
        raiz = self.dados[0]
        ultimo = self.dados.pop()
        if self.dados:
            self.dados[0] = ultimo
            self._descer(0)
        return raiz

    def espiar(self) -> "int | None":
        
        return self.dados[0] if self.dados else None


def e_heap_valido(h: Heap) -> bool:
   
    for i in range(1, len(h.dados)):
        pai, filho = h.dados[(i - 1) // 2], h.dados[i]
        if (filho < pai) if h.modo == "min" else (filho > pai):
            return False
    return True


def titulo(texto: str) -> None:
    print("\n" + "=" * 64 + "\n" + texto + "\n" + "=" * 64)


if __name__ == "__main__":
   
    titulo("CENÁRIO 1: caso comum (Min-Heap e Max-Heap)")
    valores = [5, 3, 8, 1, 9, 2, 7]
    for modo in ("min", "max"):
        h = Heap(modo)
        for v in valores:
            h.inserir(v)
        print(f"[{modo}] após inserir {valores}: {h.dados} | válido? {e_heap_valido(h)} | espiar = {h.espiar()}")
        saida = [h.extrair() for _ in range(len(h.dados))]
        print(f"[{modo}] extraindo tudo: {saida} | comparações = {h.comparacoes}, trocas = {h.trocas}")
    h = Heap("max", valores)  # construindo direto pelo parâmetro `dados`
    print(f"[max] Heap('max', dados) já organiza o array: {h.dados} | válido? {e_heap_valido(h)}")

   
    titulo("CENÁRIO 2: casos de borda")
    h = Heap("min")
    print("heap vazio -> espiar:", h.espiar())
    try:
        h.extrair()
    except IndexError as erro:
        print("heap vazio -> extrair levanta IndexError:", erro)
    h.inserir(42)
    print("um elemento -> extrair:", h.extrair(), "| comparações =", h.comparacoes)
    h = Heap("max", [4, 4, 4, 4])
    print("valores repetidos:", [h.extrair() for _ in range(4)])
    try:
        Heap("medio")
    except ValueError as erro:
        print("modo inválido levanta ValueError:", erro)

   
    titulo("CENÁRIO 3: pior caso x melhor caso do inserir (n = 1023)")
    n = 1023
    casos = {
        "min": ("decrescente", range(n, 0, -1), "crescente", range(1, n + 1)),
        "max": ("crescente", range(1, n + 1), "decrescente", range(n, 0, -1)),
    }
    for modo, (nome_pior, pior, nome_melhor, melhor) in casos.items():
        h_pior, h_melhor = Heap(modo), Heap(modo)
        for v in pior:
            h_pior.inserir(v)
        for v in melhor:
            h_melhor.inserir(v)
        print(f"[{modo}] PIOR (ordem {nome_pior}, todo novo valor sobe até a raiz): "
              f"comparações = {h_pior.comparacoes}, trocas = {h_pior.trocas}")
        print(f"[{modo}] MELHOR (ordem {nome_melhor}, ninguém sobe): "
              f"comparações = {h_melhor.comparacoes}, trocas = {h_melhor.trocas}")
    print(f"Referência: n * log2(n) = {n * 10} (cresce assim no pior caso).")
