export { NavItems, CompletedTasks, ActiveTasks };

const NavItems = [
    {
        id: 'bd7acbea',
        title: 'Ärenden',
        route: '',
        active: true
    },
    {
        id: '3ac68afc',
        title: 'Översikt',
        route: '',
        active: false
    },
    {
        id: '58694a0f',
        title: 'Händelser',
        route: '',
        active: false
    },
]

const ActiveTasks = [
    {
        id: 'bd7akbea',
        title: 'Ansökan',
        text: 'Borgerlig vigsel',
        iconName: 'wc',
        highlighted: true
    },
];

const CompletedTasks = [
    {
        heading: 'TISDAG 3 NOVEMBER',
        data: [
            {
                id: 'bd7aobea',
                title: 'Skolskjuts',
                text: 'Skolskjuts beställd',
            }
        ]
    },
    {
        heading: 'FREDAG 10 NOVEMBER',
        data: [
            {
                id: '3ac683fc',
                title: 'Avfallshämtning',
                text: 'Avfallshämtning beställd',
            },
            {
                id: '5869la0f',
                title: 'Bygglov',
                text: 'Bygglov godkänt',
            },
        ]
    },
];
