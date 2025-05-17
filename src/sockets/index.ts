import type { Server, Socket } from 'socket.io';
import { PrismaClient, ProgressItemType, ProgressStatus } from '@prisma/client';
import { calculateLevel } from '../utils/levelSystem';

const prisma = new PrismaClient();

export const registerSocketHandlers = (io: Server)=> {
  io.on('connection', (socket: Socket)=> {
    // console.log('⚡📡 New Client Connected');

    socket.on('join', (userId: string)=> {
      if(!userId) return;
      socket.join(userId); /* Group sockets by user ID when they connect */
      // console.log(`👥 User ${userId} joined their room`);
    });

    socket.on('word:practiced', async (data)=> {
      const { userId, itemType, itemId, status, correctCount } = data;
      if( !userId || !itemType || !itemId ) return;

      // console.log('📥 Received word:practiced event:', data);

      const normalizedStatus = String(status).toLowerCase();
      const progressStatus = normalizedStatus === 'mastered' ? ProgressStatus.mastered : ProgressStatus.partial;

      const itemTypeEnumMap = {
        enexp: ProgressItemType.enexp,
        cihui: ProgressItemType.cihui,
        hanzi: ProgressItemType.hanzi
      };

      const itemTypeEnum = itemTypeEnumMap[itemType as keyof typeof itemTypeEnumMap] || null;

      if( !itemTypeEnum ) {
        socket.emit('progress:error', { message: 'Invalid itemType' });
        return;
      }
      
      console.log('[debug] itemType:', itemType, '| resolved:', itemTypeEnum);

      try{
        const existing = await prisma.userProgress.findUnique({
          where: {
            userId_itemType_itemId: {
              userId,
              itemType: itemTypeEnum,
              itemId
            }
          }
        });

        const isNewMastery = !(existing && existing.status === 'mastered');
        if(!isNewMastery){
          socket.emit('progress:saved', { itemId, itemType, status: existing.status });
          return;
        }

        await prisma.userProgress.upsert({
          where: {
            userId_itemType_itemId: {
              userId, itemType: itemTypeEnum, itemId
            },
          },
          update: { status: progressStatus, updatedAt: new Date() },
          create: { userId, itemType: itemTypeEnum, itemId, status: progressStatus }
        });

        const xpGain = 5 * correctCount;
        const isChinese = itemTypeEnum === 'hanzi' || itemTypeEnum === 'cihui';
        const xpField = isChinese ? 'chXp' : 'enXp';
        const levelField = isChinese ? 'chLevel' : 'enLevel';

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            [xpField]: { increment: xpGain }
          }
        });

        const currentXp = updatedUser[xpField];
        if (typeof currentXp !== 'number') {
          socket.emit('progress:error', { message: 'XP field missing on user' });
          return;
        }
        const currentLevel = updatedUser[levelField];
        const newLevel = calculateLevel(currentXp);

        if (newLevel !== currentLevel) {
          await prisma.user.update({
            where: { id: userId },
            data: { [levelField]: newLevel }
          });
          io.to(userId).emit('level:up', { newLevel, lang: isChinese ? 'ch' : 'en' });
        }

        io.to(userId).emit('xp:updated', {
          xpGain,
          currentXp,
          currentLevel: newLevel,
          lang: isChinese ? 'ch' : 'en'
        });

        // console.log('[server] Emitting xp:updated to user:', userId);
        socket.emit('progress:saved', { itemId, itemType, status });
        // console.log(`📘 Progress saved for user ${userId}: ${itemType} #${itemId}`);
      }catch(err){
        console.error('❌ Error saving progress:', err);
        socket.emit('progress:error', { message: 'Could not save progress' });
      }
    });

    socket.on('disconnect', ()=> {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });
};
