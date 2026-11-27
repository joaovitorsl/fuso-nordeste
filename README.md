# Uma hora para viver

Painel independente para acompanhar a ideia legislativa de UTC−2 em RN, PB, PE, AL e SE. Os apoios são consultados na [página oficial do Senado](https://www12.senado.leg.br/ecidadania/visualizacaoideia?id=258092).

## Como funciona

- Os horários do sol valem para qualquer uma das 751 sedes municipais de RN, PB, PE, AL e SE (Fernando de Noronha fica de fora porque já usa UTC−2). A pessoa escolhe a cidade pela busca (as capitais aparecem como sugestão) ou pelo botão de localização. A posição é comparada com as cidades no próprio navegador e não é enviada a nenhum serviço. O endereço `?cidade=<código IBGE>` abre a página direto numa cidade.
- A abertura é um simulador com dois céus lado a lado sob o mesmo relógio: à esquerda o de hoje (UTC−3), à direita o com UTC−2, onde a mesma hora do relógio acontece uma hora antes em relação ao sol. Cada céu é desenhado a partir da altura real do sol, calculada com [SunCalc](https://github.com/mourner/suncalc). Começa na hora atual; a régua muda a hora nos dois céus e aceita arrastar por toque ou mouse em qualquer ponto, e setas pelo teclado. Dá para escolher hoje, 21 de junho ou 21 de dezembro. O dia só passa quando a pessoa toca em “Veja como seria”: um time-lapse que desacelera nas cenas do dia a dia e termina no pôr do sol com UTC−2, quando aparece o botão de apoio. A cor dos céus tinge o fundo da página inteira.
- O mapa de luz do ano calcula, dia a dia no ano corrente, noite, crepúsculo, nascer, dia e pôr do sol na cidade escolhida. O título e os números ao lado são gerados a partir desses cálculos.
- A seção Vozes mostra vídeos do Instagram sobre a ideia. A lista fica em `data/videos.json` (link do reel e @ do perfil); o build confere o formato e embute na página. As incorporações carregam só quando chegam perto da tela, e o rodapé avisa que o Instagram recebe o IP de quem as vê.
- A seção de apoios compara esta ideia com sete ideias parecidas já encerradas no e-Cidadania (114844, 183008, 184030, 194272, 202987, 204281 e 215847), cujos apoios foram conferidos nas páginas oficiais em 27/11/2026.
- A grade de 20.000 pontos acende um ponto por apoio confirmado e se ajusta para não passar de cerca de 360 px de altura.
- A automação do GitHub consulta o Senado aproximadamente a cada 10 minutos, sujeita a atrasos e indisponibilidade. Se a conexão direta falhar, tenta pelo serviço independente cors.dev. Ela registra mudanças e, quando o valor permanece igual, registra uma medição pelo menos a cada hora em que for executada.
- O histórico gravado pela automação começou em 26/11/2026 e serve de valor de reserva quando a leitura ao vivo falha; ele não é exibido como gráfico, porque o agendamento do GitHub atrasa e não acompanharia o contador ao vivo. Nenhum apoiador é identificado.
- A contagem no site consulta a página pública do Senado através do serviço independente [cors.dev](https://cors.dev/docs) a cada minuto enquanto a página estiver aberta. O serviço recebe o endereço de internet de quem acessa e a URL pública consultada; nenhuma credencial é enviada. Se a consulta falhar, o site informa a falha e usa o último valor salvo quando necessário, sem apresentá-lo como atual.
- O [GoatCounter](https://www.goatcounter.com/help/privacy) mede visualizações e cliques nos botões de apoio, sem cookies de rastreamento. O serviço recebe dados técnicos, incluindo o endereço IP. A página usa um caminho comum nas estatísticas, inclusive nos links com cidade; cliques em apoiar não confirmam que o apoio foi concluído no Senado. O serviço não conta acessos locais por padrão e bloqueadores podem impedir a medição.
- O mapa de luz responde ao mouse e ao teclado (setas, Shift+setas, Home, End) e tem uma tabela equivalente. Quem pede menos movimento no sistema vê tudo sem animação.

## Desenvolvimento

Requer Node.js 20 ou mais recente; não há dependências para instalar. Para criar o site estático localmente:

```sh
node scripts/update-history.mjs
node scripts/build-pages.mjs
```

Sirva a pasta `public/` usando um servidor HTTP local. `worker/page.html` contém a página editável. `data/cidades.json` vem da base Localidades do Brasil 2022 do IBGE. Para gerá-lo de novo, baixe `Localidades_Brasil_shp.zip` em <https://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/Localidades_do_Brasil/2022/>, extraia e rode `node scripts/build-cities.mjs caminho/BR_localidades_2022.dbf`. A população de cada município (Censo 2022) e os contornos dos estados vêm da API do IBGE: `node scripts/build-population.mjs` grava `data/populacao.json` e `data/estados.json`. O script confere o número de municípios de cada estado. `data/history.json` é gerenciado pela automação: cada ponto contém o total confirmado pelo Senado e o horário de leitura, não o momento individual de cada apoio. Não substitua dados reais por estimativas sem sinalizá-las.

## Fontes e licenças

As coordenadas das sedes municipais são do [IBGE, Localidades do Brasil 2022](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/estrutura-territorial/27385-localidades.html), em SIRGAS 2000. A biblioteca SunCalc é de Vladimir Agafonkin; licença em `vendor/suncalc-LICENSE.txt`. As fontes Mouse Memoirs e Sora vêm do Google Fonts, sob a SIL Open Font License. As faixas oficiais podem ser consultadas no [Observatório Nacional](https://www.gov.br/observatorio/pt-br/assuntos/areas-de-atuacao/tempo-e-frequencia/brasil). O projeto não é um site oficial do Senado.
