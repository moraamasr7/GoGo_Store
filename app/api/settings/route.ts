// app/api/settings/route.ts
import { NextResponse } from 'next/server';
import { getPublicSettings } from '@/lib/supabase';

export async function GET() {
  const settings = await getPublicSettings();
  return NextResponse.json(settings);
}
