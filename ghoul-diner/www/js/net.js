// Ghoul Diner — online multiplayer via Supabase (anonymous auth, RLS-protected tables, realtime presence).
import config from './config.js';

let sb = null, me = null, lobby = null;
let online = 0;
const listeners = { tip: [], online: [] };

export const enabled = () => !!(config.SUPABASE_URL && config.SUPABASE_ANON_KEY && window.supabase);
export const ready = () => !!me;
export const myId = () => me && me.id;
export const onlineCount = () => online;
export function on(ev, fn) { listeners[ev].push(fn); }

export async function init(name) {
  if (!enabled()) return false;
  try {
    sb = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, { auth: { persistSession: true } });
    let { data: { session } } = await sb.auth.getSession();
    if (!session) {
      const { error } = await sb.auth.signInAnonymously();
      if (error) throw error;
    }
    me = (await sb.auth.getUser()).data.user;
    lobby = sb.channel('lobby', { config: { presence: { key: me.id } } });
    lobby.on('presence', { event: 'sync' }, () => {
      online = Object.keys(lobby.presenceState()).length;
      listeners.online.forEach(f => f(online));
    });
    lobby.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gifts', filter: `to_id=eq.${me.id}` },
      p => listeners.tip.forEach(f => f(p.new)));
    lobby.subscribe(async s => { if (s === 'SUBSCRIBED') await lobby.track({ name }); });
    return true;
  } catch (e) {
    console.warn('multiplayer unavailable', e);
    me = null;
    return false;
  }
}

let lastPub = 0;
export async function publish(profile, force = false) {
  if (!me) return;
  if (!force && Date.now() - lastPub < 30000) return;
  lastPub = Date.now();
  const { error } = await sb.from('diners').upsert({
    id: me.id, name: profile.name, level: profile.level, popularity: profile.popularity,
    served: profile.served, layout: profile.layout, updated_at: new Date().toISOString(),
  });
  if (error) console.warn(error);
}
export async function leaderboard() {
  if (!me) return [];
  const { data, error } = await sb.from('diners').select('id,name,level,popularity,served,likes').order('popularity', { ascending: false }).limit(30);
  if (error) throw error;
  return data;
}
export async function fetchDiner(id) {
  const { data, error } = await sb.from('diners').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
export async function sendTip(id) {
  const { data, error } = await sb.rpc('send_tip', { target: id });
  if (error) throw error;
  return data; // coins sent, 0 if already tipped today
}
export async function claimGifts() {
  if (!me) return { coins: 0, count: 0, names: [] };
  const { data, error } = await sb.rpc('claim_gifts');
  if (error) throw error;
  return data;
}
