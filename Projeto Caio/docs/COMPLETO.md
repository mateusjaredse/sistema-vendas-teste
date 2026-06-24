COMPLETO - DOCUMENTACAO OPERACIONAL DO PROJETO CAIO
====================================================

Este arquivo existe para explicar o Projeto Caio em detalhes suficientes para que outra IA, outro desenvolvedor ou o proprio dono do projeto consiga continuar o trabalho sem depender do historico deste chat.

O objetivo desta documentacao nao e ser curta. O objetivo e explicar o que existe, onde existe, como funciona, o que nao deve ser quebrado e qual e a intencao visual/funcional do projeto.


1. LOCAL DO PROJETO
===================

O projeto atual esta nesta pasta local:

C:\Users\mateu\OneDrive\Area de Trabalho\Projeto Caio

O usuario trabalha localmente abrindo o arquivo:

site.html

Nesta fase o usuario nao quer Git, hosting, servidor, deploy automatico ou Supabase ativo como dependencia principal. O fluxo desejado e simples:

1. Alterar arquivos dentro desta pasta.
2. O usuario abre ou recarrega site.html para visualizar.
3. Quando o sistema estiver pronto, ele pensa depois em GitHub, Supabase e hospedagem.

Qualquer IA que trabalhar neste projeto deve respeitar isso. Nao tentar mover o projeto, nao ligar servidor, nao mexer em Git, nao conectar Supabase e nao criar fluxo externo sem pedido claro.


2. TECNOLOGIA USADA
===================

O projeto e feito com:

- HTML puro.
- CSS puro.
- JavaScript puro.
- Iframes para carregar paginas do Dashboard.
- Dados visuais/demo no JavaScript enquanto o banco nao esta pronto.

Nao usa React, Vue, Angular, Vite, Next ou backend local.

As fontes principais do projeto sao:

- DM Sans para interface geral.
- DM Sans para codigos, valores numericos e dados tabulares.

No tema Sistemas e Dashboard a base visual deve continuar padronizada em DM Sans.


3. ENTRADA PRINCIPAL
====================

Arquivo principal:

site.html

Ele contem a casca geral do sistema, incluindo:

- sidebar principal;
- navegacao do modo Sistemas;
- navegacao do modo Dashboard;
- paginas internas do Sistemas;
- iframes dos dashboards;
- modais de edicao/cadastro;
- botao flutuante de IA/mensagens;
- referencias para CSS e JS.

O site.html carrega:

- sistema/css/sistema.css
- app/js/navigation.js
- sistema/js/sistema.js

O CSS e o JS possuem parametros de cache no final do caminho, como:

sistema/css/sistema.css?v=...
sistema/js/sistema.js?v=...

Quando alterar CSS ou JS e o usuario nao enxergar a mudanca, atualizar o valor depois de ?v= ajuda a evitar cache visual.


4. ESTRUTURA DE PASTAS
======================

Estrutura atual esperada:

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
      dashboard-bg.png
      dashboard-bg-alt.png

    fonts/
      css2

    varias imagens relacionadas ao botao IA e logos

  docs/
    RESUMO.md
    COMPLETO.txt


5. ARQUITETURA GERAL
====================

O projeto tem duas grandes areas:

1. Sistemas
2. Dashboard

A alternancia entre elas acontece pelo botao central da sidebar.

No modo Sistemas, a sidebar mostra:

- Registro
- Historico
- Cadastro

No modo Dashboard, a sidebar mostra:

- Painel Geral
- Vendas
- Clientes
- Produtos
- Historico

A area Sistemas esta no proprio site.html. A area Dashboard e carregada em iframes, cada dashboard com HTML, CSS e JS proprios.


6. ARQUIVO app/js/navigation.js
===============================

Responsabilidade:

- controlar qual pagina esta visivel;
- alternar entre modo Sistemas e modo Dashboard;
- controlar sidebar expandida/recolhida;
- manter classes do body/app/main;
- controlar orbit da sidebar do Dashboard por JavaScript;
- evitar reset visual da orbit tanto quanto possivel.

Pontos importantes:

- A sidebar expande ao passar o mouse e recolhe ao sair.
- No modo Dashboard existe uma orbit na borda da sidebar.
- A orbit foi ajustada muitas vezes. Nao remover.
- O usuario quer orbit fluida, com duas luzes, sem reset perceptivel quando expande/recolhe.
- A sidebar nao deve sobrepor cards. O conteudo deve se ajustar.
- O usuario e muito sensivel a travamentos, baixo FPS e mudancas bruscas de sidebar.

Se precisar mexer na sidebar:

- mexer com cuidado em navigation.js e sistema.css;
- preservar classes existentes;
- nao remover orbit;
- nao alterar visual do Dashboard se o pedido for so no Sistemas, e vice-versa.


7. ARQUIVO sistema/css/sistema.css
==================================

Este e o CSS mais sensivel do projeto.

Ele controla:

- variaveis de cor;
- body;
- background dos temas;
- sidebar;
- logo;
- nav items;
- main;
- paginas Sistemas;
- cards;
- formularios;
- inputs;
- autocomplete;
- importador de arquivo;
- botoes;
- tabelas;
- filtros;
- botao IA;
- modal;
- tema Dashboard;
- tema Sistemas;
- responsividade basica.

Tema Sistemas:

- cards solidos em azul, atualmente usando #2d63b7;
- fundo com gradientes azuis;
- sidebar em azul;
- botoes e inputs seguindo o tema azul.

Tema Dashboard:

- fundo escuro com imagem assets/img/dashboard-bg.png;
- sidebar escura, mais elegante;
- cards dos dashboards com tema escuro/azulado.

Nao transformar o tema Sistemas em tema Dashboard e nao transformar o Dashboard em Sistemas.


8. ARQUIVO sistema/js/sistema.js
================================

Responsabilidade:

- dados demo;
- helpers de Supabase futuros;
- carregar clientes/produtos;
- renderizar clientes/produtos;
- filtrar clientes/produtos;
- autocomplete de cliente/produto;
- toggle Oferta Ativa;
- importador visual de arquivo .xlsx;
- salvar registro visual;
- limpar registro;
- carregar historico;
- filtro de historico;
- renderizar estatisticas do historico;
- renderizar tabela do historico;
- abrir modal de edicao;
- salvar edicao;
- excluir;
- modais de cliente/produto;
- formatacao de moeda;
- data/hora de Brasilia.

O arquivo contem constantes de Supabase:

- SB_URL
- SB_KEY
- TB_VENDAS
- TB_CLIENTES
- TB_PRODUTOS

Mesmo existindo, o projeto atual usa dados demo quando nao ha token de sessao. Isso e intencional para desenvolvimento visual local.


9. DADOS DEMO DO SISTEMAS
=========================

Em sistema/js/sistema.js existem:

- DEMO_CLIENTES
- DEMO_PRODUTOS
- DEMO_REGISTROS

Esses dados foram criados para testar:

- fontes;
- tabelas;
- espaçamento;
- botoes;
- valores;
- historico;
- cadastro.

Clientes demo incluem nomes como:

- 2 R- TRANSPORTES RODOVIARIO LTDA
- 2R AUTO PECAS DIESEL LTDA
- 36.980.312 JOSE VITOR VIEIRA DA MAIA
- 60.480.797 NICOLI ADNA SANTOS GUILHERME
- 64.379.766 FABIO JOSE MARTINS DE SA
- 65.418.209 VICKTOR ROCHO SEVERO
- A J RORATO & CIA LTDA

Produtos demo incluem codigos e nomes industriais.

Registros demo foram ajustados para refletir a pagina Registro, sem colunas de produto na pagina Historico.


10. PAGINA SISTEMAS - REGISTRO
==============================

Local:

site.html, bloco com id:

page-nova-venda

Funcao:

Cadastrar visualmente uma venda/nota.

Campos atuais:

- Codigo
- Cliente
- Numero NFE
- Data
- Horario
- Faturamento
- Oferta Ativa
- Importar arquivo

Regras atuais:

- Numero NFE aceita apenas numeros.
- Data e horario podem resetar para o momento atual de Brasilia ao limpar.
- Horario usa input time.
- Faturamento aceita formato monetario em reais.
- Oferta Ativa e um toggle com label Sim/Nao.
- Importar arquivo aceita apenas .xlsx.
- Pode aceitar multiplos arquivos, respeitando limites definidos no JS:
  - maximo de 10 arquivos;
  - maximo de 25 MB por arquivo;
  - maximo de 100 MB total.

O card de Registro foi unificado visualmente: Dados da Nota Fiscal e Importar Arquivo ficaram no mesmo card.

O drag to drop deve ser grande e visualmente integrado ao tema azul do Sistemas.

Nao voltar o importador para verde ou para outro tema estranho. O usuario reclamou disso antes.


11. PAGINA SISTEMAS - HISTORICO
===============================

Local:

site.html, bloco com id:

page-historico

Funcao:

Mostrar os registros cadastrados/simulados.

Colunas atuais:

- Data
- Horario
- NFE
- Cliente
- Faturamento
- Oferta Ativa
- Acoes

Importante:

O Historico deve ser baseado no Registro. Portanto, nesta pagina nao deve aparecer:

- Produto
- Preco unitario
- Quantidade

Esses campos pertencem a outras ideias antigas e foram removidos da visualizacao atual do Historico.

Comportamento do filtro:

- Campo de busca nao filtra automaticamente.
- Seletor de mes/ano nao filtra automaticamente.
- O botao Atualizar aplica o filtro.
- O botao Limpar limpa busca, mes/ano e volta a mostrar todos os registros.

Cores/textos atuais:

- Data, Horario e NFE estao em branco, sem alterar fonte/peso.
- Codigo abaixo do nome do Cliente esta em #9cb3d9.
- O texto de codigo abaixo do cliente deve continuar menor que o nome.
- O codigo abaixo do cliente pode continuar como esta.

Layout:

- Linhas do Historico foram reduzidas para 52px.
- A coluna Cliente deve ser a area que comprime quando a sidebar expande, para evitar que botoes de acoes quebrem.
- O titulo ACOES deve ficar alinhado com o inicio do botao Editar.
- Os botoes de acoes devem ficar proximos da direita, mas sem empilhar.


12. PAGINA SISTEMAS - CADASTRO
==============================

Local:

site.html, bloco com id:

page-cadastro

Funcao:

Gerenciar visualmente clientes e produtos.

Abas:

- Clientes
- Produtos

Clientes:

Colunas:

- Codigo
- Nome
- Acoes

Produtos:

Colunas:

- Codigo
- Nome
- Preco Unit.
- Acoes

Regras visuais atuais:

- Linhas de Clientes e Produtos tem 47px.
- Codigos da pagina Cadastro estao brancos.
- Codigos devem ter tamanho/estilo igual aos valores de NFE do Historico.
- Titulo ACOES deve alinhar com o inicio do botao Editar.
- Botoes de acoes da pagina Cadastro devem ficar na mesma posicao visual dos botoes da pagina Historico.
- Preco Unitario em Produtos foi puxado mais para a esquerda, com deslocamento visual de aproximadamente 15px em CSS.

Nao alterar fonte ou colocar negrito nos codigos sem pedido. O usuario rejeitou quando a cor foi ajustada junto com peso/fonte.


13. MODAIS DO SISTEMAS
======================

Existem modais em site.html:

- modal-venda
- modal-cliente
- modal-produto
- modal-confirm

modal-venda:

Edita registro do Historico. Atualmente deve refletir os campos do Registro:

- Data
- Horario
- NFE
- Cod. Cliente
- Nome Cliente
- Faturamento
- Oferta Ativa

Nao voltar campos antigos de produto, quantidade ou preco unitario neste modal de registro, a menos que o usuario peca.

modal-cliente:

- Codigo
- Nome

modal-produto:

- Codigo
- Nome
- Preco Unitario

modal-confirm:

Usado para confirmar exclusao.


14. AREA DASHBOARD
==================

As paginas do Dashboard ficam em dashboard/.

Cada modulo tem:

- HTML
- CSS
- JS

O site.html carrega os dashboards em iframes.

Paginas:

- dashboard/painel-geral/
- dashboard/vendas/
- dashboard/clientes/
- dashboard/produtos/
- dashboard/historico/

O Dashboard tem tema escuro, mais proximo de azul profundo/preto, com imagem de fundo.


15. DASHBOARD - PAINEL GERAL
============================

Arquivos:

dashboard/painel-geral/painel-geral.html
dashboard/painel-geral/painel-geral.css
dashboard/painel-geral/painel-geral.js

Principais cards/areas:

- HOJE
- MES
- RITMO DE ATINGIMENTO
- PROGRESSO DA META
- PERIODO DE INATIVIDADE
- RELATORIO DE CUMPRIMENTO

Card MES:

Possui mini quadrantes rotativos. Existem cinco ideias:

- TICKET MEDIO
- OFERTA ATIVA
- RESUMO
- DIAS UTEIS
- STATUS DE CLIENTES

O STATUS DE CLIENTES foi criado baseado no visual de DIAS UTEIS.

Mini quadrantes:

- devem ter dinamica suave tipo opcao testada no antigo arquivo TESTE;
- a bolinha/titulo deve manter alinhamento padronizado;
- textos devem seguir visibilidade do quadrante RESUMO.

Card RITMO DE ATINGIMENTO:

- Tem abas DIA, SEMANA, QUINZENA, MES.
- Tem barra de meta/projecao.
- Existe brilho leve baseado na cor da barra.
- O brilho deve ser visivel mas nao exagerado.
- Nao deve ter faixa andando de um lado para o outro se o usuario pedir brilho global.

Card PROGRESSO DA META:

- Titulo em maiusculo.
- Valor de faturamento maior que antes.
- Texto Meta/Resta ajustado.
- Houve tentativa de liquido, mas o usuario rejeitou. Se mexer nisso, cuidado: ele quer realismo, nao efeito artificial.

Card PERIODO DE INATIVIDADE:

Substituiu o antigo card METAS.

Possui abas:

- 3 DIAS
- QUINZENA
- 1 MES
- 3 MESES
- ILIMITADO

Tabela:

- Cliente
- Nome
- Contagem

Regras:

- lista ordenada por menor contagem para maior, exceto 3 DIAS que e exatamente 3;
- ao trocar aba, scroll volta para o topo;
- houve etapa com redimensionamento/reordenacao manual de colunas, depois travado;
- texto de contagem deve ter mesma cor do nome;
- linhas pares/impares e bordas foram refinadas.


16. DASHBOARD - VENDAS
======================

Arquivos:

dashboard/vendas/vendas.html
dashboard/vendas/vendas.css
dashboard/vendas/vendas.js

Estado visual:

Pagina considerada pronta pelo usuario em uma etapa anterior.

Cards principais:

- FLUXO MENSAL
- JANELAS DE VENDA
- OFERTA ATIVA
- QUINZENA MAIS FORTE
- QUANTIDADE DE VENDAS POR DIA

FLUXO MENSAL:

- Grafico de linha mensal JAN a DEZ.
- Botoes Faturamento e Ticket.
- Eixo X com meses.
- Eixo Y com valores.
- Para meses futuros/sem dados, o grafico deve manter espaco e nao preencher com valores.
- A linha pode ser revelada por uma luz que percorre o caminho.
- Bolinhas do grafico ficam invisiveis e aparecem ao aproximar o mouse.
- Bolinhas tambem podem piscar periodicamente de forma suave.
- Meses que batem meta usam cor verde; meses que nao batem usam vermelho.
- A linha pontilhada amarela foi removida.

JANELAS DE VENDA:

- Grafico de colunas com efeito de agua/liquido.
- As colunas variam conforme valor.
- A superficie superior da coluna e animada, liquida, suave.
- Ao passar mouse, coluna expande e mostra informacoes internas.
- Valores externos ficam proximos da superficie da coluna.
- Esse efeito foi refinado varias vezes para evitar flicker.

OFERTA ATIVA:

- Card com meses.
- Modo normal e extended.
- Cores seguem azul forte para SIM e cinza para NAO.
- Mes atual deve ser destacado conforme mes vindo do Painel Geral, nao fixo arbitrario.
- Meses futuros/sem dados aparecem apagados com asterisco.

QUINZENA MAIS FORTE:

- Grafico por mes.
- Uma coluna composta por 1a quinzena e 2a quinzena empilhadas.
- Foi discutida ideia de divisoria liquida entre as quinzenas, como agua e oleo, sem espaco vazio.
- Laterais nao devem se mexer; apenas divisoria interna.

QUANTIDADE DE VENDAS POR DIA:

- Card semelhante a JANELAS DE VENDA.
- Atualmente sem sabado/domingo por padrao, mas com possibilidade futura de aparecerem.
- Colunas devem ter altura inteligente para valores pequenos ainda serem visiveis.


17. DASHBOARD - CLIENTES
========================

Arquivos:

dashboard/clientes/clientes.html
dashboard/clientes/clientes.css
dashboard/clientes/clientes.js

Cards principais:

- RANKING
- QUANTIDADE DE CLIENTES NOVOS
- LISTA DE VENDAS com visores

RANKING:

- Inspirado no card JANELAS DE VENDA.
- Possui botoes Faturamento e NFE.
- Visual com colunas liquidas.
- Ranking de top 10 clientes.
- No modo Faturamento, valor em cima e NFE dentro.
- No modo NFE, coluna se baseia no valor medio de faturamento por NFE, nao na quantidade total de NFE.
- Em NFE, dentro da coluna aparece NFE e media, sem valor total.
- Ao hover, coluna expande lateralmente e outras perdem cor.
- Nome longo de cliente deve ser truncado com reticencias.
- NUTRIOIL INDUSTRIA E COMERCIO DE GORDURAS E FARINHAS LTDA foi usado como nome extremo para teste.
- O extended ja passou por varios ajustes; nao aumentar exageradamente.

QUANTIDADE DE CLIENTES NOVOS:

- Card com 12 quadrados, 3 linhas por 4 colunas.
- Cada quadrado representa um mes.
- Todos os quadrados seguem cor do quadrado MAR, sem destaque de borda chamativo.
- Valor da quantidade usa #3b82f6.
- Texto de posicao tipo #1 de 12 precisa ser visivel.
- Existe uma faixa/luz unica passando pelos quadrados, com comportamento refinado:
  - deve parecer uma unica faixa sincronizada;
  - faixa so aparece dentro dos quadrados;
  - cor padrao azul escura ajustada;
  - maior mes usa brilho dourado dentro do proprio quadrado;
  - menor mes usa brilho avermelhado dentro do proprio quadrado;
  - brilho da legenda tambem existe com quadradinhos pequenos.

LISTA DE VENDAS:

Foi unificada com VISOR em um unico card.

Tem visores/resumos na parte superior:

- Faturamento
- Ticket Medio
- Quantidade de NFE
- Quantidade de Produto
- Quantidade de Produto p/ Unidade
- Produto de Maior Valor
- Faturamento p/ Oferta Ativa

Tabela:

- varias colunas, incluindo Cidade, Produto, Descricao, Oferta Ativa etc.
- O usuario teve uma fase de ajuste manual de colunas.
- Fonte da lista foi aumentada varias vezes.
- Linhas pares/impares foram refinadas.
- Oferta Ativa usa simbolos escolhidos visualmente.

Produto de Maior Valor:

- Ao hover, o visor desliza e mostra Nome do Produto.
- O nome completo deve aparecer em tooltip quando cortado.
- Nome usado para teste: Conjunto estrutural reforcado.


18. BOTAO IA / MENSAGEIRO
=========================

Local principal:

site.html para HTML.
sistema/css/sistema.css para visual.
Provavelmente sistema/js/sistema.js ou script inline/ligado em site.html para logica, dependendo do trecho atual.

O botao IA aparece flutuante em todas as paginas.

Ele foi inspirado no botao da Intercom, mas desenhado por codigo.

Regras atuais:

- Botao fixo, nao arrastavel.
- Circulo do Dashboard usa tema escuro.
- Circulo no Sistemas usa #0e3d9e.
- Tem brilho branco em volta.
- Ao hover, expande levemente sem desfocar icone ou numero.
- Ao abrir, sempre deve iniciar na pagina Atendimento.
- O painel tem cerca de 400px de largura e 700px de altura.
- Fundo do painel no Dashboard e #0e1729.
- No Sistemas, o painel adapta cores para tema azul.
- A sombra preta ao redor do painel foi removida.

Abas internas:

- Inicio
- Atendimento
- Notificacao

Sidebar interna do botao IA:

- Fica na parte inferior do painel.
- Icones vazados no normal e preenchidos/ativos no hover/selecionado.
- Bolinhas vermelhas indicam conteudo nao lido.

Contador do botao:

- Conta somente nao lidos de Atendimento.
- Se nao houver Atendimento nao lido, mas houver Inicio ou Notificacao, aparece bolinha vermelha sem numero.


19. BOTAO IA - ATENDIMENTO
==========================

Pagina Atendimento:

- Lista mensagens estilo Outlook/Intercom.
- Mensagens com 80px de altura quando fechadas.
- Ao abrir, expandem suavemente para baixo.
- Abertura e fechamento devem ter transicao visivel, nao instantanea.
- Cada mensagem tem avatar circular com iniciais.
- Cores das iniciais devem ser persistentes por nome.
- Siglas sao nome + sobrenome; se tiver um nome so, usa a primeira letra.
- Datas seguem regra:
  - mesma semana: Seg, Ter, Qua, Qui, Sex, Sab, Dom;
  - domingo inicia a semana;
  - fora da semana: formato com data;
  - muito antigo: data completa.

Estados:

- nao lida;
- respondida;
- fixada;
- lixeira.

Mensagens nao lidas:

- tem marcador lateral branco levemente escurecido;
- texto mais destacado enquanto nao lida;
- ao abrir, deve ficar com cor normal.

Acoes ao hover:

- marcar como nao lido;
- marcar como respondido;
- fixar;
- lixeira.

Icones:

- devem ser vazados no normal;
- preencher quando hover;
- lixeira deve preencher sem deformar o desenho;
- respondido fica verde quando ativo;
- fixado fica azul claro quando ativo.

Categorias:

- Mensagens fixadas aparecem acima.
- Este mes aparece so quando existir conteudo que justifique.
- Meses anteriores aparecem por nome.
- Depois de 3 meses, entra Mais Antigos.
- Categorias podem recolher/expandir com seta.
- Barra de categoria usa cor #0d1526.

Atendimento tem:

- Principal
- Lixeira

Na Lixeira:

- mensagens preservam estado de nao lida/respondida/fixada;
- existe icone para restaurar para Principal.


20. BOTAO IA - NOTIFICACAO
==========================

Pagina Notificacao:

Mostra cards de informacoes do Dashboard/Sistemas.

Cada card:

- tem area visual superior;
- tag Dashboard ou Sistemas;
- tipo: INFO, ATENCAO, RISCO, META BATIDA;
- data/hora formatada;
- titulo;
- resumo;
- conteudo detalhado ao abrir;
- X para remover, que aparece apenas quando mouse chega perto.

Regras visuais:

- Retangulo principal das informacoes deve ser escuro no tema Dashboard.
- No modo Sistemas, os visores Dashboard/Sistemas usam cores conforme tema correto.
- A tag Dashboard no painel Sistemas deve manter visual de Dashboard mais escuro.
- Tags ATENCAO/RISCO/INFO/META BATIDA mantem cores proprias, mesmo no tema Sistemas.
- Horarios devem ter nitidez igual ao texto principal, especialmente no modo Sistemas.
- Cards nao lidos tem marcador estilo fita de livro no topo esquerdo, cor #213661.
- Cards nao lidos tambem passam luz a cada 5 segundos.
- Ao clicar no card, ele expande suavemente para mostrar conteudo completo.

Se nao houver notificacoes:

Mostrar texto central:

Nenhuma informacao no momento.


21. BOTAO IA - INICIO
=====================

Pagina Inicio:

Foi simplificada. Nao deve ter:

- saudacao "Ola, como podemos ajudar?";
- card "Faca uma pergunta";
- circulos/fotos no topo;
- bolinhas vermelhas nos cards.

Ela deve mostrar cards explicativos:

- Dashboard
- Sistemas
- Mini IA
- Supabase

Cada card tem imagem/area visual e texto explicativo.

Ao clicar em um card:

- a tela desliza para a esquerda;
- aparece pagina de detalhe;
- botao voltar fica no topo esquerdo, alinhado com o titulo;
- ao voltar, desliza para a direita.

Logo do topo:

Foi substituida pela imagem assets/logo-quadrado.png quando necessario, mas depois alguns elementos foram removidos. Ver estado atual antes de mexer.


22. SIDEBAR
===========

Existe uma sidebar principal no site.html e sistema.css.

Modos:

- Sistemas
- Dashboard

Comportamento:

- expande com hover;
- recolhe ao sair;
- main muda padding-left;
- cards nao devem ser sobrepostos pela sidebar;
- no Dashboard existe orbit animada na borda.

Pontos sensiveis:

- usuario percebe quando a sidebar esta com baixo FPS;
- usuario nao quer remover orbit/luz;
- usuario quer orbit fluida;
- usuario nao quer que orbit resete visualmente ao expandir/recolher;
- usuario nao quer que cards sejam cobertos pela sidebar.

Se for mexer:

- testar visualmente se possivel;
- nao alterar orbita sem pedido;
- evitar animar muitas propriedades caras ao mesmo tempo;
- nao aplicar transformacoes que criem distancia variavel entre sidebar e cards.


23. ORBIT DA SIDEBAR DO DASHBOARD
=================================

A orbit fica na sidebar do Dashboard.

Ela ja passou por muitos ajustes.

Caracteristicas desejadas:

- duas luzes;
- cor suave/azulada ligada ao glow da logo;
- neon/brilho, nao solido puro;
- anda na borda da sidebar;
- curva suave;
- tamanho e grossura ajustados manualmente pelo usuario em alguns momentos;
- nao deve parecer que entra para dentro da sidebar;
- nao deve sumir em curva;
- nao deve resetar bruscamente ao expandir/recolher.

Atualmente parte da orbit e controlada por JS em app/js/navigation.js.

Nao remover pathLength dos rects se existir.


24. BACKGROUNDS E ESPACAMENTOS
==============================

Dashboard:

- distancia topo/fundo foi ajustada para 75px;
- sidebar tambem usa top/bottom 75px no modo Dashboard;
- cards devem respeitar essa margem;
- fundo usa assets/img/dashboard-bg.png.

Sistemas:

- cards devem alinhar com sidebar;
- distancia horizontal dos cards para sidebar deve acompanhar padrao do Dashboard;
- cards do Sistemas sao solidos em #2d63b7;
- borda dos cards do Sistemas foi ajustada para parecer com curvatura dos cards do Dashboard.


25. SUPABASE FUTURO
===================

O Supabase ainda nao deve ser ativado como dependencia visual.

Mas a ideia futura:

- clientes reais;
- produtos reais;
- registros/faturamento;
- historico;
- dashboards com dados reais;
- mensagens/IA/notificacoes automáticas;
- feriados para calculo de dias uteis/inatividade;
- metas e periodos.

Tabelas citadas/provaveis:

- clientes
- produtos
- faturamento_itens

Possiveis campos:

clientes:

- id
- codigo
- nome

produtos:

- id
- codigo
- nome
- preco_unitario

faturamento_itens ou tabela equivalente de registro:

- id
- data
- hora
- num_nf
- cod_cliente
- nome_cliente
- faturamento
- oferta_ativa
- arquivos importados

Importante:

Nao colocar chave secreta no frontend.
Chave anon/publica pode existir, mas a seguranca real deve vir de RLS e politicas.


26. REGRAS DE TRABALHO PARA OUTRA IA
====================================

Ao trabalhar neste projeto:

1. Sempre editar somente a pasta local Projeto Caio, a menos que o usuario peca outra coisa.
2. Nao usar Git, hosting ou Supabase sem pedido claro.
3. Nao mudar varias areas ao mesmo tempo se o pedido for pequeno.
4. Se mexer em CSS/JS carregado por site.html, atualizar cache ?v= no site.html.
5. Se mexer em JS, validar com:

   node --check sistema\js\sistema.js

   ou o JS correspondente.

6. Nao alterar fonte/peso quando o usuario pedir apenas cor.
7. Nao transformar "mais branco" em branco puro, a menos que ele peca "branco".
8. Nao substituir design existente por design novo sem pedido.
9. Nao remover orbit, brilho, dinamicas ou IA que ja foram aprovadas.
10. Antes de mexer em algo visual sensivel, entender o padrao ja existente.


27. COISAS QUE O USUARIO NAO GOSTOU ANTES
=========================================

Evitar repetir:

- mudar demais quando ele pede ajuste pequeno;
- testar por imagem parada e achar que resolveu animacao;
- alterar fonte/peso junto com cor;
- usar cores verdes fora do tema em botoes principais;
- criar gradientes/cores que nao pertencem ao tema;
- fazer sidebar ou orbit resetar/travar;
- aumentar cards/colunas sem respeitar espaçamento anterior;
- criar botoes ou cards com texto quebrando linha;
- entregar efeito visual "quase" sem refinar quando ele pediu perfeicao.


28. COISAS QUE O USUARIO VALORIZA
=================================

- Visual limpo, profissional e coerente.
- Padrao entre paginas.
- Cards alinhados perfeitamente.
- Espaçamentos exatos.
- Cores do tema respeitadas.
- Animacoes fluidas.
- Sem flicker.
- Sem sobreposicao.
- Sem textos quebrados.
- Sidebar responsiva e suave.
- Botao IA funcional e bonito.
- Tabelas legiveis.
- Dados visuais coerentes ate o banco chegar.


29. CHECKLIST ANTES DE FINALIZAR ALTERACAO
==========================================

Para alteracoes de CSS:

- O arquivo correto e sistema/css/sistema.css ou CSS do dashboard especifico?
- Precisa atualizar ?v= no HTML?
- A mudanca afeta Dashboard e Sistemas ao mesmo tempo?
- A mudanca nao alterou fonte/peso sem pedido?
- O espacamento anterior foi preservado?

Para alteracoes de JS:

- Rodar node --check no arquivo.
- Ver se ids do HTML ainda batem com getElementById.
- Ver se nao sobrou callback automatico indesejado.
- Ver se os dados demo continuam carregando sem token.

Para tabelas:

- Linhas nao devem ficar gordas quando a sidebar abre.
- Botoes de acoes nao devem empilhar.
- Titulos devem alinhar com o inicio da informacao abaixo.
- Texto longo deve truncar com reticencias se necessario.


30. ESTADO FINAL DESTA ETAPA
============================

Nesta etapa mais recente:

- O arquivo README.md foi renomeado para RESUMO.md.
- Este arquivo COMPLETO.txt foi criado para documentacao profunda.
- A coluna Preco Unit. em Cadastro > Produtos foi puxada mais para a esquerda.
- O cache do CSS no site.html foi atualizado.

O projeto continua local, visual e funcional para desenvolvimento, com dados demo e sem depender de banco real.
