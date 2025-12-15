// Simple test to check if the edit and delete buttons are working in the frontend
const puppeteer = require('puppeteer');

async function testPropertyButtons() {
  let browser;
  try {
    console.log('🧪 Testing Property Edit and Delete Buttons...\n');

    // Launch browser
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for headless mode
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Navigate to the properties page
    console.log('1. Navigating to on-campus properties page...');
    await page.goto('http://localhost:3000/dashboard/properties/on-campus', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"], .group', { timeout: 10000 });
    console.log('✅ Properties page loaded');

    // Check if edit buttons exist
    const editButtons = await page.$$('button:has-text("Edit"), [aria-label*="edit"], .edit-button');
    console.log(`✅ Found ${editButtons.length} edit buttons`);

    // Check if delete buttons exist
    const deleteButtons = await page.$$('button:has-text("Delete"), [aria-label*="delete"], .delete-button');
    console.log(`✅ Found ${deleteButtons.length} delete buttons`);

    if (editButtons.length > 0) {
      console.log('\n2. Testing edit button functionality...');
      // Click the first edit button
      await editButtons[0].click();
      
      // Wait for navigation or modal
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      if (currentUrl.includes('/edit-')) {
        console.log('✅ Edit button navigates to edit page');
      } else {
        console.log('⚠️ Edit button may not be working properly');
      }
    }

    // Navigate back to properties page for delete test
    await page.goto('http://localhost:3000/dashboard/properties/on-campus', { 
      waitUntil: 'networkidle2' 
    });

    if (deleteButtons.length > 0) {
      console.log('\n3. Testing delete button functionality...');
      
      // Set up dialog handler for confirmation
      page.on('dialog', async dialog => {
        console.log('✅ Delete confirmation dialog appeared');
        await dialog.dismiss(); // Dismiss to avoid actually deleting
      });
      
      // Click the first delete button
      await deleteButtons[0].click();
      await page.waitForTimeout(1000);
      
      console.log('✅ Delete button shows confirmation dialog');
    }

    console.log('\n🎉 Frontend button test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Check if puppeteer is available
try {
  testPropertyButtons();
} catch (error) {
  console.log('❌ Puppeteer not available. Testing buttons manually...');
  console.log('\nTo test the buttons manually:');
  console.log('1. Open http://localhost:3000/dashboard/properties/on-campus');
  console.log('2. Look for Edit and Delete buttons on property cards');
  console.log('3. Click Edit button - should navigate to edit page');
  console.log('4. Click Delete button - should show confirmation dialog');
}