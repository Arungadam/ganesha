import { NextResponse } from 'next/server';
import { DEMO_ORGANIZATION, DEMO_MEMBERS } from '@/lib/demo-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      organization: DEMO_ORGANIZATION,
      members: DEMO_MEMBERS,
    },
  });
}
