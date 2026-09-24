import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createPublicSiteSnapshot } from '@/publishing/public-site-snapshot'

const payload = await getPayload({ config })

const [navigation, footer] = await Promise.all([
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
])

const snapshot = createPublicSiteSnapshot({ navigation, footer })
const configuredTarget = process.env.PUBLIC_SITE_SNAPSHOT_PATH?.trim()
const target = configuredTarget
  ? path.resolve(configuredTarget)
  : path.resolve(process.cwd(), '../website/config/published-site.json')

await mkdir(path.dirname(target), { recursive: true })
await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')

payload.logger.info(`Exported public site snapshot to ${target}`)
process.exit(0)
