ClimaHub v6: Dashboard Multi-Localidade & Segurança Avançada
O ClimaHub é uma aplicação front-end de monitoramento meteorológico em tempo real. A versão 6 consolida o projeto como uma aplicação robusta, introduzindo inteligência de previsão, segurança contra ataques e uma arquitetura de arquivos profissional.

🚀 O que há de novo na v6?
Diferente da v5, esta versão foca em resiliência de dados e proteção de código, além de expandir a visão meteorológica do usuário.

🛡️ Segurança e Conformidade (Padrão Profissional)
Blindagem contra XSS (Cross-Site Scripting): Substituição total de .innerHTML por métodos seguros (createElement, textContent e append). O app agora é imune a injeções de scripts maliciosos.

Sanitização Dinâmica de Busca: Uso de Regex avançada para permitir buscas ou nomes com hífens, limpando caracteres perigosos sem perder a precisão geográfica.

Atribuição Legal: Implementação de créditos de API (Open-Meteo) em conformidade com as políticas de uso de dados abertos.

📅 Previsão Estendida e Robustez Visual
Forecast de 3 Dias: Adição de uma nova seção em cada card que exibe a previsão de temperatura e condições climáticas para os próximos três dias.

Tratamento de Erros Silenciosos (Graceful Degradation): Se a API falhar ou a internet oscilar, o card entra em "Modo de Erro" visual, oferecendo um botão de "Tentar Novamente" sem quebrar o restante do dashboard.

Ajuste de Timezone Automática: A previsão utiliza o fuso horário local de cada cidade buscada, garantindo que os dias da semana estejam sempre corretos.

📂 Arquitetura de Pastas Profissional
O projeto foi fragmentado para seguir as melhores práticas de organização de ativos:

/css: Centraliza o style.css e regras de layout.

/js: Centraliza o script.js e a lógica de processamento.

.gitignore: Implementado para manter o repositório limpo de arquivos de sistema (DS_Store/Thumbs.db) e configurações de editores (.vscode).

🧠 Lógica Técnica
Modularização de Funções: A renderização dos cards foi separada da lógica de previsão (criarElementoPrevisao), facilitando manutenções futuras.

Circuit Breaker: Validação de dados de entrada na conversão de temperatura para evitar erros de cálculo (NaN).

Layout Flexbox: Otimização do container de previsão para manter o alinhamento vertical e horizontal, independentemente do tamanho do nome da localidade.

📂 Estrutura do Projeto
index.html: Porta de entrada com as novas rotas para pastas de assets.

css/style.css: Design responsivo com suporte à nova seção de previsão e estados de erro.

js/script.js: Engine principal com tratamento de try/catch, lógica de busca refinada e sanitização de saída.

🔧 Como utilizar
Busque por uma cidade (ex: "Brasília" ou "Londres, GB").

Selecione a localidade correta na lista de homônimos.

O card exibirá a temperatura atual e a previsão para os próximos 3 dias.

Em caso de falha de conexão, utilize o botão "Tentar Novamente" no card afetado.

Use os botões centrais para alternar a unidade global de temperatura.

👤 Desenvolvedor: Paulo Dante Coelho Neto

GitHub: dantekhann