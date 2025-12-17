import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'fs.json')

function ensureDataDir() {
  const dir = path.dirname(dataPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

export async function GET() {
  try {
    ensureDataDir()
    if (!fs.existsSync(dataPath)) {
      const defaultRoot = {
        id: 'root',
        name: 'Root',
        type: 'folder',
        children: [],
        opened: true,
      }
      fs.writeFileSync(dataPath, JSON.stringify(defaultRoot, null, 2))
      return NextResponse.json(defaultRoot)
    }
    const content = fs.readFileSync(dataPath, 'utf8')
    return NextResponse.json(JSON.parse(content))
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    ensureDataDir()
    fs.writeFileSync(dataPath, JSON.stringify(body, null, 2))
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
