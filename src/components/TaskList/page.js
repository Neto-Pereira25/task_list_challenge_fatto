import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaWindowClose } from 'react-icons/fa'
import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import style from './page.module.css';
import NewTaskForm from '../Form/NewTaskForm/page';
import EditTaskForm from '../Form/EditTaskForm/page';
import DeleteTask from '../Form/DeleteTask/page';
import { getTaskList } from '@/services/tasksService';

export default function TaskList() {

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal do Cadastro
    const [createTaskModal, setCreateTaskModal] = useState(false);

    const openCreateTaskModal = () => {
        setCreateTaskModal(true);
    };

    const closeCreateTaskModal = () => {
        setCreateTaskModal(false);
    };

    // Modal da edição
    const [editTaskModal, setEditTaskModal] = useState(false);
    const [idTask, setIdTask] = useState();

    const openEditTaskModal = (id) => {
        setEditTaskModal(true);
        setIdTask(id);
    };

    const closeEditTaskModal = () => {
        setEditTaskModal(false);
    };

    // Modal da remoção
    const [removeTaskModal, setRemoveTaskModal] = useState(false);

    const openRemoveTaskModal = (id) => {
        setRemoveTaskModal(true);
        setIdTask(id);
    };

    const closeRemoveTaskModal = () => {
        setRemoveTaskModal(false);
    };

    const reOrder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = reOrder(tasks, result.source.index, result.destination.index);

        for (let i = 0; i < items.length; i++) {
            items[i].presentation_order = i + 1;
        }

        setTasks(items);


        fetch(`${BASE_URL}/api/tasks`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(items),
        })
            .then(async () => await getTaskList()
                .then(result => setTasks(result))
            )
            .catch(() => toast.error('falha ao atualizar a lista'));

    };

    useEffect(() => {
        try {
            setLoading(true);
            const result = getTaskList();

            result.then(data => setTasks(data));
        } catch (error) {
            toast.error('Erro ao carregar a lista de tarefas');
        } finally {
            setLoading(false);
        }
    }, [/*tasks*/]);

    return (
        <div className={`m-auto ${style.taskList}`}>
            <Button
                variant="outline-light"
                className={`
                d-flex justify-content-center align-items-center gap-2 
                bg-success 
                w-25 p-2 m-auto 
                rounded
                shadow-sm
                `}
                onClick={openCreateTaskModal}
            >
                <span className='text-white'>Adicionar Tarefa</span>
                <FaPlus className='text-white' size={20} />
            </Button >
            <hr />
            {/* table table-striped table-hover table-sm */}
            {loading
                ?
                <>
                    <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                        <Spinner animation="border" variant="light" size="lg" />
                    </div>
                </>
                :
                <>
                    <div className='rounded p-1 w-100'>
                        <div className={`
                    d-flex flex-column
                    p-1 m-auto 
                    border border-dark
                `}>
                            <div className={style.thead}>
                                <div className={`
                            d-flex flex-row justify-content-between 
                            p-1 
                            bg-light
                            rounded
                            
                        `}>
                                    <span className='w-100 align-items-center fw-bold fs-4'>Id</span>
                                    <span className='w-100 align-items-center fw-bold fs-4'>Nome da Tarefa</span>
                                    <span className='w-100 align-items-center fw-bold fs-4'>Custo da Tarefa</span>
                                    <span className='w-100 align-items-center fw-bold fs-4'>Data Limite</span>
                                    <span className='w-100 align-items-center fw-bold fs-4 text-center'>Ações</span>
                                </div>
                            </div>
                            {/* Drag and Drop */}
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId='tasks' type='list' direction='vertical'>
                                    {(provided) => (
                                        <div className={style.tbody}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {tasks.map((task, index) => {
                                                const currente_date = task.deadline_date.split('T')[0].split('-');
                                                const year = currente_date[0];
                                                const month = currente_date[1];
                                                const day = currente_date[2];
                                                const formatedDate = `${day}/${month}/${year}`;

                                                return (
                                                    <Draggable
                                                        key={task.id}
                                                        draggableId={`${task.id}`}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <div key={`${task.id}`}
                                                                className={`
                                                            d-flex flex-row justify-content-between 
                                                            p-1 my-2
                                                            text-white
                                                            rounded
                                                        `}
                                                                {...provided.dragHandleProps}
                                                                {...provided.draggableProps}
                                                                ref={provided.innerRef}
                                                                style={{ background: task.cost > 1000 ? '#c7d631' : '#212529' }}
                                                            >
                                                                <span className='w-75 mx-1 align-self-center fs-6'>{task.id}</span>
                                                                <span className='w-75 mx-1 align-self-center fs-6'>{task.name}</span>
                                                                <span className='w-75 mx-1 align-self-center fs-6'>{task.cost}</span>
                                                                <span className='w-75 mx-1 align-self-center fs-6'>{formatedDate}</span>
                                                                <span className='w-75 mx-1 align-self-center fs-6'>
                                                                    <div className='d-flex justify-content-around align-items-center'>
                                                                        <Button
                                                                            variant="outline-light"
                                                                            onClick={() => openEditTaskModal(task.id)}
                                                                            size="sm"
                                                                            className={`${(task.cost > 1000 ? `bg-light` : ``)}
                                                                        d-flex justify-content-center aling-items-center
                                                                    `}
                                                                        >
                                                                            <FaEdit size={18} className='text-info' />
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline-light"
                                                                            onClick={() => openRemoveTaskModal(task.id)}
                                                                            size="sm"
                                                                            className={`${(task.cost > 1000 ? `bg-light` : ``)}
                                                                        d-flex justify-content-center aling-items-center
                                                                    `}
                                                                        >
                                                                            <FaWindowClose size={18} className='text-danger' />
                                                                        </Button>
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </div>
                </>}

            {/* Modal do Cadastro */}
            <NewTaskForm
                isOpen={createTaskModal}
                onClose={closeCreateTaskModal}
                tasks={tasks}
                setTasks={setTasks}
                setLoading={setLoading}
            />

            {/* Modal da Edição */}
            <EditTaskForm
                isOpen={editTaskModal}
                onClose={closeEditTaskModal}
                tasks={tasks}
                idTask={idTask}
                setTasks={setTasks} setLoading={setLoading}
            />

            {/* Modal da Remoção */}
            <DeleteTask
                isOpen={removeTaskModal}
                onClose={closeRemoveTaskModal}
                tasks={tasks}
                idTask={idTask}
                setTasks={setTasks}
                setLoading={setLoading}
            />

        </div>
    );
}