import responder from './libs/responder'

var __config = {}
var __controllerList = {}

function Router(config, controllers)
{
  __config = config
  __controllerList = controllers
}

Router.prototype.handle = function(req, res, next)
{
  const routerGroup = req.originalUrl.replace(/^\/([^\/]*).*$/, '$1')

  if (!__config[routerGroup])
  {
    return responder.accessDenied(res)
  }

  const matchedRoute = __config[routerGroup].filter((item) => matchRoute(item.route, req.path))[0]
  if (!__config[routerGroup])
  {
    return responder.accessDenied(res)
  }

  const method = matchedRoute.methods[req.method]
  if (!method)
  {
    return responder.accessDenied(res)
  }

  if (!method.controller || !method.handler)
  {
    console.error("Error: controller and handler has to be defined!");
    return responder.accessDenied(res)
  }

  const controller = __controllerList[method.controller]
  if (!controller)
  {
    console.error(`Error: couldn't find '${method.controller}' controller!`);
    return responder.accessDenied(res)
  }

  const handler = controller[method.handler]
  if (!handler)
  {
    console.error(`Error: couldn't find '${method.handler}' function!`);
    return responder.accessDenied(res)
  }

  return handler(req, res)
}

const matchRoute = function(route, path)
{
  const matcher = new RegExp(route.replace(/:[^\s/]+/g, '([\\w-]+)'))
  return matcher.test(path)
}

export default Router
