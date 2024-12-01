import * as Yup from 'yup';

const Schema = Yup.object({
    taskId: Yup.number().required('O Id é requerido'),
    taskName: Yup.string().required('O nome da tarefa é requerido!'),
    taskCost: Yup.number().required('O custo da tarefa é requerido!'),
    taskDeadline: Yup.date().required('A data limite da tarefa é requerido!')
});

export default Schema;