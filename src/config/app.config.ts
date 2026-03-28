import path from 'node:path'
import { concat } from 'concat-str'
import { createAppConfig } from '@/utils/create-app-config'

export default createAppConfig({
  appName: 'xeBook API backend',
  appDescription: concat('xeBook API backend'),
  apiPrefix: 'api',
  uploadDir: path.resolve(process.cwd(), 'storage', 'uploads'),
})
