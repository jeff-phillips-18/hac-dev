export const taskRunTableColumnClasses = {
  name: 'pf-m-width-25',
  task: 'pf-m-width-25',
  started: 'pf-m-width-25',
  status: 'pf-m-width-25',
  kebab: 'pf-c-table__action',
};

export const TaskRunListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: taskRunTableColumnClasses.name },
    },
    {
      title: 'Task',
      props: { className: taskRunTableColumnClasses.task },
    },
    {
      title: 'Started',
      props: { className: taskRunTableColumnClasses.started },
    },
    {
      title: 'Status',
      props: { className: taskRunTableColumnClasses.status },
    },
    {
      title: '',
      props: {
        className: taskRunTableColumnClasses.kebab,
        style: { width: '1%', paddingRight: 24 },
      },
    },
  ];
};
