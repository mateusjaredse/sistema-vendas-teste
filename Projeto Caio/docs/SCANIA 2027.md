# SCANIA 2027

## Mapa completo de desenvolvimento, seguranca, compliance e LGPD

Este documento e um guia completo para transformar o projeto atual em uma plataforma profissional, segura, auditavel e preparada para requisitos de compliance, LGPD, controle de acesso, autenticacao em duas etapas e boas praticas de seguranca.

A ideia e que este arquivo possa ser entregue para uma IA, desenvolvedor ou equipe tecnica e que essa pessoa consiga entender exatamente o que precisa ser construido, por que precisa ser construido e em qual ordem.

Este documento nao substitui uma validacao juridica feita por advogado, DPO ou consultor especializado em LGPD. Ele serve como mapa tecnico, funcional e operacional para preparar o sistema da melhor forma possivel.

---

# 1. Objetivo principal do projeto

O objetivo e evoluir o sistema atual para uma plataforma com tres perfis principais:

1. **Funcionario**
2. **Gerente**
3. **Admin**

Cada perfil tera permissoes, telas, dados e responsabilidades diferentes.

O sistema atual possui paginas de `Dashboard` e `Sistemas`, com lancamento de registros, importacao de arquivos, historico, clientes, metas, vendas, produtos, funil, inatividade e relatorios. A nova versao deve manter tudo que ja existe, mas adicionar uma camada forte de:

- seguranca;
- controle de acesso;
- separacao de dados por usuario;
- auditoria;
- LGPD;
- validacao de acesso;
- autenticacao em duas etapas;
- logs;
- painel administrativo;
- painel gerencial;
- rastreabilidade;
- ambiente profissional de hospedagem;
- protecao contra ataques comuns;
- documentacao operacional.

O sistema deve ser pensado como ferramenta empresarial real, nao apenas um dashboard visual.

---

# 2. Interpretacao das exigencias do cliente

O cliente enviou mensagens como:

```text
com ferramenta que atende ao complice
Lei proteção de dados
validação de acesso
duas etapas e etc
preciso saber essas info dessa ferramenta
```

A palavra "complice" provavelmente significa **compliance**.

Traduzindo para linguagem tecnica:

| Mensagem do cliente | Significado real | O que o sistema precisa entregar |
|---|---|---|
| Ferramenta que atende ao compliance | Sistema com regras, seguranca, controle e rastreabilidade | Permissoes, logs, auditoria, processos e documentacao |
| Lei de protecao de dados | LGPD | Tratamento correto de dados pessoais, finalidade, seguranca, minimizacao e resposta a incidentes |
| Validacao de acesso | Controle de quem entra e o que pode fazer | Login individual, perfis, RLS, bloqueios e permissoes |
| Duas etapas | MFA/2FA | Senha + codigo por app autenticador ou outro fator |
| Saber essas informacoes | Quer garantias e explicacao clara | Documento tecnico, plano de seguranca e matriz de permissao |

Resposta profissional esperada:

```text
Sim, a ferramenta pode ser estruturada para atender boas praticas de compliance, LGPD, validacao de acesso e autenticacao em duas etapas.

A estrutura sera feita com login individual, autenticacao em duas etapas, controle de acesso por perfil, regras de seguranca diretamente no banco de dados, auditoria das acoes, logs de importacao/exclusao/edicao, protecao dos arquivos e documentacao de privacidade e seguranca.

A parte tecnica sera implementada dentro da aplicacao, do Supabase e da hospedagem segura. A validacao juridica final da LGPD deve ser feita com profissional especializado, mas a ferramenta sera preparada tecnicamente para esse padrao.
```

---

# 3. Ideia central dos perfis

## 3.1 Funcionario

O funcionario e o usuario operacional.

Ele deve conseguir usar o sistema do mesmo jeito que o projeto funciona hoje, mas apenas para os dados dele.

O dashboard atual sera exclusivo do funcionario.

O funcionario deve conseguir:

- fazer login;
- usar autenticacao em duas etapas, se exigido;
- acessar o dashboard dele;
- cadastrar registros;
- importar arquivos, se autorizado;
- excluir ou editar registros dele, se permitido;
- cadastrar clientes dele, se permitido;
- cadastrar metas dele, se permitido;
- visualizar historico dele;
- visualizar vendas dele;
- visualizar produtos dele;
- visualizar periodo de inatividade dos clientes relacionados a ele;
- visualizar metas, ritmo e progresso apenas dele;
- visualizar listas, rankings e relatorios baseados somente nas informacoes dele.

O funcionario nao deve conseguir:

- ver dados de outros funcionarios;
- editar dados de outros funcionarios;
- excluir dados de outros funcionarios;
- ver auditoria global;
- alterar permissoes;
- criar usuarios;
- acessar dashboard do gerente;
- acessar dashboard administrativo;
- baixar arquivos importados por outros, salvo se o admin permitir;
- acessar tabelas diretamente sem regra de seguranca.

## 3.2 Gerente

O gerente e o usuario de acompanhamento.

Ele tera um dashboard diferente do funcionario.

O objetivo do gerente e comparar funcionarios, visualizar desempenho, acompanhar produtividade, metas, registros, funil, importacoes, qualidade dos dados e movimentacao comercial.

O gerente deve conseguir:

- acessar dashboard gerencial;
- visualizar comparativos entre funcionarios;
- visualizar quais funcionarios registraram mais vendas;
- visualizar quais funcionarios geraram mais faturamento;
- visualizar quantidade de NFEs por funcionario;
- visualizar metas por funcionario;
- comparar conversao por funcionario;
- visualizar inatividade por carteira ou funcionario;
- visualizar arquivos importados por funcionario;
- visualizar alertas de divergencia;
- visualizar historico dos funcionarios sob gestao dele;
- filtrar por funcionario, mes, ano, data e status;
- visualizar logs resumidos;
- exportar relatorios, se permitido.

O gerente nao deve conseguir, por padrao:

- alterar permissoes globais;
- criar admin;
- acessar configuracoes sensiveis;
- usar chave de servico;
- apagar registros de todos sem controle;
- alterar RLS;
- ver dados fora do escopo dele, caso exista mais de uma equipe.

## 3.3 Admin

O admin e o usuario com controle total do sistema.

Ele deve conseguir:

- visualizar tudo;
- cadastrar funcionarios;
- cadastrar gerentes;
- criar outros admins, se permitido;
- ativar/desativar usuarios;
- resetar senha;
- exigir MFA;
- alterar perfil de acesso;
- visualizar todos os dashboards;
- visualizar todos os dados;
- acessar auditoria completa;
- acessar logs de seguranca;
- visualizar importacoes;
- excluir registros, com confirmacao e auditoria;
- restaurar ou corrigir dados, quando possivel;
- configurar metas;
- configurar feriados;
- configurar politicas do sistema;
- visualizar falhas de login;
- visualizar tentativas de acesso negado;
- baixar relatorios de auditoria;
- administrar ambiente.

O admin deve ter MFA obrigatorio.

---

# 4. Nova estrutura de paginas

O projeto atual possui areas importantes:

- Login;
- Sistema;
- Registro;
- Historico;
- Cadastro;
- Dashboard;
- Painel Geral;
- Vendas;
- Clientes;
- Produtos;
- Historico do Dashboard;
- Botao IA;
- Importacao de arquivos;
- Metas;
- Conversao;
- Inatividade.

A nova estrutura deve organizar isso por perfil.

## 4.1 Paginas do Funcionario

O funcionario deve ver:

1. Login
2. Painel Geral dele
3. Vendas dele
4. Clientes dele
5. Produtos dele
6. Historico dele
7. Registro
8. Cadastro permitido
9. Arquivos importados por ele
10. Notificacoes dele

O dashboard visual atual deve continuar sendo a base do funcionario.

## 4.2 Paginas do Gerente

O gerente deve ter um dashboard novo.

Sugestao de paginas:

1. Painel Gerencial
2. Comparativo de Funcionarios
3. Ranking de Funcionarios
4. Producao por Funcionario
5. Conversao por Funcionario
6. Metas por Funcionario
7. Alertas e Divergencias
8. Arquivos Importados
9. Auditoria Resumida
10. Relatorios

### 4.2.1 Painel Gerencial

Cards sugeridos:

- Faturamento total da equipe;
- Faturamento por funcionario;
- Meta da equipe;
- Percentual de atingimento;
- Funcionario destaque do mes;
- Funcionario com menor ritmo;
- Quantidade de NFEs por funcionario;
- Quantidade de registros por funcionario;
- Conversao por funcionario;
- Clientes inativos por funcionario;
- Divergencias de importacao;
- Alertas de dados.

### 4.2.2 Comparativo de Funcionarios

Visualizacoes sugeridas:

- grafico de barras por faturamento;
- grafico de linhas por evolucao mensal;
- tabela comparativa;
- filtros por periodo;
- filtros por funcionario;
- ranking de metas batidas;
- ranking de conversao;
- ranking de novos clientes;
- ranking de quantidade de produtos vendidos.

## 4.3 Paginas do Admin

O admin deve ter um painel administrativo.

Paginas sugeridas:

1. Usuarios
2. Perfis e Permissoes
3. Auditoria Completa
4. Logs de Login
5. Logs de Arquivos
6. Configuracoes de Seguranca
7. Configuracoes de LGPD
8. Backups
9. Incidentes
10. Integracoes

### 4.3.1 Usuarios

Deve permitir:

- criar usuario;
- editar usuario;
- desativar usuario;
- definir perfil;
- definir gerente responsavel;
- exigir MFA;
- resetar senha;
- bloquear usuario;
- desbloquear usuario;
- visualizar ultimo login;
- visualizar status de MFA;
- visualizar quantidade de acoes.

### 4.3.2 Perfis e Permissoes

Deve permitir:

- visualizar matriz de permissoes;
- alterar permissoes por perfil;
- criar permissao personalizada;
- bloquear acoes criticas;
- exigir confirmacao para exclusao;
- exigir MFA para acoes sensiveis.

### 4.3.3 Auditoria Completa

Deve mostrar:

- usuario;
- acao;
- tabela;
- registro;
- antes;
- depois;
- data/hora;
- IP se disponivel;
- navegador se disponivel;
- origem da acao;
- sucesso ou erro;
- motivo de bloqueio.

---

# 5. Modelo de seguranca ideal

Seguranca deve ser feita em camadas.

Nunca confiar em apenas uma protecao.

Camadas:

1. Hospedagem segura;
2. HTTPS;
3. WAF;
4. Headers de seguranca;
5. Login;
6. MFA;
7. Sessao segura;
8. RLS no banco;
9. Permissoes por perfil;
10. Edge Functions para acoes criticas;
11. Auditoria;
12. Logs;
13. Backup;
14. Monitoramento;
15. Testes.

---

# 6. Hospedagem recomendada

## 6.1 Nao usar somente GitHub Pages em producao critica

GitHub Pages funciona para projetos simples, mas nao e a melhor opcao para um sistema empresarial com compliance.

Motivos:

- pouco controle de headers;
- sem WAF nativo avancado;
- menos controle operacional;
- menos estrutura profissional de seguranca;
- repositorio publico pode expor informacoes se mal configurado;
- nao e ideal para ambiente empresarial sensivel.

## 6.2 Melhor arquitetura sugerida

Arquitetura recomendada:

```text
GitHub privado
  |
  | deploy automatico
  v
Cloudflare Pages ou Vercel
  |
  | HTTPS + headers + WAF + dominio
  v
Frontend seguro
  |
  | supabase-js com anon key publica
  v
Supabase Auth + Supabase Database + Supabase Storage + Edge Functions
```

## 6.3 Opcao recomendada

Preferencia:

1. **Cloudflare Pages**
2. **Vercel**
3. **Netlify**
4. **Servidor proprio**, somente se houver equipe tecnica para manter

Para este projeto, a sugestao principal e:

```text
Cloudflare Pages + Cloudflare DNS + Cloudflare WAF + Supabase
```

## 6.4 Repositorio

O repositorio deve ser preferencialmente **privado**.

Se for publico:

- nao pode ter nenhuma chave secreta;
- nao pode ter dados reais;
- nao pode ter planilhas reais;
- nao pode ter SQL com dados sensiveis;
- nao pode ter service role key;
- nao pode ter credenciais;
- nao pode ter URLs internas sensiveis;
- nao pode ter backups;
- nao pode ter arquivos importados reais.

## 6.5 Variaveis de ambiente

Usar variaveis:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
```

Nunca usar no frontend:

```text
SUPABASE_SERVICE_ROLE_KEY
```

A `anon key` pode existir no frontend porque ela e publica por natureza. A seguranca real deve vir do RLS.

A `service_role` nunca pode aparecer no navegador, GitHub publico, codigo frontend ou console.

---

# 7. Estrutura de ambientes

Nunca testar tudo direto em producao.

Criar:

## 7.1 Ambiente local

Usado pelo desenvolvedor.

Pode usar:

- dados falsos;
- Supabase local;
- banco de teste;
- arquivos de teste.

## 7.2 Ambiente de homologacao

Usado para testar com cliente antes de ir para producao.

Deve ter:

- banco separado;
- usuarios de teste;
- dados ficticios ou mascarados;
- URL separada;
- WAF ativo, se possivel;
- logs ativos.

Exemplo:

```text
https://teste.sistema.com.br
```

## 7.3 Ambiente de producao

Usado pelo cliente real.

Deve ter:

- banco real;
- usuarios reais;
- MFA ativo;
- backups;
- RLS;
- logs;
- auditoria;
- monitoramento;
- dominio oficial.

Exemplo:

```text
https://app.sistema.com.br
```

---

# 8. Banco de dados e separacao por usuario

O ponto mais importante da nova versao e separar os dados por usuario.

Hoje o sistema tem tabelas como:

- `bd_principal`;
- `bd_secundario`;
- `bd_clientes`;
- `bd_conversao`;
- `bd_feriados`;
- `bd_metas`;
- `bd_metas_reais`;
- `bd_inatividade`.

Para a nova arquitetura, cada registro operacional precisa saber a qual funcionario pertence.

## 8.1 Colunas obrigatorias em tabelas operacionais

Adicionar em tabelas como `bd_principal`, `bd_secundario`, `bd_conversao`, `bd_metas`, etc:

```text
id
funcionario_id
created_by
updated_by
created_at
updated_at
```

Explicacao:

- `funcionario_id`: dono comercial do registro;
- `created_by`: usuario que criou;
- `updated_by`: ultimo usuario que alterou;
- `created_at`: quando criou;
- `updated_at`: quando alterou.

Se o usuario funcionario cria os proprios registros, geralmente:

```text
funcionario_id = auth.uid()
created_by = auth.uid()
```

Mas se admin cadastrar algo para um funcionario, pode ser:

```text
funcionario_id = id_do_funcionario
created_by = id_do_admin
```

## 8.2 Tabela de perfis

Criar tabela:

```text
profiles
```

Campos:

```text
id uuid primary key references auth.users(id)
nome text not null
email text not null
perfil text not null check (perfil in ('admin','gerente','funcionario'))
gerente_id uuid null references profiles(id)
ativo boolean default true
mfa_obrigatorio boolean default false
criado_em timestamptz default now()
atualizado_em timestamptz default now()
```

## 8.3 Como funciona gerente e funcionario

Cada funcionario pode ter um gerente.

Exemplo:

```text
Funcionario Joao -> gerente_id = Maria
Funcionario Carlos -> gerente_id = Maria
Funcionario Pedro -> gerente_id = Ana
```

Assim:

- Maria ve dados de Joao e Carlos;
- Ana ve dados de Pedro;
- Admin ve todos.

## 8.4 Funcoes auxiliares no banco

Criar funcoes:

```sql
is_admin()
is_gerente()
is_funcionario()
current_profile_id()
can_view_funcionario(funcionario_id)
can_edit_funcionario_data(funcionario_id)
require_mfa_for_admin()
```

Essas funcoes ajudam as policies RLS.

---

# 9. RLS - Row Level Security

RLS e uma das partes mais importantes.

RLS significa que o banco vai verificar se o usuario pode ou nao acessar cada linha.

## 9.1 Regras gerais

Todas as tabelas sensiveis devem ter:

```sql
alter table nome_da_tabela enable row level security;
```

Tabelas sem RLS podem vazar dados.

## 9.2 Regra para funcionario

Funcionario so ve dados dele:

```text
funcionario_id = auth.uid()
```

## 9.3 Regra para gerente

Gerente ve dados dos funcionarios ligados a ele:

```text
registro.funcionario_id pertence a algum profile onde gerente_id = auth.uid()
```

## 9.4 Regra para admin

Admin ve tudo.

## 9.5 Regras de escrita

Funcionario:

- pode inserir dados dele;
- pode editar dados dele, se permitido;
- pode excluir dados dele, se permitido;
- nao pode alterar `funcionario_id` para outro usuario.

Gerente:

- pode visualizar equipe;
- pode editar somente se regra permitir;
- normalmente nao deve excluir dado operacional sem permissao.

Admin:

- pode tudo;
- todas as acoes precisam ser auditadas.

## 9.6 Regras de MFA

Para acoes sensiveis, exigir MFA.

Exemplos de acoes sensiveis:

- excluir arquivo;
- excluir venda;
- alterar permissao;
- criar admin;
- baixar relatorio sensivel;
- editar faturamento antigo;
- alterar meta;
- desativar usuario.

No Supabase, o nivel de autenticacao pode ser verificado com claims de autenticacao. A ideia e permitir certas acoes somente quando o usuario estiver em nivel de autenticacao forte.

---

# 10. MFA / autenticacao em duas etapas

## 10.1 O que e

MFA significa Multi-Factor Authentication.

Na pratica:

```text
senha + codigo temporario
```

Exemplo:

1. Usuario digita e-mail e senha;
2. Sistema pede codigo;
3. Usuario abre app autenticador;
4. Digita codigo de 6 numeros;
5. Sistema libera acesso.

## 10.2 Quem deve usar MFA

Obrigatorio:

- Admin;
- Gerente;
- usuario que pode excluir arquivos;
- usuario que pode alterar metas;
- usuario que pode acessar auditoria.

Opcional ou recomendado:

- Funcionario.

Minha recomendacao:

```text
Admin: obrigatorio
Gerente: obrigatorio
Funcionario: recomendado, podendo ser obrigatorio se o cliente quiser
```

## 10.3 Tela de configuracao de MFA

Criar pagina:

```text
Minha Conta > Seguranca
```

Nela:

- mostrar se MFA esta ativo;
- botao para ativar;
- QR Code;
- campo para digitar codigo;
- botao confirmar;
- botao remover MFA, se permitido;
- aviso de seguranca.

## 10.4 Fluxo de primeiro login

Se usuario precisa de MFA:

1. Login com senha;
2. Verificar se MFA esta ativo;
3. Se nao estiver, obrigar cadastro;
4. Mostrar QR Code;
5. Confirmar codigo;
6. Liberar sistema.

Se usuario ja tem MFA:

1. Login com senha;
2. Pedir codigo;
3. Validar codigo;
4. Liberar sistema.

---

# 11. Auditoria

Auditoria e o registro de tudo que importa.

Sem auditoria, nao da para provar quem fez o que.

## 11.1 Criar tabela `bd_auditoria`

Campos sugeridos:

```text
id
usuario_id
usuario_email
perfil
acao
tabela
registro_id
descricao
valor_anterior
valor_novo
ip
user_agent
origem
sucesso
erro
criado_em
```

## 11.2 Acoes que precisam ser auditadas

Auditar:

- login;
- logout;
- falha de login;
- ativacao de MFA;
- remocao de MFA;
- criacao de usuario;
- alteracao de perfil;
- desativacao de usuario;
- criacao de registro;
- edicao de registro;
- exclusao de registro;
- importacao de arquivo;
- exclusao de arquivo;
- download de arquivo;
- edicao de meta;
- edicao de cliente;
- edicao de conversao;
- tentativa de acesso negado;
- alteracao de permissao;
- erro de importacao;
- divergencia de faturamento;
- exportacao de relatorio.

## 11.3 Como registrar auditoria

Existem duas formas:

### Forma 1 - Pelo frontend

O site chama uma funcao de auditoria depois de cada acao.

Problema:

- usuario malicioso poderia tentar burlar se mexer no frontend.

### Forma 2 - Pelo banco e Edge Functions

Triggers e Edge Functions registram automaticamente.

Melhor opcao.

Minha recomendacao:

```text
acoes simples: trigger no banco
acoes criticas: Edge Function + auditoria obrigatoria
```

## 11.4 Painel de auditoria

Admin deve ter tela:

```text
Admin > Auditoria
```

Filtros:

- usuario;
- perfil;
- data inicial;
- data final;
- acao;
- tabela;
- sucesso/erro;
- origem.

Colunas:

- data;
- usuario;
- perfil;
- acao;
- descricao;
- origem;
- status.

Ao clicar:

- mostrar detalhes;
- valor antigo;
- valor novo;
- IP;
- navegador.

---

# 12. Logs de seguranca

Criar uma tela separada:

```text
Admin > Seguranca
```

Mostrar:

- tentativas de login;
- falhas de senha;
- usuarios bloqueados;
- tentativas sem permissao;
- uso de MFA;
- remocao de MFA;
- troca de senha;
- sessoes ativas;
- usuarios inativos;
- acessos suspeitos.

## 12.1 Bloqueio por tentativas

Regra sugerida:

```text
5 falhas de login em 15 minutos -> bloquear temporariamente
```

Pode ser implementado com Supabase Auth, regras externas ou Edge Function.

---

# 13. Arquivos importados

O projeto importa arquivos `.csv` e `.xlsx`.

Essa parte e sensivel.

## 13.1 Regras obrigatorias

Ao importar arquivo:

- validar extensao;
- validar tamanho;
- validar estrutura;
- validar cabecalho;
- validar encoding;
- validar campos obrigatorios;
- rejeitar arquivo vazio;
- rejeitar arquivo duplicado, se necessario;
- registrar usuario;
- registrar data;
- registrar hash;
- registrar status;
- registrar erros;
- salvar arquivo original em storage privado;
- salvar dados processados no banco;
- auditar importacao.

## 13.2 Storage privado

Criar bucket:

```text
imports
```

Esse bucket deve ser privado.

Ninguem pode acessar arquivo sem login e permissao.

## 13.3 Tabela de arquivos

Criar tabela:

```text
bd_arquivos_importados
```

Campos:

```text
id
funcionario_id
uploaded_by
arquivo_nome
arquivo_path
arquivo_tipo
arquivo_tamanho
arquivo_hash
total_linhas
total_itens
total_faturamento
status
erro
criado_em
excluido_em
excluido_por
```

## 13.4 Exclusao de arquivo

Ao excluir arquivo:

1. Confirmar acao;
2. Verificar permissao;
3. Se acao for critica, exigir MFA;
4. Excluir dados vinculados ao arquivo;
5. Excluir arquivo do storage ou marcar como excluido;
6. Registrar auditoria;
7. Atualizar dashboard.

## 13.5 Download de arquivo

Ao baixar:

- verificar permissao;
- gerar URL temporaria;
- registrar auditoria;
- nunca deixar arquivo publico.

---

# 14. LGPD

LGPD exige cuidado com dados pessoais.

O sistema deve tratar dados com:

- finalidade;
- necessidade;
- seguranca;
- transparencia;
- prevencao;
- responsabilizacao.

## 14.1 Dados pessoais no projeto

Possiveis dados pessoais:

- nome de cliente;
- codigo de cliente;
- CPF/CNPJ, se existir;
- historico de compra;
- nota fiscal;
- usuario interno;
- e-mail de usuario;
- logs de acesso;
- IP;
- arquivos importados.

## 14.2 Mapa de dados

Criar documento:

```text
docs/compliance/MAPA_DE_DADOS.md
```

Conteudo:

- dado coletado;
- origem;
- finalidade;
- tabela onde fica;
- quem acessa;
- tempo de retencao;
- se e dado pessoal;
- se e dado sensivel;
- base legal sugerida;
- forma de exclusao;
- responsavel.

## 14.3 Politica de privacidade

Criar:

```text
docs/compliance/POLITICA_DE_PRIVACIDADE.md
```

Deve explicar:

- quais dados sao tratados;
- por que sao tratados;
- quem acessa;
- por quanto tempo ficam guardados;
- como pedir correcao;
- como pedir exclusao;
- como funciona seguranca;
- contato do responsavel.

## 14.4 Termo de uso

Criar:

```text
docs/compliance/TERMO_DE_USO.md
```

Deve explicar:

- regras de uso;
- proibicao de compartilhar senha;
- responsabilidade do usuario;
- registro de auditoria;
- uso correto dos dados;
- consequencias de uso indevido.

## 14.5 Plano de incidente

Criar:

```text
docs/compliance/PLANO_DE_INCIDENTE.md
```

Deve dizer:

1. Como identificar incidente;
2. Como conter;
3. Quem avisar;
4. Como investigar;
5. Como registrar;
6. Como corrigir;
7. Quando comunicar titulares ou ANPD;
8. Como evitar repeticao.

## 14.6 Retencao de dados

Definir por quanto tempo guardar:

- notas fiscais;
- arquivos importados;
- logs;
- auditoria;
- usuarios inativos;
- backups.

Exemplo:

```text
Auditoria: 5 anos
Arquivos importados: conforme contrato
Logs tecnicos: 12 meses
Usuarios inativos: conforme politica do cliente
```

Esses prazos precisam ser validados juridicamente.

---

# 15. Seguranca contra ataques

Nao existe testar 100% de todos os hacks possiveis.

O que deve ser feito:

- seguir OWASP Top 10;
- usar OWASP WSTG para testes;
- testar permissoes;
- testar uploads;
- testar autenticacao;
- testar RLS;
- testar XSS;
- testar configuracao;
- testar vazamento de dados;
- monitorar continuamente.

## 15.1 Riscos principais

| Risco | O que pode acontecer | Defesa |
|---|---|---|
| Acesso indevido | usuario ve dados de outro | RLS, perfis, MFA |
| SQL Injection | atacante manipula consulta | queries seguras, Supabase client, Edge Functions |
| XSS | script malicioso roda no navegador | CSP, sanitizacao, evitar innerHTML |
| Upload malicioso | arquivo perigoso enviado | validar tipo, tamanho, conteudo |
| Exposicao de chave | service key vazada | nunca usar service role no frontend |
| Exclusao indevida | dados apagados por erro | permissao, MFA, confirmacao, auditoria |
| Dado vazado no GitHub | informacao publica | repo privado, secret scanning |
| Falha de backup | nao recuperar dados | backup automatico e teste de restore |
| Sessao roubada | invasor usa conta | MFA, HTTPS, revalidacao |
| Configuracao errada | tabela aberta | Security Advisor, RLS em tudo |

## 15.2 Checklist OWASP simplificado

Testar:

- controle de acesso quebrado;
- falhas criptograficas;
- injecao;
- design inseguro;
- configuracao incorreta;
- componentes vulneraveis;
- falhas de autenticacao;
- falhas de integridade;
- falhas de logs;
- SSRF, se houver backend chamando URLs externas.

---

# 16. Headers de seguranca

Se usar Cloudflare Pages, criar arquivo `_headers`.

Exemplo:

```text
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Content Security Policy deve ser criada com cuidado porque o projeto usa scripts externos, fontes e Supabase.

Exemplo inicial, a ser ajustado:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; frame-ancestors 'none';
```

Observacao:

Se o projeto usa scripts inline, sera necessario ajustar com nonce ou refatorar scripts inline para arquivos `.js`.

---

# 17. Cloudflare / WAF

Se usar Cloudflare:

Ativar:

- HTTPS;
- Always Use HTTPS;
- WAF Managed Rules;
- rate limiting;
- bot fight mode, se adequado;
- cache control;
- DNS protegido;
- bloqueio por pais, se fizer sentido;
- regras para bloquear endpoints suspeitos.

Regras sugeridas:

- bloquear tentativas repetidas de login;
- bloquear uploads muito grandes;
- bloquear user agents suspeitos;
- proteger rotas administrativas;
- limitar requests para APIs sensiveis.

---

# 18. Edge Functions

Acoes criticas nao devem depender apenas do frontend.

Criar Edge Functions para:

- excluir arquivo importado;
- importar arquivo;
- criar usuario;
- alterar perfil;
- gerar relatorio sensivel;
- baixar arquivo privado;
- registrar auditoria;
- recalcular dados sensiveis;
- validar permissao com MFA.

## 18.1 Por que usar Edge Functions

Porque no frontend o usuario pode abrir DevTools e tentar manipular chamadas.

Edge Functions permitem:

- validar usuario no servidor;
- usar service role com seguranca;
- registrar auditoria;
- bloquear acao sem permissao;
- executar operacao atomica.

Importante:

Service role pode existir em Edge Function, mas nunca no frontend.

---

# 19. Controle de sessoes

O sistema deve manter usuario logado, mas com seguranca.

Sugestao:

- sessao normal persistente;
- se usuario clicar sair, encerra;
- se usuario for desativado, perde acesso;
- acoes criticas exigem revalidacao ou MFA;
- admin pode encerrar sessoes.

## 19.1 Revalidacao para acao critica

Exemplo:

Usuario esta logado ha muito tempo e tenta excluir arquivo.

Sistema deve:

1. Verificar permissao;
2. Verificar MFA;
3. Se necessario, pedir codigo novamente;
4. Executar;
5. Auditar.

---

# 20. Matriz de permissoes

## 20.1 Tabela geral

| Acao | Funcionario | Gerente | Admin |
|---|---:|---:|---:|
| Ver dashboard proprio | Sim | Sim | Sim |
| Ver dashboard da equipe | Nao | Sim | Sim |
| Ver dashboard global | Nao | Nao | Sim |
| Cadastrar registro proprio | Sim | Opcional | Sim |
| Editar registro proprio | Sim, se permitido | Opcional | Sim |
| Excluir registro proprio | Sim, se permitido | Nao por padrao | Sim |
| Ver registros de outro funcionario | Nao | Sim, se subordinado | Sim |
| Importar arquivo | Sim, se permitido | Opcional | Sim |
| Excluir arquivo | Nao ou limitado | Nao ou limitado | Sim |
| Baixar arquivo | Proprio | Equipe | Todos |
| Ver auditoria propria | Opcional | Resumida | Completa |
| Ver logs de seguranca | Nao | Nao ou resumido | Sim |
| Criar usuario | Nao | Nao | Sim |
| Alterar perfil | Nao | Nao | Sim |
| Exigir MFA | Nao | Nao | Sim |
| Alterar metas | Propria, se permitido | Equipe, se permitido | Sim |
| Ver LGPD/admin | Nao | Nao | Sim |

## 20.2 Acoes que devem exigir MFA

Obrigatorio MFA:

- excluir arquivo;
- alterar perfil;
- criar admin;
- desativar usuario;
- exportar auditoria;
- baixar arquivo sensivel;
- alterar meta geral;
- executar restauracao;
- apagar dados em massa.

---

# 21. Alteracoes no projeto atual

## 21.1 Login

Adicionar:

- tela de MFA;
- fluxo de configuracao de MFA;
- aviso para usuario sem MFA obrigatorio;
- tratamento de usuario desativado;
- mensagem de permissao negada;
- redirecionamento por perfil.

Fluxo:

```text
Login
  -> Verifica usuario
  -> Verifica perfil
  -> Verifica ativo
  -> Verifica MFA obrigatorio
  -> Redireciona:
      funcionario -> Dashboard atual
      gerente -> Dashboard gerencial
      admin -> Painel admin
```

## 21.2 Site principal

Hoje o site alterna entre `SISTEMAS` e `DASHBOARD`.

Na nova versao:

- funcionario ve Sistema e Dashboard dele;
- gerente ve Dashboard Gerencial e alguns relatorios;
- admin ve Sistema, Dashboard, Gerencial e Admin.

Menus devem ser gerados conforme permissao.

Nao basta esconder no CSS.

O JS deve perguntar ao Supabase o perfil do usuario e montar o menu.

Mesmo assim, o banco deve bloquear caso usuario tente acessar manualmente.

## 21.3 Dashboard atual

Adicionar filtro invisivel por funcionario:

```text
funcionario_id = usuario logado
```

Para funcionario:

- tudo busca somente dados dele.

Para admin:

- pode escolher funcionario ou todos.

Para gerente:

- pode escolher funcionarios da equipe.

## 21.4 Registro

Quando cadastrar:

- preencher `funcionario_id`;
- preencher `created_by`;
- auditar;
- atualizar dashboards em tempo real.

## 21.5 Historico

Funcionario:

- ve apenas registros dele.

Gerente:

- ve registros dos funcionarios dele.

Admin:

- ve todos.

## 21.6 Cadastro

Clientes:

- podem ser globais ou por funcionario.

Decisao necessaria:

1. Clientes globais: todos veem os mesmos clientes;
2. Clientes por funcionario: cada funcionario tem carteira propria.

Minha sugestao:

```text
bd_clientes global com permissao de leitura controlada
relacao cliente_funcionario para carteira
```

## 21.7 Arquivos

Cada arquivo deve ter:

```text
uploaded_by
funcionario_id
```

Admin ve todos.

Gerente ve arquivos da equipe.

Funcionario ve arquivos dele.

---

# 22. Dashboard Gerencial

Criar novo modulo:

```text
dashboard/gerencial/
  gerencial.html
  gerencial.css
  gerencial.js
```

## 22.1 Cards do Dashboard Gerencial

### Card 1 - Faturamento da equipe

Mostra:

- faturamento total;
- meta total;
- percentual atingido;
- comparativo com mes anterior.

### Card 2 - Ranking de funcionarios

Mostra:

- funcionario;
- faturamento;
- quantidade de NFE;
- ticket medio;
- meta;
- percentual.

### Card 3 - Conversao por funcionario

Mostra:

- conversados;
- orcaram;
- geraram NFE;
- perdidos;
- percentual de conversao.

### Card 4 - Registros por funcionario

Mostra:

- quantidade de registros;
- quantidade de arquivos;
- quantidade de edicoes;
- quantidade de exclusoes.

### Card 5 - Alertas

Mostra:

- funcionario sem lancamento hoje;
- meta em risco;
- divergencia de faturamento;
- arquivo com erro;
- cliente com alta inatividade;
- tentativa de acesso negado.

### Card 6 - Comparativo mensal

Mostra:

- funcionarios lado a lado;
- evolucao por mes;
- metas batidas;
- queda ou crescimento.

## 22.2 Filtros

Filtros:

- periodo;
- funcionario;
- equipe;
- mes;
- ano;
- status de meta;
- tipo de registro.

---

# 23. Painel Admin

Criar:

```text
admin/
  admin.html
  admin.css
  admin.js
```

Ou dentro do site atual como pagina:

```text
page-admin
```

## 23.1 Paginas Admin

### Usuarios

CRUD completo de usuarios.

### Perfis

Matriz de permissao.

### Auditoria

Logs completos.

### Seguranca

MFA, sessoes, falhas de login.

### Arquivos

Todos os arquivos importados.

### LGPD

Documentos, mapa de dados, pedidos de titulares.

### Configuracoes

Parametros do sistema.

---

# 24. Banco de dados sugerido

## 24.1 Tabelas novas

Criar:

```text
profiles
bd_auditoria
bd_arquivos_importados
bd_permissoes
bd_sessoes
bd_logs_seguranca
bd_incidentes
bd_lgpd_solicitacoes
bd_cliente_funcionario
```

## 24.2 Tabelas existentes a ajustar

Adicionar colunas de dono:

```text
bd_principal
bd_secundario
bd_conversao
bd_metas
bd_metas_reais
bd_inatividade
```

Colunas:

```text
funcionario_id
created_by
updated_by
```

## 24.3 Cuidado com tabelas globais

Algumas tabelas podem ser globais:

- `bd_feriados`;
- configuracoes gerais;
- talvez `bd_clientes`, dependendo da regra.

Mesmo globais, precisam de RLS.

---

# 25. Realtime

O projeto deve atualizar dados sem precisar atualizar pagina.

Usar Supabase Realtime com cuidado.

## 25.1 Onde usar

- dashboard funcionario;
- dashboard gerente;
- alertas;
- importacoes;
- metas;
- auditoria em tempo real para admin.

## 25.2 Cuidado

Realtime nao pode vazar dados.

Se usuario funcionario assina canal de tabela, RLS precisa garantir que ele receba somente dados permitidos.

---

# 26. Backup e recuperacao

## 26.1 Backup

Configurar:

- backup automatico do Supabase;
- backup antes de migracoes grandes;
- backup antes de alterar RLS;
- backup antes de apagar dados em massa.

## 26.2 Teste de restauracao

Backup sem teste nao e confiavel.

Criar rotina:

```text
1 vez por mes: testar restauracao em ambiente separado
```

## 26.3 Retencao

Definir:

- backup diario;
- retencao de 7, 30 ou 90 dias;
- backup mensal arquivado, se necessario.

---

# 27. Monitoramento

Monitorar:

- erros JS;
- falhas de API;
- tempo de carregamento;
- falhas de importacao;
- tentativas de acesso negado;
- volume anormal de exclusoes;
- logins suspeitos;
- falhas de MFA;
- uso de storage;
- uso de banco;
- performance das queries.

Ferramentas possiveis:

- Supabase logs;
- Cloudflare analytics;
- Sentry;
- Logtail/Better Stack;
- painel interno de auditoria.

---

# 28. Testes de seguranca

## 28.1 O que testar

Testar:

- usuario sem login;
- usuario funcionario tentando acessar dado de outro;
- gerente tentando acessar funcionario fora da equipe;
- funcionario tentando acessar rota admin;
- exclusao sem permissao;
- upload invalido;
- arquivo duplicado;
- XSS em campos de texto;
- SQL injection em filtros;
- quebra de sessao;
- MFA ausente;
- RLS ativo;
- logs gravados;
- download de arquivo sem permissao;
- alteracao manual via console.

## 28.2 Testes por perfil

### Funcionario

Verificar:

- so ve dados proprios;
- nao ve usuarios;
- nao ve auditoria global;
- nao acessa painel admin;
- nao altera perfil;
- nao baixa arquivo de outro.

### Gerente

Verificar:

- ve equipe;
- nao ve outras equipes;
- nao cria admin;
- nao altera RLS;
- nao exclui dados globais.

### Admin

Verificar:

- ve tudo;
- acoes sao auditadas;
- MFA obrigatorio;
- exclusoes exigem confirmacao.

## 28.3 Ferramentas

Usar:

- OWASP ZAP em homologacao;
- npm audit;
- Dependabot;
- GitHub secret scanning;
- Supabase Security Advisor;
- testes manuais de RLS;
- checklist OWASP.

---

# 29. Desenvolvimento passo a passo

## Fase 1 - Preparacao

1. Criar repositorio privado.
2. Criar ambiente de homologacao.
3. Criar ambiente de producao.
4. Separar variaveis de ambiente.
5. Remover qualquer segredo do codigo.
6. Documentar tabelas atuais.
7. Fazer backup do Supabase atual.

## Fase 2 - Perfis

1. Criar tabela `profiles`.
2. Vincular usuario Supabase a perfil.
3. Criar perfis `admin`, `gerente`, `funcionario`.
4. Criar tela Admin > Usuarios.
5. Criar redirecionamento por perfil.
6. Testar login de cada perfil.

## Fase 3 - Separacao de dados

1. Adicionar `funcionario_id` nas tabelas operacionais.
2. Atualizar inserts do site.
3. Atualizar consultas do funcionario.
4. Atualizar consultas do gerente.
5. Atualizar consultas do admin.
6. Testar dados separados.

## Fase 4 - RLS

1. Ativar RLS em tabelas.
2. Criar policies de leitura.
3. Criar policies de insercao.
4. Criar policies de atualizacao.
5. Criar policies de exclusao.
6. Testar pelo frontend.
7. Testar pelo Supabase API.

## Fase 5 - MFA

1. Criar fluxo de MFA.
2. Exigir MFA para Admin.
3. Exigir MFA para Gerente.
4. Exigir MFA para acoes criticas.
5. Criar tela Minha Conta > Seguranca.
6. Testar login com e sem MFA.

## Fase 6 - Auditoria

1. Criar `bd_auditoria`.
2. Criar triggers.
3. Criar Edge Functions para acoes criticas.
4. Registrar importacoes.
5. Registrar exclusoes.
6. Registrar edicoes.
7. Criar tela Admin > Auditoria.

## Fase 7 - Arquivos

1. Criar bucket privado.
2. Salvar arquivo original.
3. Criar tabela de arquivos importados.
4. Registrar hash.
5. Permitir download seguro.
6. Excluir com auditoria.
7. Testar permissoes.

## Fase 8 - Dashboard Gerencial

1. Criar layout.
2. Criar cards.
3. Criar filtros.
4. Buscar dados da equipe.
5. Comparar funcionarios.
6. Testar permissoes.

## Fase 9 - Painel Admin

1. Criar usuarios.
2. Criar permissoes.
3. Criar auditoria.
4. Criar logs.
5. Criar configuracoes.

## Fase 10 - LGPD e documentacao

1. Criar politica de privacidade.
2. Criar termo de uso.
3. Criar mapa de dados.
4. Criar matriz de permissoes.
5. Criar plano de incidente.
6. Criar checklist de seguranca.

## Fase 11 - Hospedagem segura

1. Subir para Cloudflare Pages ou Vercel.
2. Configurar dominio.
3. Ativar HTTPS.
4. Configurar headers.
5. Configurar WAF.
6. Testar producao.

## Fase 12 - Testes finais

1. Testar todos os perfis.
2. Testar RLS.
3. Testar MFA.
4. Testar importacao.
5. Testar auditoria.
6. Testar backup.
7. Testar OWASP ZAP em homologacao.
8. Corrigir falhas.
9. Gerar relatorio final.

---

# 30. Checklist de aceite

O projeto so deve ser considerado pronto quando:

- Admin tem MFA obrigatorio;
- Gerente tem MFA obrigatorio;
- Funcionario nao ve dados de outro funcionario;
- Gerente ve somente equipe dele;
- Admin ve todos;
- RLS esta ativo em todas as tabelas sensiveis;
- Nao existe service role no frontend;
- Arquivos ficam em storage privado;
- Download de arquivo exige permissao;
- Exclusao de arquivo e auditada;
- Edicao de dados e auditada;
- Login e falha de login sao registrados;
- Headers de seguranca estao ativos;
- WAF esta configurado;
- Repositorio nao tem segredos;
- Ambiente de teste existe;
- Backup existe;
- Restore foi testado;
- Documentos LGPD existem;
- Plano de incidente existe;
- Auditoria e consultavel;
- Dashboard do funcionario mostra apenas dados dele;
- Dashboard do gerente compara funcionarios;
- Admin tem painel completo;
- Testes OWASP basicos foram feitos.

---

# 31. Perguntas que precisam ser respondidas antes de desenvolver

1. Cada funcionario tera carteira propria de clientes?
2. Cliente pode pertencer a mais de um funcionario?
3. Gerente pode editar dados da equipe ou apenas visualizar?
4. Funcionario pode excluir registros dele?
5. Funcionario pode importar arquivo?
6. Funcionario pode excluir arquivo importado?
7. Admin pode criar outro admin?
8. MFA sera obrigatorio para todos ou somente Admin/Gerente?
9. Qual o prazo de retencao dos arquivos?
10. Qual o prazo de retencao dos logs?
11. O repositorio sera privado?
12. O dominio sera proprio?
13. Quem sera o responsavel LGPD?
14. O sistema tera uma empresa unica ou pode ter varias empresas no futuro?
15. O gerente ve todos os funcionarios ou apenas equipe?
16. Relatorios podem ser exportados?
17. Dados podem ser apagados definitivamente ou apenas inativados?
18. Precisa de assinatura eletronicamente aceita de termo de uso?
19. Quem aprova alteracao de permissao?
20. Quais acoes precisam de MFA obrigatorio?

---

# 32. Regras de ouro para a IA/desenvolvedor

1. Nunca colocar service role no frontend.
2. Nunca confiar apenas no frontend para seguranca.
3. Toda tabela sensivel precisa de RLS.
4. Toda acao critica precisa ser auditada.
5. Toda exclusao importante precisa de confirmacao.
6. Toda permissao deve ser validada no banco.
7. Todo arquivo importado precisa ser rastreavel.
8. Todo usuario deve ser individual.
9. Admin e Gerente devem ter MFA.
10. Dados reais nao devem ir para GitHub publico.
11. Produção e teste devem ser separados.
12. Backup deve ser testado.
13. Logs devem ser consultaveis.
14. LGPD exige processo, nao apenas codigo.
15. O sistema deve negar por padrao e liberar apenas o necessario.

---

# 33. Estrutura final esperada

Ao final, o sistema deve ter:

```text
Login seguro
MFA
Perfis
Funcionario Dashboard
Gerente Dashboard
Admin Dashboard
RLS
Auditoria
Logs
Arquivos privados
Controle de importacao
Controle de permissao
Documentos LGPD
Hospedagem segura
WAF
Headers de seguranca
Backups
Monitoramento
Ambiente de homologacao
Ambiente de producao
```

---

# 34. Resumo operacional para entregar ao cliente

Texto pronto:

```text
A plataforma sera estruturada com seguranca em varias camadas: hospedagem profissional, HTTPS, WAF, autenticacao individual, autenticacao em duas etapas, perfis de acesso, regras de banco com RLS, auditoria completa das acoes, controle de arquivos importados, logs de seguranca e documentacao de LGPD.

O funcionario tera acesso ao dashboard operacional dele, com os proprios registros e resultados.

O gerente tera um dashboard gerencial para comparar funcionarios, acompanhar registros, metas, conversoes e produtividade.

O admin tera acesso global, painel de usuarios, permissoes, auditoria, configuracoes e logs.

O sistema sera preparado tecnicamente para boas praticas de compliance e LGPD, com controle de acesso, rastreabilidade e protecao de dados.
```

---

# 35. Observacao final

Este projeto pode atingir um nivel muito forte de seguranca e organizacao, mas seguranca nunca e algo que se faz uma vez e esquece.

O correto e manter:

- revisao mensal;
- backups;
- atualizacoes;
- testes;
- revisao de usuarios;
- revisao de permissoes;
- analise de logs;
- melhoria continua.

Compliance e seguranca sao processos continuos.

O sistema deve nascer seguro, mas tambem precisa continuar sendo cuidado.

