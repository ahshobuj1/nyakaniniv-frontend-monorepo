// import { NextRequest, NextResponse } from 'next/server'

// export function middleware(req: NextRequest) {
//   const url = req.nextUrl
//   const hostname = req.headers.get('host')

//   // যদি হোস্ট হয় shobuj.deejay.africa, তবে এটি ইন্টারনালি /shobuj এ চলে যাবে
//   const searchParams = url.searchParams.toString()
//   const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`

//   const subdomain = hostname.split('.')[0]
  
//   if (subdomain !== 'www' && subdomain !== 'deejay') {
//     return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url))
//   }
// }
