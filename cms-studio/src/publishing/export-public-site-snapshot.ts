import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createPublicPagesSnapshot } from '@/publishing/public-page-snapshot'
import { createPublicSiteSnapshot } from '@/publishing/public-site-snapshot'

interface RouteDefinition {
  path?: unknown
}

const payload = await getPayload({ config })

const [navigation, footer, pagesResult] = await Promise.all([
  payload.findGlobal({
    slug: 'site-navigation',
    draft: false,
    depth: 0,
    overrideAccess: true,
  }),
  payload.findGlobal({
    slug: 'site-footer',
    draft: false,
    depth: 0,
    overrideAccess: true,
  }),
  payload.find({
    collection: 'pages',
    draft: false,
    depth: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
  }),
])

const configuredTarget = process.env.PUBLIC_SITE_SNAPSHOT_PATH?.trim()
const siteTarget = configuredTarget
  ? path.resolve(configuredTarget)
  : path.resolve(process.cwd(), '../website/config/published-site.json')
const configDirectory = path.dirname(siteTarget)
const pageTarget = path.resolve(configDirectory, 'published-pages.json')
const routeConfigPath = path.resolve(configDirectory, 'site-routes.json')

const routeDefinitions = JSON.parse(await readFile(routeConfigPath, 'utf8')) as RouteDefinition[]
const reservedPaths = new Set(
  routeDefinitions
    .map((route) => route.path)
    .filter((routePath): routePath is string => typeof routePath === 'string'),
)

const siteSnapshot = createPublicSiteSnapshot({ navigation, footer })
const pagesSnapshot = createPublicPagesSnapshot(pagesResult.docs, reservedPaths)

await mkdir(configDirectory, { recursive: true })
await Promise.all([
  writeFile(siteTarget, `${JSON.stringify(siteSnapshot, null, 2)}\n`, 'utf8'),
  writeFile(pageTarget, `${JSON.stringify(pagesSnapshot, null, 2)}\n`, 'utf8'),
])

payload.logger.info(
  `Exported public website snapshots to ${siteTarget} and ${pageTarget}`,
)
process.exit(0)
