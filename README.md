<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>📋 Sistema Lista de Tarefas</h1>
    <p>
        Este projeto é um sistema web para cadastro e gerenciamento de tarefas, criado como parte de um processo seletivo para uma vaga de estágio. O sistema utiliza um banco de dados para persistir as informações das tarefas e oferece funcionalidades completas para manipulação dos registros.
    </p>

  <h2>🚀 Funcionalidades</h2>
    <ul>
        <li>
            <strong>Lista de Tarefas:</strong> 
            <ul>
                <li>Exibe todos os registros mantidos na tabela "Tarefas".</li>
                <li>Os campos exibidos são: Identificador, Nome da Tarefa, Custo (R$) e Data Limite.</li>
                <li>Os registros são ordenados pelo campo "Ordem de apresentação".</li>
                <li>Tarefas com custo maior ou igual a R$1.000,00 são destacadas visualmente.</li>
                <li>Cada registro tem botões para "Editar" e "Excluir".</li>
                <li>Inclui um botão para adicionar novas tarefas.</li>
            </ul>
        </li>
        <li>
            <strong>Excluir:</strong> Permite excluir uma tarefa, solicitando confirmação antes de realizar a ação.
        </li>
        <li>
            <strong>Editar:</strong> Permite alterar o Nome, o Custo e a Data Limite de uma tarefa. 
            <ul>
                <li>Validação: Não é possível salvar o nome de uma tarefa já existente.</li>
            </ul>
        </li>
        <li>
            <strong>Incluir:</strong> Permite cadastrar uma nova tarefa informando Nome, Custo e Data Limite.
            <ul>
                <li>Os campos Identificador e Ordem de apresentação são gerados automaticamente.</li>
                <li>Validação: Não é permitido cadastrar tarefas com o mesmo nome.</li>
            </ul>
        </li>
        <li>
            <strong>Reordenação de Tarefas:</strong> Permite alterar a ordem de apresentação das tarefas.
            <ul>
                <li>Opções de implementação:
                    <ol>
                        <li>Arrastar e soltar (drag-and-drop).</li>
                    </ol>
                </li>
            </ul>
        </li>
    </ul>

  <h2>🛠️ Tecnologias Utilizadas</h2>
    <ul>
        <li>Front-end: React, NextJS</li>
        <li>Back-end: NextJS</li>
        <li>Banco de Dados: Postgres</li>
    </ul>

  <h2>📦 Instalação</h2>
    <ol>
        <li>Clone este repositório: <code>git clone [URL]</code></li>
        <li>Configure o banco de dados e crie a tabela "Task" com os seguintes campos:
            <ul>
                <li>id: Identificador da tarefa (chave primária)</li>
                <li>name: Nome da tarefa</li>
                <li>cost: Custo (R$)</li>
                <li>deadline_date: Data limite</li>
                <li>presentation_order: Ordem de apresentação</li>
            </ul>
        </li>
        <li>Configure as variáveis de ambiente no arquivo <code>.env</code></li>
        <li>Inicie a aplicação com o comando: <code>npm run dev</code>.</li>
    </ol>

  <h2>🎨 Melhorias Futuras</h2>
    <ul>
        <li>Adicionar autenticação de usuários.</li>
        <li>Implementar filtros e buscas avançadas na lista de tarefas.</li>
        <li>Exportação de dados para CSV ou PDF.</li>
    </ul>

  <h2>📄 Licença</h2>
    <p>Este projeto é de uso exclusivo para fins acadêmicos e de seleção. Nenhuma licença formal foi aplicada.</p>
</body>
</html>
