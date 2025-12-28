import { NextResponse } from 'next/server';
import { createMindMap } from '@/ai/flows/create-mind-map';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { centralTheme, themeDescription, bookTitle, courseName, language, isHorizontal } = body || {};

    if (!centralTheme || !bookTitle || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await createMindMap({
      centralTheme: String(centralTheme),
      themeDescription: themeDescription ? String(themeDescription) : undefined,
      bookTitle: String(bookTitle),
      courseName: courseName ? String(courseName) : undefined,
      language: language === 'en' ? 'en' : 'es',
      isHorizontal: Boolean(isHorizontal),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal error' }, { status: 500 });
  }
}
