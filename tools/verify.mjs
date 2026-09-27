import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),xml=await readFile(path.join(root,'sitemap.xml'),'utf8');
const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(urls.length,24);assert.equal(new Set(urls).size,urls.length);
let links=0;
for(const url of urls){const pathname=new URL(url).pathname,html=await readFile(path.join(root,decodeURIComponent(pathname),'index.html'),'utf8');
 assert.match(html,/<meta name="description"/);assert.match(html,/<script type="application\/ld\+json">/);assert(html.includes(`<link rel="canonical" href="${url}"`));
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`one heading at ${pathname}`);assert(!html.includes('noindex'));assert(!html.includes('NOT A MOTOR CARRIER'));
 for(const match of html.matchAll(/href="([^"]+)"/g)){const href=match[1].replaceAll('&amp;','&');if(!href.startsWith('/')||href.startsWith('//'))continue;links++;const target=new URL(href,'https://movingfrompuertorico.com');let file=path.join(root,decodeURIComponent(target.pathname));if(file.endsWith('/'))file=path.join(file,'index.html');await access(file);if(target.hash&&target.pathname===pathname)assert(html.includes(`id="${target.hash.slice(1)}"`),`missing ${target.hash} on ${pathname}`)}
}
const home=await readFile(path.join(root,'index.html'),'utf8');assert.match(home,/name="access_key"/);assert.match(home,/name="consent" value="yes" required/);assert.match(home,/href="\/privacy\/"/);
const js=await readFile(path.join(root,'assets/site.js'),'utf8');assert.match(js,/data.success!==true/);assert(js.indexOf("event('generate_lead')")>js.indexOf('data.success!==true'));assert.match(js,/if\(busy\)return/);
console.log(`Static checks passed: ${urls.length} pages, ${links} local links, metadata, form and confirmed-lead guard.`);
if(process.argv.includes('--browser')){
 const {createRequire}=await import('node:module');const require=createRequire(import.meta.url);const {chromium}=require('playwright');
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{for(const width of [320,390,768,1440]){const page=await browser.newPage({viewport:{width,height:850}});await page.goto('http://127.0.0.1:8077/');assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`overflow at ${width}px`);await page.close()}
 const page=await browser.newPage({viewport:{width:390,height:844}});let calls=0,payload;await page.route('https://api.web3forms.com/submit',async route=>{calls++;payload=JSON.parse(route.request().postData());await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:calls!==1})})});
 await page.goto('http://127.0.0.1:8077/?utm_source=test&utm_medium=email');await page.locator('#explore-destination').selectOption('New York');await page.locator('#explore-quote').click();assert.equal(await page.locator('#moving_to').inputValue(),'New York');await page.locator('#moving_from').fill('San Juan');await page.locator('#move_date').fill('2027-01-15');await page.locator('#move_size').selectOption('2 Bedroom');await page.locator('[data-step="0"] [data-next]').click();await page.locator('[data-step="1"] [data-next]').click();await page.locator('#full_name').fill('Test Person');await page.locator('#phone').fill('2125550100');await page.locator('[name="consent"]').check();await page.locator('#form-submit').click();await page.waitForTimeout(100);assert.match(await page.locator('#form-status').innerText(),/could not confirm/);assert.equal(await page.locator('#full_name').inputValue(),'Test Person');assert.equal(payload.traffic_source,'test');assert.equal(payload.source,'MovingFromPuertoRico.com');await page.locator('#form-submit').click();await page.waitForTimeout(100);assert.match(await page.locator('#form-status').innerText(),/received/);assert.equal(calls,2);const events=await page.evaluate(()=>window.dataLayer.filter(x=>x[0]==='event').map(x=>x[1]));assert.equal(events.filter(e=>e==='generate_lead').length,1);
 await page.goto('http://127.0.0.1:8077/puerto-rico-to-new-york/');await page.locator('a[href*="route_page"]').first().click();assert.equal(await page.locator('[name="route_page"]').inputValue(),'/puerto-rico-to-new-york/');assert.equal(await page.locator('[name="moving_to"]').inputValue(),'New York');await page.goto('http://127.0.0.1:8077/es/');assert.equal(await page.locator('html').getAttribute('lang'),'es');await page.close();console.log('Browser checks passed: 4 widths, tools, form failure/success, lead analytics, guide attribution, Spanish.');
 }finally{await browser.close()}
}
