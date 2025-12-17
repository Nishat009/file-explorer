import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const dir = searchParams.get('dir') || '.'
  const fullPath = path.resolve(dir)

  // For security, check if within project root
  const projectRoot = process.cwd()
  if (!fullPath.startsWith(projectRoot)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  try {
    const items = fs.readdirSync(fullPath, { withFileTypes: true })
    const result = items.map(item => ({
      name: item.name,
      isDirectory: item.isDirectory(),
      size: item.isFile() ? fs.statSync(path.join(fullPath, item.name)).size : 0,
      modified: item.isFile() ? fs.statSync(path.join(fullPath, item.name)).mtime : null
    }))
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}