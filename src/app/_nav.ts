export const navItems = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer'
  },
  {
    title: true,
    name: 'Menu'
  },
  {
    name: 'Ahijados',
    url: '/base/godsons',
    icon: 'icon-user'
  },
  {
    name: 'Padrinos',
    url: '/base/godfathers',
    icon: 'icon-user'
  },
  {
    name: 'Preguntas',
    url: '/base/questions',
    icon: 'icon-question'
  },
  {
    name: 'Avisos',
    url: '/base/notice',
    icon: 'icon-bell'
  },
  {
    name: 'Historial',
    url: '/base/history',
    icon: 'icon-briefcase'
  },
  {
    name: 'Categorías',
    url: '/base/category',
    icon: 'icon-chart'
  },
  {
    name: 'Administrador',
    url: '/base/settings',
    icon: 'icon-settings',
    children: [
      {
        name: 'Unidades',
        url: '/base/department',
        icon: 'icon-home'
      },
      {
        name: 'Encargados',
        url: '/base/subadministrator',
        icon: 'icon-user'
      },
    ]
  },
  {
    name: 'Soporte Técnico',
    url: '/404',
    icon: 'icon-phone',
    class: 'mt-auto',
    variant: 'success'
  },
];
