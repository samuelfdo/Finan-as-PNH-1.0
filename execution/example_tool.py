import sys
import os

def main():
    if len(sys.argv) < 2:
        print("Uso: python example_tool.py <texto>")
        sys.exit(1)
    
    args = []
    for i in range(1, len(sys.argv)):
        args.append(sys.argv[i])
    texto = " ".join(args)
    palavras = len(texto.split())
    
    # Calcular o caminho da raiz do projeto (um diretório acima de 'execution')
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    tmp_dir = os.path.join(project_root, ".tmp")
    
    # Garantir que .tmp/ existe
    os.makedirs(tmp_dir, exist_ok=True)
    
    arquivo_saida = os.path.join(tmp_dir, "resultado.txt")
    with open(arquivo_saida, "w", encoding="utf-8") as f:
        f.write(f"O texto contém {palavras} palavras.\n")
        
    print(f"Sucesso! O resultado foi salvo em {arquivo_saida}")

if __name__ == "__main__":
    main()
