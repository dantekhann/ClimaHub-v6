ClimaHub v5: Dashboard Multi-Localidade & Inteligência Geográfica
O ClimaHub é uma aplicação front-end de monitoramento meteorológico em tempo real. A versão 5 marca a maturidade do projeto, evoluindo de uma ferramenta de busca simples para um painel de comparação persistente, capaz de gerenciar múltiplas localidades simultaneamente com tratamento avançado de dados geográficos e cache inteligente.

🚀 O que há de novo na v5?
Diferente das versões anteriores que exibiam apenas um resultado por vez, o ClimaHub agora opera como um Dashboard de Comparação.

1. Sistema de Grid Dinâmico e Controle Unificado
Multi-Cards: Adicione várias cidades simultaneamente para comparação direta de temperatura, vento e condições climáticas.

Controles Sincronizados: O painel de controles (Alternar Unidade e Limpar Painel) agora utiliza um layout lado a lado, otimizando o espaço vertical e aparecendo dinamicamente apenas quando há dados no grid.

Gerenciamento Individual: Botões de remoção (✕) em cada card para gestão precisa do painel.

2. Memória Inteligente (Cache de 1 Hora)
Persistência com LocalStorage: As cidades permanecem salvas mesmo após o fechamento do navegador ou atualização da página (F5).

Auto-Faxina (TTL - Time to Live): Implementamos uma lógica de expiração. Cidades com dados em cache há mais de 60 minutos são removidas automaticamente para garantir a relevância das informações.

3. Inteligência Geográfica e Resiliência de Busca
Resolução de Homônimos: Ao buscar cidades com nomes comuns, o sistema apresenta uma lista seletiva detalhando Estado/Província e País.

Tratamento de Nomes Compostos: Lógica de busca resiliente que aceita nomes com hífens ou caracteres especiais (ex: São-Tomé), incluindo um sistema de "fallback" (plano B) caso a API retorne vazio na primeira tentativa.

Hierarchy-Display: Exibição clara da hierarquia geográfica completa em cada card.

4. Robustez Visual e UI/UX
Anti-Quebra de Layout: Implementação de word-wrap e line-clamp para nomes de cidades extremamente longos.

Inversão de Hierarquia Visual: A temperatura agora possui prioridade visual máxima, posicionada no topo do corpo do card.

Feedback Visual: Modo Dia/Noite automático (☀️/🌙) e bordas dinâmicas coloridas de acordo com o código de condição climática.

🧠 Lógica Técnica
Sanitização Dinâmica: Uso de Regex para limpar inputs sem corromper caracteres essenciais (como hífens em nomes de cidades).

Arquitetura de Dados: O LocalStorage armazena metadados e coordenadas; os dados meteorológicos são sempre requisitados em tempo real no carregamento para garantir precisão absoluta.

Estética: Estilo Glassmorphism sobre fundo escuro (#0b0b0c) para reduzir fadiga visual e proporcionar um visual premium.

📂 Estrutura do Projeto
index.html: Dashboard estruturado com containers separados para notificações de busca e grid de cards.

style.css: Design responsivo, animações de entrada (slideUp) e controle fino de espaçamentos (gap control).

script.js: Engine principal que gerencia a Fetch API (Open-Meteo), persistência de dados e lógica de expiração.

🔧 Como utilizar
Busque por uma cidade no campo de pesquisa.

Se houver mais de um resultado (homônimos), selecione a opção correta na lista.

O card será fixado no painel. Você pode adicionar quantos desejar.

Utilize os botões de controle centrais para alternar entre °C/°F ou limpar todo o histórico.

Para limpar tudo, utilize o botão "Limpar Histórico" que surge ao final do grid.

👤 Desenvolvedor: Paulo Dante Coelho Neto

GitHub: dantekhann
