import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // 👈 await obligatoire en Next.js 15
  const { statut } = await request.json()
  const supabase = await createClient()

  if (!['libre', 'occupé'].includes(statut)) {
    return NextResponse.json(
      { error: 'Statut invalide' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('salles')
    .update({ statut })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ salle: data }, { status: 200 })
}