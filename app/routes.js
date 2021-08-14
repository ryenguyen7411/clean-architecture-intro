import App from 'presentations';
import HomePage from 'presentations/views/home';

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
