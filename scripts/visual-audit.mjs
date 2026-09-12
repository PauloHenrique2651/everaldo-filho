import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto('http://localhost:5173/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  for(const id of ['inicio','transformacao','metodo','canto','studio','planos','escuta','sobre','duvidas','contato']) {
   await page.locator(`#${id}`).evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-80,behavior:'instant'}));
   await page.waitForFunction(()=>[...document.querySelectorAll('.hero-scene')].every(el=>getComputedStyle(el).opacity===(el.classList.contains('is-hidden')?'0':'1')));
   await page.screenshot({path:`artifacts/${device}-${id}.png`,animations:'disabled'});
  }
  await page.close();
 }
 const compact=await browser.newPage({viewport:{width:1365,height:607}});
 await compact.goto('http://localhost:5173/',{waitUntil:'networkidle'});
 await compact.evaluate(()=>document.fonts.ready);
 await compact.screenshot({path:'artifacts/compact-hero.png',animations:'disabled'});
 const horizon=compact.locator('.guitar-horizon');
 const top=await horizon.evaluate(el=>el.getBoundingClientRect().top+scrollY);
 const distance=await horizon.evaluate(el=>el.offsetHeight-el.querySelector('.guitar-horizon-stage').offsetHeight);
 await compact.evaluate(({top,distance})=>window.scrollTo({top:top+distance*.6,behavior:'instant'}),{top,distance});
 await compact.screenshot({path:'artifacts/compact-guitar.png',animations:'disabled'});
 await compact.close();
 console.log('Captured final desktop and mobile views of all eight sections.');
}finally{await browser.close()}
