'use strict';
const page = document.querySelector('#page');
const statusLine = document.querySelector('#status');
const account = document.querySelector('#account');
const sessionKey = 'aseverse-reader-session';
const draftKey = 'aseverse-public-preview';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const listingFields = 'id,title,byline,genre,age_rating';
let config, session, revision = 0, resume = '#discover';
function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function link(text, href) {
  const node = el('a', text); node.href = href; return node;
}
function button(text, run) {
  const node = el('button', text);
  node.type = 'button';
  node.onclick = async () => {
    node.disabled = true;
    try { await run(); } catch (error) { statusLine.textContent = error.message; }
    finally { node.disabled = false; }
  };
  return node;
}
function field(form, name, label, type, autocomplete) {
  const wrapper = el('label', label), input = el('input');
  input.required = true; input.type = type; input.name = name;
  input.autocomplete = autocomplete; wrapper.append(input); form.append(wrapper); return input;
}
function setSession(value) {
  session = value;
  if (value) sessionStorage.setItem(sessionKey, JSON.stringify(value));
  else sessionStorage.removeItem(sessionKey);
  account.textContent = value ? 'Sign out' : 'Sign in';
}
function signIn() {
  if (location.hash !== '#account') resume = location.hash || '#discover';
  location.hash = '#account';
}
async function api(path, {method='GET', body, prefer, auth=true}={}) {
  const headers = {apikey:config.key};
  if (session && auth) headers.Authorization = 'Bearer ' + session.token;
  if (body) headers['Content-Type'] = 'application/json';
  if (prefer) headers.Prefer = prefer;
  const response = await fetch(config.url + path,{method,headers,body:body ? JSON.stringify(body) : undefined});
  const result = await response.text();
  let data; try {data = result ? JSON.parse(result) : null;} catch {data = null;}
  if (!response.ok) {
    if (response.status === 401 && session && auth) { setSession(null); signIn(); throw Error('Please sign in again to continue.'); }
    throw Error(data?.msg || data?.message || data?.error_description || 'Could not finish. Please try again.');
  }
  return data;
}
account.onclick = async () => {
  if (!session) return signIn();
  try { await api('/auth/v1/logout',{method:'POST'}); }
  catch { /* Clear this browser session even when the server is unreachable. */ }
  setSession(null); if (location.hash === '#discover') render(); else location.hash='#discover';
};
function authForm() {
  const form = el('form'); form.append(el('h1','Your AseVerse account'));
  const email = field(form,'email','Email','email','email');
  const password = field(form,'password','Password','password','current-password');
  const actions = el('div',undefined,'actions');
  for (const [label,mode] of [['Sign in','login'],['Create account','signup']]) {
    const b = el('button',label); b.type='submit'; b.value=mode; actions.append(b);
  }
  form.append(actions);
  form.onsubmit = async e => {
    e.preventDefault(); const signup = e.submitter?.value === 'signup';
    const controls = [...actions.children]; controls.forEach(b=>b.disabled=true);
    try {
      const data = await api(signup ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password',{
        method:'POST',auth:false,body:{email:email.value.trim(),password:password.value}
      });
      password.value='';
      if (!data?.access_token) {statusLine.textContent='Check your inbox to confirm your email, then return here and sign in.'; return;}
      setSession({token:data.access_token,id:data.user.id}); location.hash=resume;
    } catch (error) {statusLine.textContent=error.message;}
    finally {controls.forEach(b=>b.disabled=false);}
  };
  return form;
}
function listing(rows, title, empty) {
  const box=el('div'); box.append(el('h1',title));
  if (!rows.length) box.append(el('p',empty,'muted'));
  for (const story of rows) {
    const card=el('article',undefined,'entry'), info=el('div');
    info.append(link(story.title,'#story/'+story.id),el('div','by '+story.byline),el('small',story.genre+' · '+story.age_rating,'muted'));
    card.append(info); box.append(card);
  }
  return box;
}
function catalog() {
  const box=el('div'), list=el('div'), more=button('Show more stories',next);
  box.append(list,more); let offset=0, rows=[];
  async function next() {
    const batch=await api('/rest/v1/reader_stories?select='+listingFields+'&order=published_at.desc,id.asc&limit=24&offset='+offset);
    rows.push(...batch); offset+=batch.length;
    list.replaceChildren(listing(rows,'Discover AseVerse authors','The first story will appear here when an author publishes their opening chapter.'));
    more.hidden=batch.length<24;
  }
  return next().then(()=>box);
}
async function library() {
  if (!session) return gate('My Library','Sign in to keep your saved stories across devices.');
  const box=el('div'), list=el('div'), more=button('Show more saved stories',next);
  box.append(list,more); let rows=[],offset=0;
  async function next() {
    const batch=await api('/rest/v1/reader_saves?select=story_id,reader_stories('+listingFields+')&order=story_id.asc&limit=24&offset='+offset);
    rows.push(...batch.map(r=>r.reader_stories).filter(Boolean)); offset+=batch.length;
    list.replaceChildren(listing(rows,'My Library','Save a story from Discover and you’ll find it here.'));
    more.hidden=batch.length<24;
  }
  await next();return box;
}
function gate(title,message) {
  const box=el('div');box.append(el('h1',title),el('p',message),button('Sign in or create account',signIn));return box;
}
function cover(value) {
  if (!/^data:image\/(?:jpeg|png|webp);base64,/.test(value)) return null;
  const image=el('img',undefined,'hero-cover');image.alt='';image.src=value;return image;
}
async function storyView(id) {
  if (!uuid.test(id)) throw Error('That story link is incomplete.');
  const [story] = await api('/rest/v1/reader_stories?id=eq.'+id+'&select=*');
  if (!story) throw Error('This story is no longer published.');
  const box=el('article'), image=cover(story.cover);if(image)box.append(image);
  box.append(el('h1',story.title),el('p','by '+story.byline),el('p',story.summary),el('p',story.genre+' · '+story.age_rating,'muted'));
  if (story.content_notes) box.append(el('p','Content notes: '+story.content_notes));
  let saved = session && (await api('/rest/v1/reader_saves?select=story_id&story_id=eq.'+id)).length>0;
  const save = button(saved?'Remove from My Library':'Save to My Library', async()=>{
    if (!session) return signIn();
    if (saved) await api('/rest/v1/reader_saves?story_id=eq.'+id,{method:'DELETE'});
    else await api('/rest/v1/reader_saves?on_conflict=reader_id,story_id',{method:'POST',body:{story_id:id},prefer:'resolution=ignore-duplicates'});
    saved=!saved;save.textContent=saved?'Remove from My Library':'Save to My Library';
    statusLine.textContent=saved?'Saved to your library.':'Removed from your library.';
  });
  box.append(save,el('p','CHAPTER 1','muted'),el('h2',story.chapter_title),el('div',story.chapter_body,'chapter'));
  if (session?.id===story.author_id) box.append(button('Unpublish story',async()=>{
    if (!confirm('Remove this chapter from Discover and readers’ libraries? Your Studio draft stays on this device.')) return;
    await api('/rest/v1/reader_stories?id=eq.'+id,{method:'DELETE'}); location.hash='#discover';
  }));
  return box;
}
function publishView() {
  const draft=JSON.parse(sessionStorage.getItem(draftKey)||'null');
  if (!draft) {const box=el('div');box.append(el('h1','Publish an opening chapter'),link('Choose a draft in Creator Studio','prototype'));return box;}
  if (!session) return gate('Publish '+draft.title,'Sign in as the author to review and publish Chapter 1.');
  const box=el('div'),form=el('form'),image=cover(draft.cover);
  if (image)box.append(image);
  box.append(el('h1',draft.title),el('p',draft.summary),el('h2',draft.chapter_title),el('div',draft.chapter_body,'chapter'));
  const name=field(form,'byline','Public author name','text','nickname');name.value=draft.byline;name.maxLength=64;
  form.append(el('p','Publishing makes this cover, story description, author name and opening chapter readable by anyone with the link. Later chapters stay in your local draft.'));
  const submit=el('button','Publish Chapter 1');submit.type='submit';form.append(submit);box.append(form);
  form.onsubmit=async e=>{
    e.preventDefault();submit.disabled=true;
    try{
      await api('/rest/v1/reader_stories?on_conflict=id',{method:'POST',body:{...draft,byline:name.value.trim()},prefer:'resolution=merge-duplicates'});
      sessionStorage.removeItem(draftKey);location.hash='#story/'+draft.id;
    }catch(error){statusLine.textContent=error.message;}finally{submit.disabled=false;}
  };return box;
}
async function render() {
  const current=++revision, route=location.hash.slice(1);
  statusLine.textContent='Loading…';page.replaceChildren();
  try{
    let view;
    if(route==='account')view=authForm();
    else if(route==='publish')view=publishView();
    else if(route==='library')view=await library();
    else if(route.startsWith('story/'))view=await storyView(route.slice(6));
    else view=await catalog();
    if(revision===current){page.replaceChildren(view);statusLine.textContent='';}
  }catch(error){if(revision===current){statusLine.textContent=error.message;page.append(button('Try again',render));}}
}
(async()=>{
  try{
    config=await (await fetch('/api/reader-config',{cache:'no-store'})).json();
    if(!config.url || !config.key)throw Error('Public publishing is not available yet. Your local drafts are still in Creator Studio.');
    setSession(JSON.parse(sessionStorage.getItem(sessionKey)||'null'));
    window.addEventListener('hashchange',render);await render();
  }catch(error){statusLine.textContent=error.message;page.append(link('Back to AseVerse','prototype'));}
})();
