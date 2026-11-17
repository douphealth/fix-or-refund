import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
OUT=Path('/tmp/browser/consumer-desk')
OUT.mkdir(parents=True,exist_ok=True)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  page=await browser.new_page(viewport={'width':1280,'height':1800})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto('http://localhost:8080/en',wait_until='networkidle')
  print('title',await page.title())
  requests=[]
  page.on('request',lambda r:requests.append({'url':r.url,'body':r.post_data or ''}))
  await page.get_by_label('Date of purchase *',exact=True).fill('2026-08-01')
  await page.get_by_role('button',name='Continue to the problem',exact=True).click()
  print('step 2 labels',await page.locator('label').all_text_contents())
  await page.get_by_label('When did it first fail?',exact=False).fill('2026-10-01')
  await page.get_by_role('button',name='Check my potential rights',exact=True).click()
  await page.get_by_role('heading',name='Start with a written seller request.',exact=True).wait_for()
  await page.get_by_label('Your name',exact=True).fill('DESK_PRIVATE_8762')
  await page.get_by_label('Describe the problem',exact=True).fill('DESK_FAULT_9812 screen stopped working')
  await page.context.grant_permissions(['clipboard-read','clipboard-write'])
  await page.get_by_role('button',name='Copy text',exact=True).click()
  assert 'DESK_PRIVATE_8762' in await page.evaluate('navigator.clipboard.readText()')
  async with page.expect_download() as letter_dl:
   await page.get_by_role('button',name='Download TXT',exact=True).click()
  await (await letter_dl.value).save_as(str(OUT/'letter.txt'))
  assert 'DESK_PRIVATE_8762' in (OUT/'letter.txt').read_text()
  await page.emulate_media(media='print')
  assert 'DESK_PRIVATE_8762' in await page.locator('#print-area').inner_text()
  await page.emulate_media(media='screen')
  await page.evaluate('window.__deskShare=null; Object.defineProperty(navigator,"share",{configurable:true,value:async value=>{window.__deskShare=value}})')
  await page.get_by_role('button',name='Share the free guide',exact=True).click()
  shared=await page.evaluate('window.__deskShare')
  assert 'DESK_PRIVATE_8762' not in str(shared) and 'lang=en' in shared['url']
  for width in [320,390,768,1440,2602]:
   await page.set_viewport_size({'width':width,'height':1800})
   assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'result overflow {width}'
  await page.set_viewport_size({'width':1280,'height':1800})
  await page.get_by_role('button',name='Save locally',exact=True).click()
  await page.reload(wait_until='networkidle')
  assert await page.get_by_label('Your name',exact=True).input_value() == 'DESK_PRIVATE_8762'
  await page.get_by_role('button',name='Edit my answers',exact=True).click()
  assert await page.get_by_label('Date of purchase *',exact=True).input_value() == '2026-08-01'
  await page.get_by_role('button',name='Continue to the problem',exact=True).click()
  await page.get_by_role('button',name='Check my potential rights',exact=True).click()
  async with page.expect_download() as dl:
   await page.get_by_role('button',name='Download case pack',exact=True).click()
  download=await dl.value
  await download.save_as(str(OUT/'case.txt'))
  text=(OUT/'case.txt').read_text()
  assert 'DESK_PRIVATE_8762' in text and '6.0.0-review.1' in text
  await page.get_by_role('button',name='Delete saved data',exact=True).click()
  assert await page.evaluate("localStorage.getItem('fix-or-refund-saved-case-v1')") is None
  await page.get_by_role('heading',name='Start with a written seller request.',exact=True).screenshot(path=str(OUT/'result.png'))
  for width in [320,390,768,1440,2602]:
   await page.set_viewport_size({'width':width,'height':1571 if width==2602 else 1800})
   await page.goto('http://localhost:8080/en',wait_until='networkidle')
   assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'overflow {width}'
   if width==390: await page.screenshot(path=str(OUT/'mobile.png'))
  await page.goto('http://localhost:8080/en',wait_until='networkidle')
  radio=page.get_by_role('radio',name='Store / business',exact=True)
  await radio.focus()
  await page.keyboard.press('ArrowRight')
  assert await page.get_by_role('radio',name='Private individual',exact=True).get_attribute('aria-checked') == 'true'
  await page.keyboard.press('ArrowLeft')
  await page.goto('http://localhost:8080/?lang=el',wait_until='networkidle')
  await page.wait_for_url('**/el')
  await page.get_by_label('Ημερομηνία αγοράς *',exact=True).fill('2026-08-01')
  await page.get_by_role('button',name='Συνέχεια στο πρόβλημα',exact=True).click()
  await page.get_by_label('Πότε εμφανίστηκε η βλάβη;',exact=False).fill('2026-10-01')
  await page.get_by_role('button',name='Δες τα πιθανά δικαιώματά μου',exact=True).click()
  await page.get_by_role('heading',name='Ξεκίνα με γραπτό αίτημα στον πωλητή.',exact=True).wait_for()
  await page.get_by_role('button',name='Καθαρισμός',exact=True).click()
  assert await page.get_by_label('Ημερομηνία αγοράς *',exact=True).input_value() == ''
  for lang in ['en','el']:
   for route in ['coverage','methodology','privacy','ownership','guides']:
    r=await page.goto(f'http://localhost:8080/{lang}/{route}',wait_until='networkidle')
    assert r.status==200
    assert await page.locator('h1').inner_text()
  assert not any('DESK_PRIVATE_8762' in str(r) or 'DESK_FAULT_9812' in str(r) for r in requests)
  assert not any('fonts.googleapis.com' in r['url'] for r in requests)
  print('completed English save/restore/edit/export/erase, Greek complete/clear, 5 viewports, 10 content pages; case data absent from observed requests')
  assert not errors, errors
  print('errors',errors)
  await browser.close()
asyncio.run(main())
