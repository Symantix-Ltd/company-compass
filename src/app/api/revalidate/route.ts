import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  const secret = searchParams.get('secret');
    console.log(id)
  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!id) {
    return new Response('Missing `id` param', { status: 400 });
  }

  try {
    await revalidatePath(`/${id}`); // This triggers regeneration
    return new Response(JSON.stringify({ revalidated: true }), { status: 200 });
  } catch (err) {
    return new Response('Revalidation failed', { status: 500 });
  }
}
