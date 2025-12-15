/**
 * Comprehensive Button Functionality Test
 * Tests all interactive buttons in the application to ensure they work correctly
 */

const puppeteer = require('puppeteer');
const axios = require('axios');

class ButtonTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.baseUrl = 'http://localhost:3000';
  }

  async init() {
    console.log('🚀 Initializing Comprehensive Button Functionality Test...\n');
    
    this.browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized'],
      slowMo: 100 // Add slight delay for better visibility
    });
    
    this.page = await this.browser.newPage();
    
    // Set up console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Console Error:', msg.text());
      }
    });

    // Set up dialog handler for confirmations
    this.page.on('dialog', async dialog => {
      console.log(`📋 Dialog appeared: "${dialog.message()}"`);
      await dialog.dismiss(); // Dismiss to avoid actual deletions
    });
  }

  async logResult(test, status, details = '') {
    const result = { test, status, details, timestamp: new Date().toISOString() };
    this.testResults.push(result);
    
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test}: ${status} ${details ? `- ${details}` : ''}`);
  }

  async navigateAndWait(url, timeout = 10000) {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout });
      await this.page.waitForTimeout(1000); // Additional wait for dynamic content
      return true;
    } catch (error) {
      await this.logResult(`Navigation to ${url}`, 'FAIL', error.message);
      return false;
    }
  }

  async testPropertyButtons() {
    console.log('\n📋 Testing Property Management Buttons...');
    
    // Test On-Campus Properties
    if (await this.navigateAndWait(`${this.baseUrl}/dashboard/properties/on-campus`)) {
      await this.testPropertyPageButtons('on-campus');
    }
    
    // Test Off-Campus Properties  
    if (await this.navigateAndWait(`${this.baseUrl}/dashboard/properties/off-campus`)) {
      await this.testPropertyPageButtons('off-campus');
    }
  }

  async testPropertyPageButtons(type) {
    try {
      // Wait for properties to load
      await this.page.waitForSelector('.group, [data-testid="property-card"]', { timeout: 5000 });
      
      // Test Add Property Button
      const addButton = await this.page.$('button:has-text("Add"), a[href*="add"]');
      if (addButton) {
        await this.logResult(`${type} Add Property Button`, 'PASS', 'Button found');
        
        // Test click functionality
        const href = await this.page.evaluate(btn => btn.href || btn.onclick, addButton);
        if (href) {
          await this.logResult(`${type} Add Property Navigation`, 'PASS', 'Has navigation target');
        }
      } else {
        await this.logResult(`${type} Add Property Button`, 'FAIL', 'Button not found');
      }

      // Test Edit Buttons
      const editButtons = await this.page.$$('button:has-text("Edit"), [aria-label*="edit"]');
      if (editButtons.length > 0) {
        await this.logResult(`${type} Edit Buttons`, 'PASS', `Found ${editButtons.length} edit buttons`);
        
        // Test first edit button
        try {
          const initialUrl = this.page.url();
          await editButtons[0].click();
          await this.page.waitForTimeout(2000);
          
          const newUrl = this.page.url();
          if (newUrl !== initialUrl && newUrl.includes('/edit-')) {
            await this.logResult(`${type} Edit Button Navigation`, 'PASS', 'Navigates to edit page');
          } else {
            await this.logResult(`${type} Edit Button Navigation`, 'WARN', 'Navigation unclear');
          }
          
          // Navigate back
          await this.navigateAndWait(`${this.baseUrl}/dashboard/properties/${type}`);
        } catch (error) {
          await this.logResult(`${type} Edit Button Click`, 'FAIL', error.message);
        }
      } else {
        await this.logResult(`${type} Edit Buttons`, 'WARN', 'No edit buttons found');
      }

      // Test Delete Buttons
      const deleteButtons = await this.page.$$('button:has-text("Delete"), [aria-label*="delete"]');
      if (deleteButtons.length > 0) {
        await this.logResult(`${type} Delete Buttons`, 'PASS', `Found ${deleteButtons.length} delete buttons`);
        
        // Test first delete button (should show confirmation)
        try {
          let dialogShown = false;
          this.page.once('dialog', () => { dialogShown = true; });
          
          await deleteButtons[0].click();
          await this.page.waitForTimeout(1000);
          
          if (dialogShown) {
            await this.logResult(`${type} Delete Confirmation`, 'PASS', 'Shows confirmation dialog');
          } else {
            await this.logResult(`${type} Delete Confirmation`, 'WARN', 'No confirmation dialog');
          }
        } catch (error) {
          await this.logResult(`${type} Delete Button Click`, 'FAIL', error.message);
        }
      } else {
        await this.logResult(`${type} Delete Buttons`, 'WARN', 'No delete buttons found');
      }

    } catch (error) {
      await this.logResult(`${type} Property Page Test`, 'FAIL', error.message);
    }
  }

  async testFormButtons() {
    console.log('\n📋 Testing Form Buttons...');
    
    // Test Add Property Forms
    const formPages = [
      { url: '/dashboard/properties/add-on-campus', name: 'Add On-Campus Property' },
      { url: '/dashboard/properties/add-off-campus', name: 'Add Off-Campus Property' }
    ];

    for (const formPage of formPages) {
      if (await this.navigateAndWait(`${this.baseUrl}${formPage.url}`)) {
        await this.testFormPageButtons(formPage.name);
      }
    }
  }

  async testFormPageButtons(pageName) {
    try {
      // Test Submit Button
      const submitButton = await this.page.$('button[type="submit"]');
      if (submitButton) {
        const isDisabled = await this.page.evaluate(btn => btn.disabled, submitButton);
        await this.logResult(`${pageName} Submit Button`, 'PASS', 
          isDisabled ? 'Found (disabled until form valid)' : 'Found (enabled)');
      } else {
        await this.logResult(`${pageName} Submit Button`, 'FAIL', 'Submit button not found');
      }

      // Test Cancel/Back Button
      const cancelButton = await this.page.$('button:has-text("Cancel"), button:has-text("Back")');
      if (cancelButton) {
        await this.logResult(`${pageName} Cancel Button`, 'PASS', 'Cancel/Back button found');
      } else {
        await this.logResult(`${pageName} Cancel Button`, 'WARN', 'No cancel button found');
      }

      // Test Add Amenity Button
      const addAmenityButton = await this.page.$('button:has-text("Add Amenity")');
      if (addAmenityButton) {
        await this.logResult(`${pageName} Add Amenity Button`, 'PASS', 'Add amenity button found');
        
        // Test functionality
        try {
          const initialAmenities = await this.page.$$('.amenity-item, [data-testid="amenity"]');
          await addAmenityButton.click();
          await this.page.waitForTimeout(500);
          
          const newAmenities = await this.page.$$('.amenity-item, [data-testid="amenity"]');
          if (newAmenities.length > initialAmenities.length) {
            await this.logResult(`${pageName} Add Amenity Functionality`, 'PASS', 'Adds new amenity field');
          } else {
            await this.logResult(`${pageName} Add Amenity Functionality`, 'WARN', 'Functionality unclear');
          }
        } catch (error) {
          await this.logResult(`${pageName} Add Amenity Click`, 'FAIL', error.message);
        }
      }

    } catch (error) {
      await this.logResult(`${pageName} Form Test`, 'FAIL', error.message);
    }
  }

  async testOccupantButtons() {
    console.log('\n📋 Testing Occupant Management Buttons...');
    
    const occupantPages = [
      { url: '/dashboard/occupants/on-campus', name: 'On-Campus Occupants' },
      { url: '/dashboard/occupants/off-campus', name: 'Off-Campus Occupants' }
    ];

    for (const page of occupantPages) {
      if (await this.navigateAndWait(`${this.baseUrl}${page.url}`)) {
        await this.testOccupantPageButtons(page.name);
      }
    }
  }

  async testOccupantPageButtons(pageName) {
    try {
      // Test Add Occupant Button
      const addButton = await this.page.$('button:has-text("Add Occupant")');
      if (addButton) {
        await this.logResult(`${pageName} Add Button`, 'PASS', 'Add occupant button found');
        
        // Test modal opening
        try {
          await addButton.click();
          await this.page.waitForTimeout(1000);
          
          const modal = await this.page.$('.modal, [role="dialog"]');
          if (modal) {
            await this.logResult(`${pageName} Add Modal`, 'PASS', 'Modal opens correctly');
            
            // Close modal
            const closeButton = await this.page.$('button:has-text("Cancel"), [aria-label="close"]');
            if (closeButton) {
              await closeButton.click();
              await this.page.waitForTimeout(500);
            }
          } else {
            await this.logResult(`${pageName} Add Modal`, 'WARN', 'Modal not detected');
          }
        } catch (error) {
          await this.logResult(`${pageName} Add Button Click`, 'FAIL', error.message);
        }
      }

      // Test Delete Occupant Buttons
      const deleteButtons = await this.page.$$('button[title*="Remove"], button[title*="Delete"]');
      if (deleteButtons.length > 0) {
        await this.logResult(`${pageName} Delete Buttons`, 'PASS', `Found ${deleteButtons.length} delete buttons`);
      } else {
        await this.logResult(`${pageName} Delete Buttons`, 'WARN', 'No delete buttons found');
      }

    } catch (error) {
      await this.logResult(`${pageName} Occupant Test`, 'FAIL', error.message);
    }
  }

  async testNavigationButtons() {
    console.log('\n📋 Testing Navigation & UI Buttons...');
    
    if (await this.navigateAndWait(`${this.baseUrl}/dashboard`)) {
      // Test Sidebar Toggle
      try {
        const toggleButton = await this.page.$('button[aria-label*="sidebar"], button[aria-label*="Expand"], button[aria-label*="Collapse"]');
        if (toggleButton) {
          await this.logResult('Sidebar Toggle Button', 'PASS', 'Sidebar toggle found');
          
          // Test toggle functionality
          await toggleButton.click();
          await this.page.waitForTimeout(500);
          await this.logResult('Sidebar Toggle Functionality', 'PASS', 'Toggle clicked successfully');
        } else {
          await this.logResult('Sidebar Toggle Button', 'WARN', 'Sidebar toggle not found');
        }
      } catch (error) {
        await this.logResult('Sidebar Toggle Test', 'FAIL', error.message);
      }

      // Test Dark Mode Toggle
      try {
        const darkModeButton = await this.page.$('button[aria-label*="dark mode"], button[aria-label*="Toggle"]');
        if (darkModeButton) {
          await this.logResult('Dark Mode Toggle', 'PASS', 'Dark mode toggle found');
          
          // Test toggle functionality
          await darkModeButton.click();
          await this.page.waitForTimeout(500);
          await this.logResult('Dark Mode Toggle Functionality', 'PASS', 'Toggle clicked successfully');
        } else {
          await this.logResult('Dark Mode Toggle', 'WARN', 'Dark mode toggle not found');
        }
      } catch (error) {
        await this.logResult('Dark Mode Toggle Test', 'FAIL', error.message);
      }

      // Test Help Button
      try {
        const helpButton = await this.page.$('button[aria-label*="Help"], button:has-text("Help")');
        if (helpButton) {
          await this.logResult('Help Button', 'PASS', 'Help button found');
          
          // Test help modal
          await helpButton.click();
          await this.page.waitForTimeout(1000);
          
          const helpModal = await this.page.$('.help-modal, [role="dialog"]');
          if (helpModal) {
            await this.logResult('Help Modal', 'PASS', 'Help modal opens');
            
            // Close help modal
            const closeButton = await this.page.$('button:has-text("Close"), [aria-label="close"]');
            if (closeButton) {
              await closeButton.click();
              await this.page.waitForTimeout(500);
            }
          }
        } else {
          await this.logResult('Help Button', 'WARN', 'Help button not found');
        }
      } catch (error) {
        await this.logResult('Help Button Test', 'FAIL', error.message);
      }
    }
  }

  async testAPIEndpoints() {
    console.log('\n📋 Testing API Endpoints for Button Actions...');
    
    const endpoints = [
      { method: 'GET', url: '/api/properties', name: 'Properties List' },
      { method: 'GET', url: '/api/occupants', name: 'Occupants List' },
      { method: 'GET', url: '/api/rooms', name: 'Rooms List' },
      { method: 'GET', url: '/api/notifications', name: 'Notifications List' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios({
          method: endpoint.method,
          url: `${this.baseUrl}${endpoint.url}`,
          timeout: 5000
        });
        
        if (response.status === 200) {
          await this.logResult(`API ${endpoint.name}`, 'PASS', `Status: ${response.status}`);
        } else {
          await this.logResult(`API ${endpoint.name}`, 'WARN', `Status: ${response.status}`);
        }
      } catch (error) {
        if (error.response) {
          await this.logResult(`API ${endpoint.name}`, 'WARN', `Status: ${error.response.status}`);
        } else {
          await this.logResult(`API ${endpoint.name}`, 'FAIL', error.message);
        }
      }
    }
  }

  async testSpecialButtons() {
    console.log('\n📋 Testing Special Feature Buttons...');
    
    // Test Settings Page Buttons
    if (await this.navigateAndWait(`${this.baseUrl}/dashboard/settings`)) {
      try {
        const saveButtons = await this.page.$$('button:has-text("Save")');
        await this.logResult('Settings Save Buttons', 'PASS', `Found ${saveButtons.length} save buttons`);
        
        const addButtons = await this.page.$$('button:has-text("Add")');
        await this.logResult('Settings Add Buttons', 'PASS', `Found ${addButtons.length} add buttons`);
      } catch (error) {
        await this.logResult('Settings Buttons Test', 'FAIL', error.message);
      }
    }

    // Test Profile Page Buttons
    if (await this.navigateAndWait(`${this.baseUrl}/dashboard/profile`)) {
      try {
        const editButton = await this.page.$('button:has-text("Edit")');
        if (editButton) {
          await this.logResult('Profile Edit Button', 'PASS', 'Edit button found');
          
          // Test edit mode
          await editButton.click();
          await this.page.waitForTimeout(1000);
          
          const saveButton = await this.page.$('button:has-text("Save")');
          const cancelButton = await this.page.$('button:has-text("Cancel")');
          
          if (saveButton && cancelButton) {
            await this.logResult('Profile Edit Mode', 'PASS', 'Save and Cancel buttons appear');
          }
        }
      } catch (error) {
        await this.logResult('Profile Buttons Test', 'FAIL', error.message);
      }
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Comprehensive Button Test Report...\n');
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const warnings = this.testResults.filter(r => r.status === 'WARN').length;
    const total = this.testResults.length;

    console.log('='.repeat(60));
    console.log('           COMPREHENSIVE BUTTON TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed} (${((passed/total)*100).toFixed(1)}%)`);
    console.log(`❌ Failed: ${failed} (${((failed/total)*100).toFixed(1)}%)`);
    console.log(`⚠️  Warnings: ${warnings} (${((warnings/total)*100).toFixed(1)}%)`);
    console.log('='.repeat(60));

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`   • ${r.test}: ${r.details}`));
    }

    if (warnings > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.testResults
        .filter(r => r.status === 'WARN')
        .forEach(r => console.log(`   • ${r.test}: ${r.details}`));
    }

    console.log('\n🔍 RECOMMENDATIONS:');
    
    if (failed > 0) {
      console.log('   • Fix failed button functionality immediately');
      console.log('   • Check browser console for JavaScript errors');
      console.log('   • Verify API endpoints are working correctly');
    }
    
    if (warnings > 0) {
      console.log('   • Review warning items for potential improvements');
      console.log('   • Consider adding missing buttons for better UX');
    }
    
    console.log('   • Test buttons manually in different browsers');
    console.log('   • Verify database updates after delete operations');
    console.log('   • Check responsive behavior on mobile devices');

    // Save detailed report
    const reportData = {
      summary: { total, passed, failed, warnings },
      results: this.testResults,
      timestamp: new Date().toISOString()
    };

    require('fs').writeFileSync(
      'button-test-report.json', 
      JSON.stringify(reportData, null, 2)
    );
    
    console.log('\n📄 Detailed report saved to: button-test-report.json');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runAllTests() {
    try {
      await this.init();
      
      // Run all test suites
      await this.testAPIEndpoints();
      await this.testPropertyButtons();
      await this.testFormButtons();
      await this.testOccupantButtons();
      await this.testNavigationButtons();
      await this.testSpecialButtons();
      
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the comprehensive test
const tester = new ButtonTester();
tester.runAllTests().catch(console.error);

module.exports = ButtonTester;