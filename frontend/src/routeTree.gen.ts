

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AssessmentRouteImport } from './routes/assessment'
import { Route as ConnexionRouteImport } from './routes/connexion'
import { Route as HistoryRouteImport } from './routes/history'
import { Route as ProfileRouteImport } from './routes/profile'
import { Route as ResultsRouteImport } from './routes/results'
import { Route as RecommendationIdRouteImport } from './routes/recommendation.$id'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AssessmentRoute = AssessmentRouteImport.update({
  id: '/assessment',
  path: '/assessment',
  getParentRoute: () => rootRouteImport,
} as any)
const ConnexionRoute = ConnexionRouteImport.update({
  id: '/connexion',
  path: '/connexion',
  getParentRoute: () => rootRouteImport,
} as any)
const HistoryRoute = HistoryRouteImport.update({
  id: '/history',
  path: '/history',
  getParentRoute: () => rootRouteImport,
} as any)
const ProfileRoute = ProfileRouteImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => rootRouteImport,
} as any)
const ResultsRoute = ResultsRouteImport.update({
  id: '/results',
  path: '/results',
  getParentRoute: () => rootRouteImport,
} as any)
const RecommendationIdRoute = RecommendationIdRouteImport.update({
  id: '/recommendation/$id',
  path: '/recommendation/$id',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/assessment': typeof AssessmentRoute
  '/connexion': typeof ConnexionRoute
  '/history': typeof HistoryRoute
  '/profile': typeof ProfileRoute
  '/results': typeof ResultsRoute
  '/recommendation/$id': typeof RecommendationIdRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/assessment': typeof AssessmentRoute
  '/connexion': typeof ConnexionRoute
  '/history': typeof HistoryRoute
  '/profile': typeof ProfileRoute
  '/results': typeof ResultsRoute
  '/recommendation/$id': typeof RecommendationIdRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/assessment': typeof AssessmentRoute
  '/connexion': typeof ConnexionRoute
  '/history': typeof HistoryRoute
  '/profile': typeof ProfileRoute
  '/results': typeof ResultsRoute
  '/recommendation/$id': typeof RecommendationIdRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/assessment'
    | '/connexion'
    | '/history'
    | '/profile'
    | '/results'
    | '/recommendation/$id'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/assessment'
    | '/connexion'
    | '/history'
    | '/profile'
    | '/results'
    | '/recommendation/$id'
  id:
    | '__root__'
    | '/'
    | '/assessment'
    | '/connexion'
    | '/history'
    | '/profile'
    | '/results'
    | '/recommendation/$id'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AssessmentRoute: typeof AssessmentRoute
  ConnexionRoute: typeof ConnexionRoute
  HistoryRoute: typeof HistoryRoute
  ProfileRoute: typeof ProfileRoute
  ResultsRoute: typeof ResultsRoute
  RecommendationIdRoute: typeof RecommendationIdRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/assessment': {
      id: '/assessment'
      path: '/assessment'
      fullPath: '/assessment'
      preLoaderRoute: typeof AssessmentRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/connexion': {
      id: '/connexion'
      path: '/connexion'
      fullPath: '/connexion'
      preLoaderRoute: typeof ConnexionRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/history': {
      id: '/history'
      path: '/history'
      fullPath: '/history'
      preLoaderRoute: typeof HistoryRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/profile': {
      id: '/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof ProfileRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/results': {
      id: '/results'
      path: '/results'
      fullPath: '/results'
      preLoaderRoute: typeof ResultsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/recommendation/$id': {
      id: '/recommendation/$id'
      path: '/recommendation/$id'
      fullPath: '/recommendation/$id'
      preLoaderRoute: typeof RecommendationIdRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AssessmentRoute: AssessmentRoute,
  ConnexionRoute: ConnexionRoute,
  HistoryRoute: HistoryRoute,
  ProfileRoute: ProfileRoute,
  ResultsRoute: ResultsRoute,
  RecommendationIdRoute: RecommendationIdRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
