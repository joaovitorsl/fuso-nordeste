# Fuso Nordeste

Painel independente para acompanhar a ideia legislativa de UTC−2 em RN, PB, PE, AL e SE. Os apoios são consultados na [página oficial do Senado](https://www12.senado.leg.br/ecidadania/visualizacaoideia?id=258092).

## Como funciona

- A abertura desenha o céu da capital escolhida a partir da altura real do sol, calculada com [SunCalc](https://github.com/mourner/suncalc). A régua dupla mostra as duas escalas, UTC−3 e UTC−2; ao arrastá-la, o céu e os relógios mudam para a hora escolhida de hoje.
- O mapa de luz do ano calcula, dia a dia no ano corrente, noite, crepúsculo, nascer, dia e pôr do sol na capital escolhida. O título e os números ao lado são gerados a partir desses cálculos.
- A grade de 20.000 pontos acende um ponto por apoio confirmado.
- A automação do GitHub consulta o Senado aproximadamente a cada 10 minutos, sujeita a atrasos e indisponibilidade. Se a conexão direta falhar, tenta pelo serviço independente cors.dev. Ela registra mudanças e, quando o valor permanece igual, registra uma medição pelo menos a cada hora em que for executada.
- O histórico começou com medições oficiais coletadas durante a criação do painel; não inclui uma reconstrução dos dados anteriores. Nenhum apoiador é identificado.
- A contagem no site consulta a página pública do Senado através do serviço independente [cors.dev](https://cors.dev/docs) a cada minuto enquanto a página estiver aberta. O serviço recebe o endereço de internet de quem acessa e a URL pública consultada; nenhuma credencial é enviada. Se a consulta falhar, o site informa a falha e usa o último valor salvo quando necessário, sem apresentá-lo como atual.
- O gráfico de apoios usa o histórico guardado pelo GitHub e pode estar atrasado em relação ao contador ao vivo. O gráfico de apoios e o mapa de luz respondem ao mouse e ao teclado (setas, Shift+setas, Home, End) e têm uma tabela equivalente. Quem pede menos movimento no sistema vê tudo sem animação.

## Desenvolvimento

Requer Node.js 20 ou mais recente; não há dependências para instalar. Para criar o site estático localmente:

```sh
node scripts/update-history.mjs
node scripts/build-pages.mjs
```

Sirva a pasta `public/` usando um servidor HTTP local. `worker/page.html` contém a página editável. `data/history.json` é gerenciado pela automação: cada ponto contém o total confirmado pelo Senado e o horário de leitura, não o momento individual de cada apoio. Não substitua dados reais por estimativas sem sinalizá-las.

## Fontes e licenças

A biblioteca SunCalc é de Vladimir Agafonkin; licença em `vendor/suncalc-LICENSE.txt`. As faixas oficiais podem ser consultadas no [Observatório Nacional](https://www.gov.br/observatorio/pt-br/assuntos/areas-de-atuacao/tempo-e-frequencia/brasil). O projeto não é um site oficial do Senado.
