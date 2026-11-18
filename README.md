# Trabalho P2 – Estrutura de Dados: Min-Heap


### Link do vídeo explicativo :
https://youtu.be/1xu0DDTyhvE 

**Aluno:** Miguel Gomes Verucci | **RA:** 2840482521005 | **Tema escolhido:** C – Heaps e Filas de Prioridade (Min-Heap)

## Como executar
- Código: `python src/algoritmo(1).py` (roda 3 cenários de teste).
- Simulador: abrir `src/demo/index.html` no navegador (não precisa de servidor).

## Resumo teórico
Um **Min-Heap** é uma árvore binária completa em que todo pai é menor ou igual aos seus filhos, então o mínimo fica sempre na raiz. Ele é guardado num **array**: pai = `(i-1)//2`, filho esquerdo = `2i+1`, filho direito = `2i+2`.

- **insert (sift-up):** coloca no fim e troca com o pai enquanto for menor que ele.
- **extract (sift-down):** remove a raiz, move o último elemento para a raiz e troca com o menor filho enquanto for maior que ele.
- **peek:** lê o índice 0.

**Uso no mundo real:** filas de prioridade (escalonador de processos do sistema operacional), algoritmo de Dijkstra, Heap Sort e "os k maiores/menores" de um conjunto.

## Complexidade assintótica
| Operação | Melhor caso | Caso médio | Pior caso | Espaço auxiliar |
|---|---|---|---|---|
| peek | O(1) | O(1) | O(1) | O(1) |
| insert | O(1) | O(1) | O(log n) | O(1) |
| extract | O(1) | O(log n) | O(log n) | O(1) |

- **Pior caso do insert:** o novo valor é menor que todos e sobe da última folha até a raiz. Como a árvore é completa, sua altura é ⌊log₂ n⌋, então são no máximo log n trocas.
- **Melhor caso do insert:** o novo valor já é maior que o pai (ex.: inserção crescente), com 1 comparação e 0 trocas.
- **extract:** o elemento que vai para a raiz costuma ser grande e desce quase até as folhas, por isso é O(log n) na prática. O melhor caso O(1) só ocorre, por exemplo, com elementos iguais.
- **Espaço:** as operações são in-place (O(log n) extra); o heap em si ocupa O(1).

## Diário de Engenharia com IA
**Ferramenta/modelo:** Claude

**3 principais prompts (substitua pelos que você realmente usou):**
1. Me explique a Árvore Binária de Busca como se eu fosse apresentar num vídeo de 7 minutos: como ela funciona, como é organizada, as operações de inserção, busca e remoção, a complexidade Big-O de cada uma melhor, médio e pior caso e um exemplo passo a passo com números pequenos.
2. Monte um simulador web index.html, styles.css e app.js que mostre a BST funcionando passo a passo, com botões de avançar, voltar e reiniciar, destaque do nó sendo processado e contador de operações na tela.
   
3.Como eu faço pra provar, no código, que a busca na árvore é O(log n) no caso médio e O(n) no pior caso? Tem como contar as comparações e mostrar isso na prática?

**Erro, limitação ou ajuste manual encontrado:** Tive que refazer o index.html do simulador
Não funcionava no navegador: os botões não respondiam, e vi que o HTML não estava carregando o styles.css e o app.js direito.
