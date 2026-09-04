export async function onRequestGet(context: any) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  const q = url.searchParams.get('q')?.toLowerCase().trim();
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);
  
  // Support both DB and sendtheayat_db bindings
  const db = context.env.DB || context.env.sendtheayat_db || context.env.SENDTHEAYAT_DB;

  try {
    if (!db) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'D1 not bound', 
        availableKeys: Object.keys(context.env || {}) 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (id) {
      const row: any = await db.prepare('SELECT * FROM messages WHERE id = ?').bind(id).first();
      if (!row) {
        return new Response(JSON.stringify({ success: false, error: 'Message not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const message = {
        id: row.id,
        recipientName: row.recipient_name,
        senderName: row.sender_name,
        personalNote: row.personal_note,
        surahNumber: row.surah_number,
        surahName: row.surah_name,
        surahArabic: row.surah_arabic,
        surahTranslation: row.surah_translation,
        verseNumber: row.verse_number,
        arabicText: row.arabic_text,
        translation: row.translation,
        theme: row.theme,
        audioUrl: row.audio_url,
        isPrivate: Boolean(row.is_private),
        views: row.views || 1,
        reactions: {
          aamiin: row.reactions_aamiin || 0,
          heart: row.reactions_heart || 0,
          peace: row.reactions_peace || 0,
        },
        createdAt: row.created_at,
      };

      return new Response(JSON.stringify({ success: true, message }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Attempt auto-migration of is_private column gracefully
    try {
      await db.prepare('ALTER TABLE messages ADD COLUMN is_private INTEGER DEFAULT 0').run();
    } catch {
      // Column may already exist, ignore error
    }

    let query = 'SELECT * FROM messages WHERE (is_private IS NULL OR is_private = 0) ORDER BY created_at DESC LIMIT ?';
    let bindings: any[] = [limit];

    if (q) {
      query = 'SELECT * FROM messages WHERE (is_private IS NULL OR is_private = 0) AND (LOWER(recipient_name) LIKE ? OR LOWER(sender_name) LIKE ? OR LOWER(personal_note) LIKE ? OR LOWER(surah_name) LIKE ?) ORDER BY created_at DESC LIMIT ?';
      const term = `%${q}%`;
      bindings = [term, term, term, term, limit];
    }

    const { results } = await db.prepare(query).bind(...bindings).all();

    const messages = (results || []).map((row: any) => ({
      id: row.id,
      recipientName: row.recipient_name,
      senderName: row.sender_name,
      personalNote: row.personal_note,
      surahNumber: row.surah_number,
      surahName: row.surah_name,
      surahArabic: row.surah_arabic,
      surahTranslation: row.surah_translation,
      verseNumber: row.verse_number,
      arabicText: row.arabic_text,
      translation: row.translation,
      theme: row.theme,
      audioUrl: row.audio_url,
      isPrivate: Boolean(row.is_private),
      views: row.views || 1,
      reactions: {
        aamiin: row.reactions_aamiin || 0,
        heart: row.reactions_heart || 0,
        peace: row.reactions_peace || 0,
      },
      createdAt: row.created_at,
    }));

    return new Response(JSON.stringify({ success: true, total: messages.length, messages }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function onRequestPost(context: any) {
  const db = context.env.DB || context.env.sendtheayat_db || context.env.SENDTHEAYAT_DB;
  try {
    const body: any = await context.request.json();
    const id = body.id || `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = body.createdAt || Date.now();
    const isPrivate = body.isPrivate ? 1 : 0;

    if (!db) {
      return new Response(JSON.stringify({ success: false, error: 'D1 not bound', availableKeys: Object.keys(context.env || {}) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Auto-migrate column if not present yet
    try {
      await db.prepare('ALTER TABLE messages ADD COLUMN is_private INTEGER DEFAULT 0').run();
    } catch {
      // Column already exists
    }

    await db.prepare(`
      INSERT OR REPLACE INTO messages (
        id, recipient_name, sender_name, personal_note,
        surah_number, surah_name, surah_arabic, surah_translation,
        verse_number, arabic_text, translation, theme, audio_url,
        is_private, views, reactions_aamiin, reactions_heart, reactions_peace, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, 0, ?)
    `).bind(
      id,
      body.recipientName || 'Untukmu',
      body.senderName || 'Seseorang yang mendoakanmu',
      body.personalNote || '',
      Number(body.surahNumber) || 1,
      body.surahName || 'Al-Fatihah',
      body.surahArabic || '',
      body.surahTranslation || '',
      String(body.verseNumber || '1'),
      body.arabicText || '',
      body.translation || '',
      body.theme || 'emerald-sand',
      body.audioUrl || '',
      isPrivate,
      createdAt
    ).run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || 'Insert error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
