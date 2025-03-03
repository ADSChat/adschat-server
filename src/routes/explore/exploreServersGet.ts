import { Request, Response, Router } from 'express';
import { customExpressValidatorResult } from '../../common/errorHandler';
import { authenticate } from '../../middleware/authenticate';
import { getPublicServers } from '../../services/Explore';

export function exploreServersGet(Router: Router) {
  Router.get('/explore/servers', authenticate(), route);
}

interface Query {
  sort?: 'pinned_at' | 'most_bumps' | 'most_members' | 'recently_added' | 'recently_bumped';
  filter?: 'pinned' | 'all' | 'verified';
  limit?: string;
  afterId?: string;
  search?: string;
}

async function route(req: Request, res: Response) {
  const query = req.query as Query;
  let limit = query.limit ? parseInt(query.limit as string) : 50;

  if (limit && limit < 0) {
    limit = 50;
  }
  if (limit && limit >= 50) {
    limit = 50;
  }

  const validateError = customExpressValidatorResult(req);
  if (validateError) {
    return res.status(400).json(validateError);
  }

  const publicServer = await getPublicServers({
    sort: query.sort,
    filter: query.filter,
    limit,
    afterId: query.afterId,
    search: query.search,
  });

  res.json(publicServer);
}
