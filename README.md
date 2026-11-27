# Fuso Nordeste

Painel independente para acompanhar a ideia legislativa de UTC−2 em RN, PB, PE, AL e SE. Os apoios são consultados na [página oficial do Senado](https://www12.senado.leg.br/ecidadania/visualizacaoideia?id=258092).

## Como funciona

- Os horários do sol valem para qualquer uma das 751 sedes municipais de RN, PB, PE, AL e SE (Fernando de Noronha fica de fora porque já usa UTC−2). A pessoa escolhe a cidade pela busca, pelos atalhos das capitais ou pelo botão de localização. A posição é comparada com as cidades no próprio navegador e não é enviada a nenhum serviço. O endereço `?cidade=<código IBGE>` abre a página direto numa cidade.
- A abertura desenha o céu da cidade escolhida a partir da altura real do sol, calculada com [SunCalc](https://github.com/mourner/suncalc). A régua dupla mostra as duas escalas, UTC−3 e UTC−2; ao arrastá-la, o céu e os relógios mudam para a hora escolhida de hoje.
- A seção Relógio × sol mostra a que horas o sol fica no ponto mais alto na cidade escolhida: hoje, pelo SunCalc, e em média, pela longitude (o fuso UTC−3 é acertado pelo meridiano de 45° O, e cada grau vale 4 minutos). Também compara o pôr do sol de dezembro com o de São Paulo, cujas coordenadas e as de Brasília também vêm do IBGE.
- A seção Sua rotina mostra o céu em seis horários de exemplo (06:00, 07:00, 09:30, 12:00, 18:00 e 18:30) com o relógio de hoje e com UTC−2, para hoje, 21 de junho e 21 de dezembro.
- O mapa de luz do ano calcula, dia a dia no ano corrente, noite, crepúsculo, nascer, dia e pôr do sol na cidade escolhida. O título e os números ao lado são gerados a partir desses cálculos.
- A seção de apoios compara esta ideia com sete ideias parecidas já encerradas no e-Cidadania (114844, 183008, 184030, 194272, 202987, 204281 e 215847), cujos apoios foram conferidos nas páginas oficiais em 27/11/2026.
- O comparativo do ano inclui o limite usado no estudo da Consultoria Legislativa do Senado de 2005 (Texto para Discussão nº 19): o sol nascendo antes das 7h.
- A grade de 20.000 pontos acende um ponto por apoio confirmado.
- A automação do GitHub consulta o Senado aproximadamente a cada 10 minutos, sujeita a atrasos e indisponibilidade. Se a conexão direta falhar, tenta pelo serviço independente cors.dev. Ela registra mudanças e, quando o valor permanece igual, registra uma medição pelo menos a cada hora em que for executada.
- O histórico automático começou em 26/11/2026. O gráfico também distingue marcos anteriores relatados na conversa, guardados em `data/marcos.json`; os do resumo não foram verificados no Senado e, para datas sem hora, o início do dia é apenas posição gráfica. Os 32 e 237 sem data recuperada não são posicionados. Nenhum apoiador é identificado.
- A contagem no site consulta a página pública do Senado através do serviço independente [cors.dev](https://cors.dev/docs) a cada minuto enquanto a página estiver aberta. O serviço recebe o endereço de internet de quem acessa e a URL pública consultada; nenhuma credencial é enviada. Se a consulta falhar, o site informa a falha e usa o último valor salvo quando necessário, sem apresentá-lo como atual.
- O gráfico de apoios usa o histórico guardado pelo GitHub e pode estar atrasado em relação ao contador ao vivo. O gráfico de apoios e o mapa de luz respondem ao mouse e ao teclado (setas, Shift+setas, Home, End) e têm uma tabela equivalente. Quem pede menos movimento no sistema vê tudo sem animação.

## Desenvolvimento

Requer Node.js 20 ou mais recente; não há dependências para instalar. Para criar o site estático localmente:

```sh
node scripts/update-history.mjs
node scripts/build-pages.mjs
```

Sirva a pasta `public/` usando um servidor HTTP local. `worker/page.html` contém a página editável. `data/cidades.json` vem da base Localidades do Brasil 2022 do IBGE. Para gerá-lo de novo, baixe `Localidades_Brasil_shp.zip` em <https://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/Localidades_do_Brasil/2022/>, extraia e rode `node scripts/build-cities.mjs caminho/BR_localidades_2022.dbf`. O script confere o número de municípios de cada estado. `data/history.json` é gerenciado pela automação: cada ponto contém o total confirmado pelo Senado e o horário de leitura, não o momento individual de cada apoio. Não substitua dados reais por estimativas sem sinalizá-las.

## Fontes e licenças

As coordenadas das sedes municipais são do [IBGE, Localidades do Brasil 2022](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/estrutura-territorial/27385-localidades.html), em SIRGAS 2000. A biblioteca SunCalc é de Vladimir Agafonkin; licença em `vendor/suncalc-LICENSE.txt`. As faixas oficiais podem ser consultadas no [Observatório Nacional](https://www.gov.br/observatorio/pt-br/assuntos/areas-de-atuacao/tempo-e-frequencia/brasil). O projeto não é um site oficial do Senado.
