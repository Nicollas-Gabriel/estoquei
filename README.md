# Estoquei

**Controle. Organize. Cresça.**

Protótipo navegável do **Estoquei**, um sistema de gestão de estoque para lojas.
É só o visual e o fluxo das telas, com dados fictícios. Não existe back-end: nada é salvo de verdade e, ao recarregar a página, tudo volta ao começo.

> Simplifique sua gestão. Potencialize seus resultados.

## O que o protótipo mostra

- **Entrada**: login e cadastro separados para **Dono** e **Funcionário**.
  - Senha com no mínimo 10 caracteres e 1 letra maiúscula, validada na hora.
  - O dono cria a conta e a loja, e recebe um **código exclusivo** da loja.
  - O funcionário se cadastra com o código da empresa.
- **Escolha de loja** (só dono): um dono pode ter várias lojas, cada uma com seu código. O funcionário entra direto na loja do código.
- **Estoque**: visão geral (peças, sem estoque, estoque baixo e valor em estoque, que **só o dono vê**), busca, adicionar item com resumo ao lado, editar item, repor estoque e vender.
- **Venda**: quantidade, forma de pagamento, atacado ou varejo, online ou presencial. O estoque diminui e a venda vai para o Histórico.
- **Análise** (só dono): vendas, peças vendidas, peça mais vendida, lucro estimado, dinheiro do estoque e gráfico de vendas por mês.
- **Histórico**: todas as vendas com data, hora, vendedor, foto da peça, pagamento, tipo e canal, com busca.
- **Suporte**: chat com a equipe e aviso de que um chatbot vem em breve.
- **Plano**: R$ 29,90 por mês, visível para dono e funcionário.

## Como testar

1. Abra a página.
2. Toque em **Preencher com conta de demonstração** e entre.
3. Use o alternador **Visão: Dono / Funcionário** no topo para ver as diferenças de permissão.
4. Para testar o cadastro de funcionário, use um destes códigos de loja: `EST-8F3K29` ou `EST-2M7QX4`.

## Como rodar no computador

Não precisa instalar nada. Dê dois cliques em `index.html` e ele abre no navegador.
(Precisa de internet só para carregar as fontes do Google Fonts. Sem internet, o sistema usa uma fonte padrão.)

## Estrutura

```
index.html        página principal
style.css         visual (cores, layout, tema claro e escuro)
app.js            telas e regras do protótipo
assets/           logo do Estoquei
```


