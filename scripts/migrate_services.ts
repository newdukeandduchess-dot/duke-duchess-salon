import { connect } from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Define Service Schema inline to avoid Next.js imports if we run as standalone node script
import mongoose from 'mongoose';
const ServiceSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
}, { strict: false });
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

async function migrate() {
  try {
    console.log('Connecting to database...');
    await connect(process.env.MONGODB_URI as string);
    console.log('Connected.');

    const services = await Service.find({});
    console.log(`Found ${services.length} services.`);

    let updatedCount = 0;

    for (const service of services) {
      if (service.category && typeof service.name === 'string') {
        const cat = service.category.toUpperCase();
        let name = service.name.trim();

        // Remove any existing incorrect prefixes
        const prefixesToRemove = ['MEN- ', 'WOMEN- ', 'MEN-', 'WOMEN-', 'DUKE- ', 'DUCHESS- ', 'DUKE-', 'DUCHESS-'];
        for (const prefix of prefixesToRemove) {
          if (name.toUpperCase().startsWith(prefix)) {
            name = name.substring(prefix.length).trim();
            break;
          }
        }

        let needsUpdate = false;

        if (cat.startsWith('MEN')) {
          name = 'DUKE- ' + name;
          needsUpdate = true;
        } else if (cat.startsWith('WOMEN')) {
          name = 'DUCHESS- ' + name;
          needsUpdate = true;
        }

        if (needsUpdate && service.name !== name) {
          service.name = name;
          await service.save();
          console.log(`Updated: ${service.name}`);
          updatedCount++;
        }
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} services.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
