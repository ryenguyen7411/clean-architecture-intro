import App from 'components';
import HomePage from 'components/pages/home';

export default function getRoutes () {
  return [
    {
      path: '/',
      component: App,
      routes: [
        {
          path: '/',
          component: HomePage,
          exact: true,
        },
      ],
    },
  ];
}
