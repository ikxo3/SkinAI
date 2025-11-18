from collections import deque

def bfs(graph, start, goal):
#ensemble des nœuds visités
    visited = set()
# initialisation de la file d'attente avec le chemin de départ
    queue = deque([[start]])
# tant que la file d'attente n'est pas vide    
    while queue:
# on retire le premier chemin de la file d'attente
        path = queue.popleft()
        node = path[-1]  # on prend le dernier nœud du chemin
        
       # si le nœud n'a pas encore été visité
        if node not in visited:
            visited.add(node)  
            
            # si le nœud est le but, on retourne le chemin
            if node == goal:
                return path
            
           # sinon, on explore les voisins du nœud
            for neighbor in graph[node]:
                # créer un nouveau chemin en ajoutant le voisin
                new_path = list(path)
                new_path.append(neighbor)
                # ajouter le nouveau chemin à la file d'attente
                queue.append(new_path)
    
    # si le but n'est pas trouvé, retourner None
    return None




            # Implémentation pas à pas de l'algorithme :

            # Début : file d'attente = [['A']], visité = {}

            # Étape 1 :

            # Sélectionner ['A'] dans la file d'attente

            # nœud = 'A' (non visité)

            # Ce n'est pas la cible

            # Voisins de A : ['B', 'C']

            # La file d'attente devient : [['A', 'B'], ['A', 'C']]

            # visité = {'A'}

            # Étape 2 :

            # Sélectionner ['A', 'B'] dans la file d'attente

            # nœud = 'B' (non visité)

            # Ce n'est pas la cible

            # Voisins de B : ['D', 'E']

            # La file d'attente devient : [['A', 'C'], ['A', 'B', 'D'], ['A', 'B', 'E']]

            # visité = {'A', 'B'}

            # Étape Étape 3 :

            # Sélectionnez ['A', 'C'] de la file d'attente.

            # Nœud = 'C' (non visité)

            # Ce n'est pas la cible.

            # Voisins de C : ['F']

            # La file d'attente devient : [['A', 'B', 'D'], ['A', 'B', 'E'], ['A', 'C', 'F']]

            # Visités = {'A', 'B', 'C'}

            # Étape 4 :

            # Sélectionnez ['A', 'B', 'D'] de la file d'attente.

            # Nœud = 'D' (non visité)

            # Ce n'est pas la cible et n'a pas de voisins.

            # Visités = {'A', 'B', 'C', 'D'}

            # Étape 5 :

            # Sélectionnez ['A', 'B', 'E'] de la file d'attente.

            # Nœud = 'E' (non visité)

            # Ce n'est pas la cible. Cible

            # Voisins de E : ['G']

            # La file d'attente devient : [['A','C','F'], ['A','B','E','G']]

            # Visités = {'A', 'B', 'C', 'D', 'E'}

            # Étape 6 :

            # Sélectionner ['A','C','F'] dans la file d'attente

            # Nœud = 'F' (non visité)

            # Ce n'est pas la cible, aucun voisin

            # Visités = {'A', 'B', 'C', 'D', 'E', 'F'}

            # Étape 7 :

            # Sélectionner ['A','B','E','G'] dans la file d'attente

            # Nœud = 'G' (non visité)

            # Voici la cible ! ← Retourner le chemin ['A','B','E','G']
            
def dfs(graph, start, goal):
    #ensemble des nœuds visités
    visited = set()
    # initialisation de la pile avec le chemin de départ
    stack = [[start]]
    # tant que la pile n'est pas vide    
    while stack:
        # on retire le dernier chemin de la pile (LIFO)
        path = stack.pop()
        node = path[-1]  # on prend le dernier nœud du chemin
        
        # si le nœud n'a pas encore été visité
        if node not in visited:
            visited.add(node)  
            
            # si le nœud est le but, on retourne le chemin
            if node == goal:
                return path
            
            # sinon, on explore les voisins du nœud
            for neighbor in graph[node]:
                # créer un nouveau chemin en ajoutant le voisin
                new_path = list(path)
                new_path.append(neighbor)
                # ajouter le nouveau chemin à la pile
                stack.append(new_path)
    
    # si le but n'est pas trouvé, retourner None
    return None

        # Début : pile = [['A']], visité = {}

            # Étape 1 :
            # Sélectionner ['A'] de la pile (dernier élément)
            # nœud = 'A' (non visité)
            # Ce n'est pas la cible
            # Voisins de A : ['B', 'C']
            # La pile devient : [['A', 'B'], ['A', 'C']]
            # visité = {'A'}

            # Étape 2 :
            # Sélectionner ['A', 'C'] de la pile (dernier élément)
            # nœud = 'C' (non visité)
            # Ce n'est pas la cible
            # Voisins de C : ['F']
            # La pile devient : [['A', 'B'], ['A', 'C', 'F']]
            # visité = {'A', 'C'}

            # Étape 3 :
            # Sélectionner ['A', 'C', 'F'] de la pile
            # nœud = 'F' (non visité)
            # Ce n'est pas la cible, aucun voisin
            # La pile devient : [['A', 'B']]
            # visité = {'A', 'C', 'F'}

            # Étape 4 :
            # Sélectionner ['A', 'B'] de la pile
            # nœud = 'B' (non visité)
            # Ce n'est pas la cible
            # Voisins de B : ['D', 'E']
            # La pile devient : [['A', 'B', 'D'], ['A', 'B', 'E']]
            # visité = {'A', 'C', 'F', 'B'}

            # Étape 5 :
            # Sélectionner ['A', 'B', 'E'] de la pile
            # nœud = 'E' (non visité)
            # Ce n'est pas la cible
            # Voisins de E : ['G']
            # La pile devient : [['A', 'B', 'D'], ['A', 'B', 'E', 'G']]
            # visité = {'A', 'C', 'F', 'B', 'E'}

            # Étape 6 :
            # Sélectionner ['A', 'B', 'E', 'G'] de la pile
            # nœud = 'G' (non visité)
            # C'est la cible ! ← Retourner le chemin ['A', 'B', 'E', 'G']

graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['G'],
    'F': [],
    'G': []
}

start = 'A' 
goal = 'G'   

result = bfs(graph, start, goal)
print("Chemin trouvé par BFS :", result)

result_dfs = dfs(graph, start, goal)
print("Chemin trouvé par DFS :", result_dfs)