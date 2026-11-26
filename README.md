# Fuso Nordeste

Painel independente para acompanhar a ideia legislativa de UTC−2 em RN, PB, PE, AL e SE. Os apoios são consultados na [página oficial do Senado](https://www12.senado.leg.br/ecidadania/visualizacaoideia?id=258092).

## Como funciona

- O mapa destaca os estados da proposta. A linha de 37°30′ O representa uma divisão geométrica teórica, não um limite legal.
- O simulador usa [SunCalc](https://github.com/mourner/suncalc) para estimar o nascer, o pôr e a posição do sol nas capitais; a trajetória visual é esquemática.
- A automação do GitHub consulta o Senado aproximadamente a cada 10 minutos, sujeita a atrasos e indisponibilidade. Ela registra mudanças e, quando o valor permanece igual, registra uma medição pelo menos a cada hora em que for executada.
- O histórico começou com medições oficiais coletadas durante a criação do painel; não inclui uma reconstrução dos dados anteriores. Nenhum apoiador é identificado.
- O site verifica os arquivos publicados enquanto estiver aberto. Os avisos no painel, e as notificações do navegador quando autorizadas, dependem da aba aberta; aumentos entre consultas podem aparecer agrupados.

## Desenvolvimento

Requer Node.js 20 ou mais recente; não há dependências para instalar. Para criar o site estático localmente:

```sh
node scripts/update-history.mjs
node scripts/build-pages.mjs
```

Sirva a pasta `public/` usando um servidor HTTP local. `worker/page.html` contém o painel editável; `worker/nordeste.svg` contém o mapa. `data/history.json` é gerenciado pela automação: cada ponto contém o total confirmado pelo Senado e o horário de leitura, não o momento individual de cada apoio. Não substitua dados reais por estimativas sem sinalizá-las.

## Fontes e licenças

O mapa deriva dos [contornos disponibilizados pelo Click That 'Hood](https://github.com/codeforamerica/click_that_hood/blob/master/public/data/brazil-states.geojson); licença em `vendor/map-LICENSE.txt`. A biblioteca SunCalc é de Vladimir Agafonkin; licença em `vendor/suncalc-LICENSE.txt`. As faixas oficiais podem ser consultadas no [Observatório Nacional](https://www.gov.br/observatorio/pt-br/assuntos/areas-de-atuacao/tempo-e-frequencia/brasil). O projeto não é um site oficial do Senado.
