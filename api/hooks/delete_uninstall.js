import { uninstall } from '../../modifyRule';

module.exports = (server) => ({
  method: 'DELETE',
  path: '/.extensions/on-uninstall',
  config: {
    auth: false,
    pre: [
      server.handlers.validateHookToken('/.extensions/on-uninstall'),
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) => {
    uninstall(req.pre.auth0)
      .then(_ => reply().code(204))
      .catch((err) => reply.error(err));
  }
});
