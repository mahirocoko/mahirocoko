import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [index('routes/home-page.tsx'), route('*', 'routes/$.tsx')] satisfies RouteConfig
