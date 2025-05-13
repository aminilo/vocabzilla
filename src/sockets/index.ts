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

    socket.on('word:practiced', async (data) => {
      // console.log('📥 Received word:practiced event:', data);
      const { userId, itemType, itemId, status } = data;
      if( !userId || !itemType || !itemId ) return;

      const progressStatus = status === 'mastered' ? ProgressStatus.mastered : ProgressStatus.partial;
      const itemTypeEnum = itemType === 'enexp'
        ? ProgressItemType.enexp
        : itemType === 'cihui'
        ? ProgressItemType.cihui
        : itemType === 'hanzi'
        ? ProgressItemType.hanzi
        : null;

      if (!itemTypeEnum) {
        socket.emit('progress:error', { message: 'Invalid itemType' });
        return;
      }
      try{
        const existing = await prisma.userProgress.findUnique({
          where: {
            userId_itemType_itemId: {
              userId,
              itemType: itemTypeEnum,
              itemId,
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
              userId, itemType, itemId
            },
          },
          update: { status: progressStatus, updatedAt: new Date() },
          create: { userId, itemType: itemTypeEnum, itemId, status: progressStatus }
        });

        // const xpGain = status === 'mastered' ? 10 : 2;
        // const xpGain = status === 'mastered' ? 10 : Math.min(10, 5 * (data.correctCount || 1));
        const xpGain = 5 * (data.correctCount || 1);
        const user = await prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: xpGain } }
        });

        const newLevel = calculateLevel(user.xp);
        if(newLevel !== user.level){
          await prisma.user.update({
            where: { id: userId },
            data: { level: newLevel }
          });
          io.to(userId).emit('level:up', { newLevel });
        }

        io.to(userId).emit('xp:updated', {
          xpGain,
          currentXp: user.xp,
          currentLevel: newLevel
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
