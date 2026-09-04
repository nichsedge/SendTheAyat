// Cloudflare Pages Function for dynamic social OpenGraph preview & client routing
export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  const id = context.params.id as string;
  const db = context.env.DB || context.env.sendtheayat_db || context.env.SENDTHEAYAT_DB;
  const userAgent = (context.request.headers.get('user-agent') || '').toLowerCase();
  
  // Detect crawlers and social media preview bots
  const isSocialBot = /whatsapp|facebookexternalhit|twitterbot|telegrambot|slackbot|discordbot|applebot|linkedinbot|pinterest|googlebot|bingbot/.test(userAgent);

  let recipientName = 'Untukmu';
  let senderName = 'Seseorang yang mendoakanmu';
  let personalNote = '';
  let surahName = 'Al-Insyirah';
  let verseNumber = '5 - 6';
  let translation = 'Maka sesungguhnya bersama kesulitan ada kemudahan.';
  let arabicText = 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا';
  let isPrivate = false;

  // 1. Try decoding ?p= token from query params if available
  const pToken = url.searchParams.get('p');
  if (pToken) {
    try {
      let base64 = pToken.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const jsonStr = atob(base64);
      const parsed = JSON.parse(jsonStr);
      if (parsed) {
        if (parsed.recipientName) recipientName = parsed.recipientName;
        if (parsed.senderName) senderName = parsed.senderName;
        if (parsed.personalNote) personalNote = parsed.personalNote;
        if (parsed.surahName) surahName = parsed.surahName;
        if (parsed.verseNumber) verseNumber = String(parsed.verseNumber);
        if (parsed.translation) translation = parsed.translation;
        if (parsed.arabicText) arabicText = parsed.arabicText;
        if (parsed.isPrivate !== undefined) isPrivate = Boolean(parsed.isPrivate);
      }
    } catch {
      // Ignore token parse error and fallback to DB
    }
  }

  // 2. Query Cloudflare D1 if DB binding exists and token didn't provide full data
  if (db && id) {
    try {
      const row: any = await db.prepare('SELECT * FROM messages WHERE id = ?').bind(id).first();
      if (row) {
        recipientName = row.recipient_name || recipientName;
        senderName = row.sender_name || senderName;
        personalNote = row.personal_note || personalNote;
        surahName = row.surah_name || surahName;
        verseNumber = row.verse_number || verseNumber;
        translation = row.translation || translation;
        arabicText = row.arabic_text || arabicText;
        isPrivate = Boolean(row.is_private);
      }
    } catch (dbErr) {
      console.warn('D1 lookup in Pages Function:', dbErr);
    }
  }

  const origin = url.origin;
  const ogImageUrl = `${origin}/og-cover.png`;
  const pageTitle = `Pesan Ayat untuk ${recipientName} • QS. ${surahName}:${verseNumber} - KirimAyat`;
  const cleanQuote = personalNote
    ? `"${personalNote.replace(/"/g, "'")}" — QS. ${surahName}: ${verseNumber}`
    : `"${translation.replace(/"/g, "'")}" — QS. ${surahName}: ${verseNumber}`;

  // If request is from social bot, return clean HTML shell with rich OpenGraph / Twitter tags
  if (isSocialBot) {
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(cleanQuote)}" />
  
  <!-- OpenGraph Meta Tags -->
  <meta property="og:title" content="💌 Pesan Ayat untuk ${escapeHtml(recipientName)}" />
  <meta property="og:description" content="${escapeHtml(cleanQuote)}" />
  <meta property="og:url" content="${escapeHtml(url.toString())}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="KirimAyat (SendTheAyat)" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="💌 Pesan Ayat untuk ${escapeHtml(recipientName)}" />
  <meta name="twitter:description" content="${escapeHtml(cleanQuote)}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
</head>
<body style="font-family: system-ui, sans-serif; background: #FAF9F5; color: #27272A; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box;">
  <div style="max-width: 500px; width: 100%; background: #ffffff; border: 1px solid #E4E4E7; border-radius: 20px; padding: 24px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
    <div style="font-size: 11px; text-transform: uppercase; color: #047857; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 6px;">KirimAyat.xyz</div>
    <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #18181B;">Pesan Khusus untuk ${escapeHtml(recipientName)}</h2>
    <div style="display: inline-block; background: #ECFDF5; color: #065F46; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px;">
      QS. ${escapeHtml(surahName)} : ${escapeHtml(verseNumber)}
    </div>
    <p style="font-style: italic; color: #52525B; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
      &quot;${escapeHtml(personalNote || translation)}&quot;
    </p>
    <a href="${url.toString()}" style="display: inline-block; background: #064E3B; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 9999px; font-size: 13px; font-weight: 600;">
      Buka Kartu & Dengarkan Ayat
    </a>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // For real browser requests: fetch static Next.js asset and inject dynamic metadata via HTMLRewriter
  try {
    const assetUrl = new URL('/v/view/index.html', url.origin);
    let staticRes: Response;
    if (context.env.ASSETS && typeof context.env.ASSETS.fetch === 'function') {
      staticRes = await context.env.ASSETS.fetch(new Request(assetUrl.toString()));
    } else {
      staticRes = await fetch(assetUrl.toString());
    }

    if (staticRes && staticRes.ok && typeof HTMLRewriter !== 'undefined') {
      return new HTMLRewriter()
        .on('title', {
          element(el) {
            el.setInnerContent(pageTitle);
          },
        })
        .on('head', {
          element(el) {
            el.append(
              `
  <meta property="og:title" content="💌 Pesan Ayat untuk ${escapeHtml(recipientName)}" />
  <meta property="og:description" content="${escapeHtml(cleanQuote)}" />
  <meta property="og:url" content="${escapeHtml(url.toString())}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="💌 Pesan Ayat untuk ${escapeHtml(recipientName)}" />
  <meta name="twitter:description" content="${escapeHtml(cleanQuote)}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
`,
              { html: true }
            );
          },
        })
        .transform(staticRes);
    }
  } catch (assetErr) {
    console.warn('ASSETS fetch fallback in Pages Function:', assetErr);
  }

  // Fallback if HTMLRewriter or ASSETS not available
  return context.next();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
