import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleI18nRouting } from '@/shared/lib/i18n-middleware';

// Environment variables برای فعال/غیرفعال کردن لایه‌های حفاظتی
const SECURITY_LAYERS = {
  RSC_PROTECTION: process.env.NEXT_PUBLIC_ENABLE_RSC_PROTECTION !== 'false',
  RSC_HEADER_VALIDATION: process.env.NEXT_PUBLIC_ENABLE_RSC_HEADER_VALIDATION !== 'false',
  SERVER_ACTION_PROTECTION: process.env.NEXT_PUBLIC_ENABLE_SERVER_ACTION_PROTECTION !== 'false',
  HEADER_MANIPULATION_PROTECTION: process.env.NEXT_PUBLIC_ENABLE_HEADER_MANIPULATION_PROTECTION !== 'false',
  RCE_PROTECTION: process.env.NEXT_PUBLIC_ENABLE_RCE_PROTECTION !== 'false',
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip proxy for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // 1) بلاک درخواست‌هایی که RSC stream نیستند اما سعی دارند مسیر RSC را صدا بزنند
  if (SECURITY_LAYERS.RSC_PROTECTION) {
    if (
      pathname.startsWith('/_next/data') &&
      request.headers.get('content-type') !== 'application/json'
    ) {
      return NextResponse.json(
        { error: 'Blocked suspicious RSC request' },
        { status: 400 }
      );
    }
  }

  // 2) بلاک درخواست‌هایی که headerهای RSC را جعل می‌کنند
  if (SECURITY_LAYERS.RSC_HEADER_VALIDATION) {
    const rsc = request.headers.get('rsc');
    if (rsc && !['1', '2'].includes(rsc)) {
      return NextResponse.json(
        { error: 'Forbidden manipulation attempt' },
        { status: 403 }
      );
    }
  }

  // 3) محافظت در برابر حملات Server Action
  if (SECURITY_LAYERS.SERVER_ACTION_PROTECTION) {
    const nextAction = request.headers.get('next-action');
    if (nextAction && request.method === 'POST') {
      const contentType = request.headers.get('content-type') || '';

      // بررسی Content-Type برای Server Actions
      if (contentType.includes('multipart/form-data')) {
        // بررسی Action ID format (باید hash معتبر باشد)
        const actionIdPattern = /^[a-f0-9]{40}$/; // SHA-1 hash format
        if (!actionIdPattern.test(nextAction)) {
          return NextResponse.json(
            { error: 'Invalid Server Action ID' },
            { status: 400 }
          );
        }

        // محدودیت اندازه Content-Length (حداکثر 10MB)
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'Payload too large' },
            { status: 413 }
          );
        }

        // بررسی boundary در Content-Type
        const boundaryMatch = contentType.match(/boundary=([^;]+)/);
        if (boundaryMatch) {
          const boundary = boundaryMatch[1].trim();
          // بررسی boundary معتبر (نباید خالی یا خیلی کوتاه باشد)
          if (boundary.length < 3 || boundary.length > 70) {
            return NextResponse.json(
              { error: 'Invalid boundary format' },
              { status: 400 }
            );
          }
        }
      }
    }
  }

  // 4) محافظت در برابر Header Manipulation
  if (SECURITY_LAYERS.HEADER_MANIPULATION_PROTECTION) {
    const suspiciousHeaders = [
      'x-forwarded-host',
      'x-forwarded-proto',
      'x-original-url',
      'x-rewrite-url',
    ];

    for (const header of suspiciousHeaders) {
      const value = request.headers.get(header);
      if (value && !value.includes(request.nextUrl.hostname)) {
        // اگر header مشکوک است و با hostname فعلی مطابقت ندارد
        console.warn(`Suspicious header detected: ${header}=${value}`);
      }
    }
  }

  // 5) محافظت در برابر Prototype Pollution و RCE patterns
  if (SECURITY_LAYERS.RCE_PROTECTION) {
    if (request.method === 'POST') {
      const contentType = request.headers.get('content-type') || '';
      if (
        contentType.includes('application/json') ||
        contentType.includes('multipart/form-data')
      ) {
        // بررسی URL برای الگوهای خطرناک RCE و Prototype Pollution
        const dangerousPatterns = [
          '__proto__',
          'constructor',
          'prototype',
          '$',
          '$@',
          'eval(',
          'eval%28',
          'Function(',
          'Function%28',
          'require(',
          'require%28',
          'child_process',
          'execSync',
          'exec(',
          'spawn',
          'process.',
          'process%2E',
          'mainModule',
          '_response',
          '_prefix',
          'binding(',
          'import(',
        ];

        const urlString = request.url.toLowerCase();
        for (const pattern of dangerousPatterns) {
          if (urlString.includes(pattern.toLowerCase())) {
            console.error(`🚨 RCE/Prototype Pollution attempt blocked: ${pattern}`);
            return NextResponse.json(
              { error: 'Dangerous pattern detected' },
              { status: 403 }
            );
          }
        }

        // بررسی User-Agent برای patterns مشکوک
        const userAgent = request.headers.get('user-agent') || '';
        if (
          userAgent.includes('eval') ||
          userAgent.includes('Function') ||
          userAgent.includes('require') ||
          userAgent.includes('child_process')
        ) {
          console.error(`🚨 Suspicious User-Agent: ${userAgent}`);
          return NextResponse.json(
            { error: 'Suspicious request' },
            { status: 403 }
          );
        }
      }
    }
  }

  // Handle i18n routing
  const i18nResponse = handleI18nRouting(request);
  if (i18nResponse) {
    return i18nResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Security checks + i18n routing
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|admin).*)',
  ],
};