# Diretiva de Exemplo

## Objetivo
Ler um arquivo de texto e contar o número de palavras nele, salvando o resultado em um arquivo temporário em `.tmp/`.

## Ferramenta a ser utilizada
Você deve utilizar o script python `execution/example_tool.py`.

## Detalhes de Execução
1. Forneça o texto como argumento ou crie um arquivo temporário com o texto e passe o caminho para o script.
2. O script `execution/example_tool.py` irá processar e gerar o arquivo de saída na pasta `.tmp/`.
3. Verifique a saída e informe ao usuário o resultado final.

## Tratamento de Erros
- Se a pasta `.tmp/` não existir, o script deve criá-la.
- Se houver falhas de permissão, comunique ao usuário a necessidade de revisar as permissões da pasta.
