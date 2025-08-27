import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'src/assets/data/img');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

async function betterScrapeL2Watch() {
  console.log('🚀 Starting improved L2 Watch scraping...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    timeout: 60000
  });
  
  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid being blocked
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('📄 Loading L2 Watch page...');
    await page.goto('https://l2.watch/', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    
    // Wait for the table to load
    console.log('⏳ Waiting for table to load...');
    await page.waitForSelector('table', { timeout: 30000 });
    
    console.log('🔍 Extracting protocol data and images...');
    
    // Extract all protocol data from the table
    const protocols = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      const protocols = [];
      
      rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 1) {
          const nameCell = cells[0];
          const nameLink = nameCell.querySelector('a');
          
          if (nameLink) {
            const protocolName = nameLink.textContent.trim();
            const protocolUrl = nameLink.href;
            
            // Look for images in the name cell or nearby
            let imageUrl = null;
            let imageAlt = null;
            
            // Check if there's an image in the name cell
            const img = nameCell.querySelector('img');
            if (img) {
              imageUrl = img.src;
              imageAlt = img.alt || protocolName;
            }
            
            // If no image in name cell, check the entire row
            if (!imageUrl) {
              const rowImg = row.querySelector('img');
              if (rowImg) {
                imageUrl = rowImg.src;
                imageAlt = rowImg.alt || protocolName;
              }
            }
            
            protocols.push({
              name: protocolName,
              url: protocolUrl,
              imageUrl: imageUrl,
              imageAlt: imageAlt,
              rowIndex: index
            });
          }
        }
      });
      
      return protocols;
    });
    
    console.log(`📊 Found ${protocols.length} protocols`);
    
    // Download images for protocols that have them
    const downloadedImages = [];
    
    for (const protocol of protocols) {
      if (protocol.imageUrl && protocol.imageUrl !== '') {
        try {
          console.log(`⬇️  Downloading image for ${protocol.name}...`);
          
          // Generate filename from protocol name
          const filename = generateFilename(protocol.name);
          const filepath = path.join(imagesDir, filename);
          
          // Try to download the image with better error handling
          const response = await page.goto(protocol.imageUrl, { 
            waitUntil: 'domcontentloaded',
            timeout: 10000 
          });
          
          if (response.ok()) {
            const buffer = await response.buffer();
            
            // Check if the image is actually valid (not empty)
            if (buffer.length > 1000) { // At least 1KB
              // Save the image
              fs.writeFileSync(filepath, buffer);
              
              downloadedImages.push({
                protocolName: protocol.name,
                filename: filename,
                originalUrl: protocol.imageUrl,
                size: buffer.length
              });
              
              console.log(`✅ Downloaded: ${filename} (${buffer.length} bytes)`);
            } else {
              console.log(`⚠️  Image too small for ${protocol.name}: ${buffer.length} bytes`);
            }
          } else {
            console.log(`❌ HTTP error for ${protocol.name}: ${response.status()}`);
          }
          
          // Small delay to be respectful
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`❌ Failed to download image for ${protocol.name}:`, error.message);
        }
      } else {
        console.log(`⚠️  No image found for ${protocol.name}`);
      }
    }
    
    console.log(`\n🎉 Scraping completed!`);
    console.log(`📁 Downloaded ${downloadedImages.length} valid images to ${imagesDir}`);
    
    // Save the mapping data
    const mappingData = {
      scrapedAt: new Date().toISOString(),
      totalProtocols: protocols.length,
      imagesDownloaded: downloadedImages.length,
      protocols: protocols,
      downloadedImages: downloadedImages
    };
    
    const mappingFile = path.join(__dirname, 'better-scraping-results.json');
    fs.writeFileSync(mappingFile, JSON.stringify(mappingData, null, 2));
    console.log(`📋 Results saved to: ${mappingFile}`);
    
    return downloadedImages;
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

function generateFilename(protocolName) {
  // Clean the protocol name for filename
  return protocolName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/²/g, '2') // Handle special characters like B²
    .trim() + '.png';
}

// Run the scraper
betterScrapeL2Watch()
  .then(() => {
    console.log('✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Scraping failed:', error);
    process.exit(1);
  });
