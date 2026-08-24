import { NextResponse } from 'next/server';
import { DEMO_EXPENSES } from '@/lib/demo-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : 2026;

  const data = DEMO_EXPENSES.filter((e) => e.year === year);
  return NextResponse.json({ success: true, count: data.length, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newExpense = {
      id: `exp-${Date.now()}`,
      committeeId: body.committeeId || 'org-asifabad-gandhichowk',
      year: body.year || 2026,
      expenseName: body.expenseName,
      category: body.category || 'Other',
      amount: body.amount,
      date: body.date || new Date().toISOString().split('T')[0],
      paidBy: body.paidBy || 'Organizer',
      paymentMethod: body.paymentMethod || 'Cash',
      notes: body.notes,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: newExpense }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
