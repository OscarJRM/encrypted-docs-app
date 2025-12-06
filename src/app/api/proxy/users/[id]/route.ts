// src/app/api/proxy/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'https://encrypteddocumentsapi.onrender.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Ahora params es Promise
) {
  try {
    const { id } = await params; // ✅ Hacer await de params
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${BACKEND_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error en proxy:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Ahora params es Promise
) {
  try {
    const { id } = await params; // ✅ Hacer await de params
    const token = request.headers.get('authorization');
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error en proxy:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Ahora params es Promise
) {
  try {
    const { id } = await params; // ✅ Hacer await de params
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${BACKEND_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    if (response.status === 204 || response.status === 200) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error en proxy:', error);
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}