// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// 1. Zod Validation Schema
const orderInputSchema = z.object({
  customer_name: z.string().trim().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
  customer_phone: z.string().trim().regex(/^(01[0125][0-9]{8}|\+?[0-9]{10,15})$/, 'يرجى إدخال رقم هاتف محمول صحيح (مثال: 01012345678)'),
  customer_email: z.string().trim().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  customer_address: z.string().trim().min(5, 'يرجى كتابة العنوان بالتفصيل (المحافظة والمدينة والشارع)').max(300),
  customer_notes: z.string().trim().max(500).optional().or(z.literal('')),
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const rawCustomerData = {
      customer_name: formData.get('customer_name') as string,
      customer_phone: formData.get('customer_phone') as string,
      customer_email: (formData.get('customer_email') as string) || '',
      customer_address: formData.get('customer_address') as string,
      customer_notes: (formData.get('customer_notes') as string) || '',
    };

    // Validate customer fields
    const parsedData = orderInputSchema.safeParse(rawCustomerData);
    if (!parsedData.success) {
      const errorMsg = parsedData.error.issues[0]?.message || 'بيانات غير صحيحة';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Parse items JSON
    const rawItems = formData.get('items') as string;
    if (!rawItems) {
      return NextResponse.json({ error: 'السلة فارغة' }, { status: 400 });
    }

    let itemsPayload: Array<{ product_id: string; quantity: number; selected_color?: string }> = [];
    try {
      itemsPayload = JSON.parse(rawItems);
    } catch {
      return NextResponse.json({ error: 'تنسيق عناصر السلة غير صالح' }, { status: 400 });
    }

    if (!Array.isArray(itemsPayload) || itemsPayload.length === 0) {
      return NextResponse.json({ error: 'السلة فارغة، يرجى اختيار منتجات أولاً' }, { status: 400 });
    }

    // Validate each item structure
    for (const item of itemsPayload) {
      if (!item.product_id || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json({ error: 'بيانات المنتج داخل السلة غير صالحة' }, { status: 400 });
      }
    }

    // Handle Payment Receipt File Upload (Strict Security)
    let screenshotStoragePath: string | null = null;
    const screenshotFile = formData.get('screenshot') as File | null;

    if (screenshotFile && screenshotFile.size > 0) {
      if (screenshotFile.size > maxFileSize) {
        return NextResponse.json({ error: 'حجم صورة الإيصال يجب ألا يتجاوز 5 ميجابايت' }, { status: 400 });
      }

      if (!allowedMimeTypes.includes(screenshotFile.type)) {
        return NextResponse.json({ error: 'صيغة الملف غير مقبولة. يرجى رفع صورة بصيغة JPG أو PNG أو WEBP' }, { status: 400 });
      }

      // Safe file extension
      const ext = screenshotFile.type === 'image/png' ? 'png' : screenshotFile.type === 'image/webp' ? 'webp' : 'jpg';
      const safeFilename = `receipts/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

      const arrayBuffer = await screenshotFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(safeFilename, buffer, {
          contentType: screenshotFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return NextResponse.json({ error: 'فشل رفع صورة الإيصال. يرجى المحاولة مرة أخرى' }, { status: 500 });
      }

      screenshotStoragePath = uploadData.path;
    }

    // Call Atomic Order Creation RPC
    // Notice: NO client prices or totals are passed! All prices are computed from DB by the RPC.
    const { data: rpcResult, error: rpcError } = await supabase.rpc('create_order_atomic', {
      p_customer_name: parsedData.data.customer_name,
      p_customer_phone: parsedData.data.customer_phone,
      p_customer_email: parsedData.data.customer_email || null,
      p_customer_address: parsedData.data.customer_address,
      p_customer_notes: parsedData.data.customer_notes || null,
      p_payment_screenshot_path: screenshotStoragePath,
      p_items: itemsPayload,
    });

    if (rpcError) {
      console.error('Order atomic RPC error:', rpcError);
      return NextResponse.json(
        { error: rpcError.message || 'تعذر إنشاء الطلب، يرجى المحاولة لاحقاً' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order: rpcResult,
    });
  } catch (err: any) {
    console.error('Unhandled order creation exception:', err);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}
