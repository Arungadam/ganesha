import { NextResponse } from 'next/server';
import { DEMO_CONTRIBUTIONS } from '@/lib/demo-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : 2026;

  const data = DEMO_CONTRIBUTIONS.filter((c) => c.year === year);
  return NextResponse.json({ success: true, count: data.length, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSeq = DEMO_CONTRIBUTIONS.length + 255;
    const yearShort = (body.year || 2026).toString().slice(-2);
    const receiptNumber = `GS${yearShort}-${newSeq.toString().padStart(6, '0')}`;

    const newContribution = {
      id: `cnt-${Date.now()}`,
      receiptNumber,
      committeeId: body.committeeId || 'org-asifabad-gandhichowk',
      year: body.year || 2026,
      contributorId: `ctb-${Date.now()}`,
      contributorName: body.contributorName,
      contributorPhone: body.contributorPhone,
      amount: body.amount,
      paidAmount: body.paidAmount || body.amount,
      date: body.date || new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: body.paymentMethod || 'Cash',
      paymentStatus: body.paymentStatus || 'Paid',
      collectorName: body.collectorName || 'Collector',
      collectorId: body.collectorId || 'mem-1',
      notes: body.notes,
      galli: body.galli || 'Gandhi Chowk',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: newContribution }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
