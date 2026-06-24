# RESUMO DO PROJETO CAIO

Resumo atualizado do projeto local que esta sendo construido nesta pasta.

```text
C:\Users\mateu\OneDrive\Area de Trabalho\Projeto Caio
```

O projeto deve ser visualizado abrindo o arquivo:

```text
site.html
```

No momento o foco e trabalhar localmente pelo arquivo HTML, sem depender de Git, hospedagem ou Supabase. A integracao com banco fica para uma etapa futura.

---

## 1. Visao geral

O Projeto Caio e um sistema web em HTML, CSS e JavaScript puro.

Ele possui duas areas principais:

- **Dashboard**: paineis visuais, indicadores, graficos e analises.
- **Sistemas**: registro de vendas, historico e cadastro de clientes/produtos.

Tambem existe um botao flutuante de IA/mensagens que aparece nas duas areas, com visual adaptado ao tema de cada uma.

---

## 2. Estrutura principal

```text
Projeto Caio/
  site.html
  login.html

  app/
    js/
      navigation.js

  sistema/
    css/
      sistema.css
    js/
      sistema.js

  dashboard/
    painel-geral/
      painel-geral.html
      painel-geral.css
      painel-geral.js

    vendas/
      vendas.html
      vendas.css
      vendas.js

    clientes/
      clientes.html
      clientes.css
      clientes.js

    produtos/
      produtos.html
      produtos.css
      produtos.js

    historico/
      historico.html
      historico.css
      historico.js

  assets/
    img/
    fonts/

  docs/
    README.md
```

---

## 3. Arquivos mais importantes

### `site.html`

Entrada principal do projeto.

Contem:

- sidebar geral;
- troca entre modo Dashboard e modo Sistemas;
- paginas internas do Sistemas;
- iframes dos dashboards;
- botao flutuante de IA;
- modais de cadastro/edicao.

### `sistema/css/sistema.css`

CSS principal da casca do projeto e da area Sistemas.

Controla:

- sidebar;
- temas Dashboard/Sistemas;
- cards;
- tabelas;
- formularios;
- botoes;
- modais;
- botao IA;
- pagina Registro;
- pagina Historico;
- pagina Cadastro.

### `sistema/js/sistema.js`

JavaScript da area Sistemas.

Controla:

- dados visuais/demo;
- cadastro de clientes;
- cadastro de produtos;
- registro de venda;
- importacao visual de arquivo `.xlsx`;
- historico de registros;
- filtro de historico;
- edicao/exclusao;
- formatacao de faturamento;
- preparacao para integracao futura com Supabase.

### `app/js/navigation.js`

Controla a navegacao geral:

- alternar Dashboard/Sistemas;
- abrir paginas pelo menu;
- expandir/recolher sidebar;
- manter comportamento da sidebar e da orbita do Dashboard.

---

## 4. Area Sistemas

### Registro

Pagina para criar um registro visual de venda.

Campos atuais:

- Codigo;
- Cliente;
- Numero NFE;
- Data;
- Horario;
- Faturamento;
- Oferta Ativa;
- Importar arquivo `.xlsx`.

O campo de faturamento formata o valor como moeda em reais.

O importador aceita somente arquivo `.xlsx`, com suporte visual para multiplos arquivos.

### Historico

Lista baseada no Registro, sem detalhes de produto, preco unitario ou quantidade.

Colunas atuais:

- Data;
- Horario;
- NFE;
- Cliente;
- Faturamento;
- Oferta Ativa;
- Acoes.

O filtro do Historico funciona assim:

- digitar no campo ou escolher mes/ano nao altera a tabela automaticamente;
- o botao **Atualizar** aplica o filtro;
- o botao **Limpar** limpa os filtros e volta a mostrar todos os registros.

### Cadastro

Possui duas abas:

- Clientes;
- Produtos.

Clientes mostram:

- Codigo;
- Nome;
- Acoes.

Produtos mostram:

- Codigo;
- Nome;
- Preco Unitario;
- Acoes.

Os dados atuais sao visuais/demo para testar layout, fonte e formatacao.

---

## 5. Area Dashboard

### Painel Geral

Dashboard principal com cards de acompanhamento geral.

Inclui:

- card Hoje;
- card Mes com mini quadrantes rotativos;
- Status de Clientes;
- Ritmo de Atingimento;
- Progresso da Meta;
- Periodo de Inatividade;
- Relatorio de Cumprimento.

### Vendas

Pagina visualmente trabalhada com graficos e cards de vendas.

Inclui:

- Fluxo Mensal;
- Janelas de Venda;
- Oferta Ativa;
- Quinzena Mais Forte;
- Quantidade de Vendas por Dia.

### Clientes

Pagina de analise de clientes.

Inclui:

- Ranking;
- Quantidade de Clientes Novos;
- Lista de Vendas;
- visores/resumos ligados a lista.

### Produtos e Historico

Pastas ja existem para evolucao futura dos dashboards especificos.

---

## 6. Botao IA

Existe um botao flutuante de mensagens/IA em todas as areas.

Ele possui:

- Inicio;
- Atendimento;
- Notificacao;
- Lixeira no Atendimento;
- mensagens com estados de nao lida, respondida e fixada;
- notificacoes do Dashboard/Sistemas;
- tema visual diferente quando esta no modo Sistemas.

O botao esta fixo e nao deve ser arrastado.

---

## 7. Dados atuais

O projeto usa dados visuais/demo no JavaScript para permitir testar layout sem banco.

Exemplos:

- clientes cadastrados visualmente;
- produtos cadastrados visualmente;
- registros de historico visual;
- dashboards com valores simulados.

Isso existe apenas para desenvolvimento visual. No futuro, esses dados devem vir do Supabase.

---

## 8. Supabase futuro

O projeto ja tem ideia preparada para usar Supabase depois.

Tabelas provaveis:

- `clientes`;
- `produtos`;
- `faturamento_itens`;
- tabelas auxiliares para metas, feriados, mensagens e dashboards.

Importante:

- usar apenas chave publica no frontend;
- nao colocar chave secreta em HTML, CSS ou JS;
- adaptar os dados demo para buscar dados reais quando o banco estiver pronto.

---

## 9. Onde mexer

```text
Sidebar, tema geral, botao IA e paginas Sistemas:
  sistema/css/sistema.css

Logica de Registro, Historico e Cadastro:
  sistema/js/sistema.js

Navegacao geral e sidebar:
  app/js/navigation.js

Painel Geral:
  dashboard/painel-geral/

Vendas:
  dashboard/vendas/

Clientes:
  dashboard/clientes/

Produtos:
  dashboard/produtos/

Historico do Dashboard:
  dashboard/historico/
```

---

## 10. Regras importantes

- Trabalhar localmente no `site.html`.
- Nao depender de servidor, Git ou hospedagem nesta fase.
- Nao misturar Dashboard com logica operacional do Sistemas.
- Nao alterar arquivos fora da pasta do projeto sem necessidade.
- Manter o padrao visual ja criado antes de adicionar novos cards.
- Preservar a qualidade visual da sidebar, cards, tabelas e botao IA.

---

## 11. Estado atual

O projeto esta em fase visual/funcional local.

Ja existe bastante estrutura pronta para:

- simular registros;
- visualizar historico;
- cadastrar clientes/produtos;
- navegar entre Dashboard e Sistemas;
- testar dashboards;
- preparar integracao futura com Supabase.

Proxima etapa natural:

- continuar refinando visual e layout;
- depois conectar os dados reais do Supabase.
