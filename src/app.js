import responder from './libs/responder'

function Router(config, controllers)
{
  this.config = config
  this.controllerList = controllers
}

Router.prototype.handle = function(req, res, next)
{
  const routerGroup = req.originalUrl.replace(/^\/([^\/]*).*$/, '$1')

  if (!this.config[routerGroup])
  {
    return responder.notFound(res)
  }

  const matchedRoute = this.config[routerGroup].filter((item) => matchRoute(item.route, req.path))[0]
  if (!this.config[routerGroup])
  {
    return responder.notFound(res)
  }

  const method = matchedRoute.methods[req.method]
  if (!method)
  {
    return responder.notFound(res)
  }

  if (!method.controller || !method.handler)
  {
    console.error("Error: controller and handler has to be defined!");
    return responder.internalError(res)
  }

  const controller = this.controllerList[method.controller]
  if (!controller)
  {
    console.error(`Error: couldn't find '${method.controller}' controller!`);
    return responder.internalError(res)
  }

  const handler = controller[method.handler]
  if (!handler)
  {
    console.error(`Error: couldn't find '${method.handler}' function!`);
    return responder.internalError(res)
  }

  if (next)
  {
    return next(handler)
  }

  return handler(req, res)
}

const matchRoute = function(route, path)
{
  const matcher = new RegExp(route.replace(/:[^\s/]+/g, '([\\w-]+)'))
  return matcher.test(path)
}

export default Router
