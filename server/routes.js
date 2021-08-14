import * as main from './controllers/main';

const mainGroup = [['GET /*', main.serve]];

const routes = [
  ...mainGroup,
];

export default function getRoutes ({ asteriskToNoExact = false } = {}) {
  return routes.map((route) => {
    let [method, path] = route[0].split(' ');
    let exact = false;
    method = method.toLowerCase();

    if (asteriskToNoExact) {
      exact = !path.includes('*');
      path = path.replace('*', '');
    }

    return { method, path, handler: route[1], exact };
  });
}
