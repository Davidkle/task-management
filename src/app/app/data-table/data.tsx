import { CheckCircle, Circle, CircleOff, HelpCircle, Timer } from 'lucide-react';

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
];

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: HelpCircle,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: Circle,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: Timer,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircle,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CircleOff,
  },
];

export const sampleData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  profiles: [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    },
    {
      name: 'Jack Smith',
      email: 'jack.smith@example.com',
    },
  ],
  categories: [
    {
      id: '1',
      name: 'Playground',
      color: '#ebaf16',
    },
    {
      id: '2',
      name: 'Models',
      color: '#3B82F6',
    },
    {
      id: '3',
      name: 'Documentation',
      color: '#8311f5',
    },
    {
      id: '4',
      name: 'Settings',
      color: '#f6673b',
    },
  ],
};
