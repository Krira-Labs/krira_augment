// Update bot embedding dimension to 512
import mongoose from 'mongoose';
import { Chatbot } from './src/models/chatbot.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function updateBot() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        const bot = await Chatbot.findOne({ name: 'employee3' });

        if (!bot) {
            console.log('❌ Bot not found');
            return;
        }

        console.log('Current dimension:', bot.embedding.dimension);

        // Update to 512
        bot.embedding.dimension = 512;
        await bot.save();

        console.log('✓ Updated dimension to 512');
        console.log('New dimension:', bot.embedding.dimension);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateBot();
